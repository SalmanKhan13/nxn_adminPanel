const productHelper = require("./product");
const EmailTemplate = require("./email-send"); // Contain email templates
const _ = require("underscore"); // used Underscore for template settings
const fs = require("fs");
const csv = require("csv-parser");
const csvWriter = require("csv-writer");
const shortId = require("shortid");
const sharp = require("sharp");
const randomString = require("random-string");
const request = require("request");
const async = require("async");
const URL = require("url").URL;
const path = require("path");
const Product = require("../models/product.model");
const S3 = require("./s3");

/*
 |--------------------------------------------------------------------------
 | Create Products from uploaded csv file
 |--------------------------------------------------------------------------
*/
exports.Import = (req, res) => {
  return {
    file: null,
    userId: null,
    catalogId: null,
    mailReceipt: null,
    products: [],
    ignoredProducts: [],
    duplicateProducts: [],
    readStream: null,
    csvHandler: null,
    csvFileHeader: [],
    requiredFieldsName: [
      "Product_Name",
      "SKU",
      "Image_Url",
      "Selling_Price",
      "Product_Description",
    ],
    init(file, fields) {
      // console.log('file, fields: ', this, file, fields);
      this.file = file;
      this.userId = fields.userId;
      this.catalogId = fields.catalogId;
      this.mailReceipt = fields.email || "shakeel.latif@pk.see.biz";
      this.readCsvFile(file);
    },
    readCsvFile(file) {
      this.readStream = fs.createReadStream(file.path);
      this.csvHandler = this.readStream.pipe(csv());
      // read first line as header from csv file.
      this.csvHandler.on("headers", this.processHeader.bind(this));
      // Each line in csvfile will be successively available here as `line`.
      this.csvHandler.on("data", this.lineReader.bind(this));
      // file read done.
      this.csvHandler.on("end", this.processData.bind(this));
    },
    processHeader(headers) {
      // required field is missing then stop further processing...
      if (
        !headers.includes("Product_Name") ||
        !headers.includes("SKU") ||
        !headers.includes("Image_Url") ||
        !headers.includes("Selling_Price") ||
        !headers.includes("Product_Description")
      ) {
        this.deleteFile();
        this.readStream.close();
        this.csvHandler.removeListener("data", this.lineReader);
        this.response(
          "danger",
          "File Rejected!",
          "File is not in required format."
        );
        return;
      }
      // format header for new csv file...
      this.csvFileHeader = headers.map((header) => {
        return { id: header, title: header };
      });
      // avoid duplicate column add...
      if (!headers.includes("reason")) {
        // add validation failed reason - msg
        this.csvFileHeader.push({ id: "reason", title: "reason" });
      }
    },
    addslashes(string) {
      return string
        .replace(/\\/g, "\\\\")
        .replace(/\u0008/g, "\\b")
        .replace(/\uFFFD/g, "") // null or invalid characters �
        .replace(/\t/g, "\\t")
        .replace(/\n/g, "\\n")
        .replace(/\f/g, "\\f")
        .replace(/\r/g, "\\r")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');
    },
    lineReader(line) {
      result = this.validateProduct(line);

      line.Product_Name = this.addslashes(line.Product_Name);

      if (result.status) {
        this.products.push(line);
      } else {
        line.reason = result.msg;
        this.ignoredProducts.push(line);
      }
    },
    processData() {
      if (this.products.length) {
        // return response and let processing asyc...
        this.response(
          "success",
          "File Accepted!",
          "Products uploading is in progress, once done will be notify by email."
        );
        this.removeDuplicateProducts()
          .then((products) => {
            const slug = shortId.generate().toLowerCase();
            // fetch images of each product one by one...
            async.forEachOf(
              products,
              (product, i, callback) => {
                setTimeout(
                  () =>
                    this.copyFile(product, this.userId, i, (response) => {
                      if (response && response.status && response.files) {
                        // fomat product...
                        const productFormat = this.formatProduct({
                          ...product,
                          slugPrefix: slug,
                        });
                        // main image...
                        const main_image = response.files[0][0].key;
                        // more images...
                        const moreImages = response.files.map(
                          (files) => files[0].key
                        );
                        // optimized images...
                        const optimizedImages = response.files.map((files) => {
                          return {
                            size80: files[1].key,
                            size480: files[2].key,
                          };
                        });

                        const productObj = {
                          ...productFormat,
                          merchant_id: this.userId,
                          catalogCategory: this.catalogId,
                          main_image: main_image,
                          images: moreImages,
                          optimizedImages: optimizedImages,
                        };

                        if (response.message) {
                          // also add product image failure reason and add it to ignoredProducts...
                          product.reason = response.message.join(" | ");
                          this.ignoredProducts.push(product);
                        }

                        // create or update existing record...
                        Product.findOneAndUpdate(
                          { merchant_id: this.userId, sku: product.sku },
                          productObj,
                          { upsert: true, new: true },
                          (err, doc, res) => {
                            if (err) {
                              product.reason =
                                "unable to save - db message: " + err.message;
                              this.ignoredProducts.push(product);
                            }

                            callback(); //database operation done...
                          }
                        );
                      } else {
                        product.reason = response.message.join(" | ");
                        this.ignoredProducts.push(product);
                        callback(); //image error...
                      }
                    }),
                  i * 1000
                );
              },
              (err) => {
                if (err) console.error(err.message);
                // final block: generate csv from ignoredProducts and send as attachment in email.
                this.sendMail();
                // this.ignoredProducts.forEach(item => console.log('itemssssss', item.reason) );
                console.log(
                  "Finally Done - Rejected Records: ",
                  this.ignoredProducts.length,
                  " Duplicate Records: ",
                  this.duplicateProducts,
                  " Completed Records: ",
                  products.length
                );
              }
            );
          })
          .catch(function (err) {
            console.error(err);
            this.response("danger", "File Processing Error", err.message);
          });
      } else {
        this.response(
          "danger",
          "File Processing Error",
          "No product pass the validations!"
        );
      }
      // once done remove the file...
      this.deleteFile();
    },
    validateProduct(product) {
      if (!product.Product_Name)
        return { status: false, msg: "Product name is missing." };
      if (!product.SKU)
        return { status: false, msg: "Product sku is missing." };
      if (!product.Selling_Price)
        return { status: false, msg: "Product price is missing." };
      if (!product.Product_Description)
        return { status: false, msg: "Product description is missing." };
      if (!product.Image_Url)
        return { status: false, msg: "Product image_url is missing." };
      if (
        product.Product_Name &&
        product.SKU &&
        product.Image_Url &&
        product.Selling_Price &&
        product.Product_Description
      ) {
        return { status: true };
      }
      return { status: false };
    },
    formatProduct(product) {
      price = parseFloat(product.Selling_Price.replace(/\$/g, ""));

      return {
        title: product.Product_Name,
        slug:
          product.slugPrefix +
          "-" +
          productHelper.createSlug(product.Product_Name),
        price: isNaN(price) ? 0 : price,
        sku: product.SKU,
        upc: product.UPC || "",
        brand: product.Brand || "",
        manufacturer: product.Manufacturer || "",
        totalCost: product.Purchase_Price || 0,
        description: product.Product_Description || "",
      };
    },
    validateImageUrls(urlString) {
      const urlMapping = [];

      urlString.split("|").forEach((originalUrl) => {
        try {
          const trimmedUrl = originalUrl.trim();
          const imageUrl = decodeURIComponent(trimmedUrl);
          const url = new URL(imageUrl);
          // as many checks can be added to further validate the url...
          urlMapping.push({
            status: imageUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? true : false,
            url: trimmedUrl,
          });
        } catch (err) {
          urlMapping.push({ status: false, url: originalUrl });
        }
      });

      return urlMapping;
    },
    removeDuplicateProducts() {
      return new Promise((resolve, reject) => {
        let productSkus = this.products.map(({ SKU }) => SKU);
        const finalProducts = [];
        Product.find(
          { merchant_id: this.userId, sku: { $in: productSkus } },
          { sku: 1, _id: 0 }
        ).exec((err, docs) => {
          if (err) reject({ msg: "unable to check products in database." });
          if (docs && docs.length) {
            const duplicates = [];
            fetchedDocs = docs.map(({ sku }) => sku);
            productSkus.forEach((item) => {
              const product = this.products.find(({ SKU }) => SKU === item);
              if (!fetchedDocs.includes(item)) {
                finalProducts.push(product);
              } else {
                duplicates.push(product);
              }
            });
            this.duplicateProducts = duplicates;
            // resolve(this.products);
            resolve(finalProducts);
          } else {
            resolve(this.products);
          }
        });
      });
    },
    deleteFile() {
      fs.unlink(this.file.path, () => {});
    },
    sendMail() {
      // filename...
      const fileName = path.basename(
        this.file.originalname,
        path.extname(this.file.originalname)
      );

      const attachments = [];

      if (this.ignoredProducts && this.ignoredProducts.length) {
        const csvStringify = csvWriter.createObjectCsvStringifier({
          header: this.csvFileHeader,
        });
        attachments.push({
          filename: `${fileName}-ignored.csv`,
          content:
            csvStringify.getHeaderString() +
            csvStringify.stringifyRecords(this.ignoredProducts),
          contentType: "text/plain",
        });
      }

      if (this.duplicateProducts && this.duplicateProducts.length) {
        // remove reason key from duplicate file
        const header = this.csvFileHeader.filter(
          (header) => header.id !== "reason"
        );
        // build final header
        const csvDupStringify = csvWriter.createObjectCsvStringifier({
          header: header,
        });
        // build attachment
        attachments.push({
          filename: `${fileName}-duplicates.csv`,
          content:
            csvDupStringify.getHeaderString() +
            csvDupStringify.stringifyRecords(this.duplicateProducts),
          contentType: "text/plain",
        });
      }

      if (attachments.length && this.mailReceipt) {
        EmailTemplate.csvFileRecordsFeedback({
          email: this.mailReceipt,
          attachments: attachments,
        });
      }
    },
    copyFile(product, userId, i, callback) {
      const header = {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36",
      };

      let imageFiles = [];
      const validUrls = [];
      const imageFilesErrorMessage = [];
      const imageUrlsMapping = this.validateImageUrls(product.Image_Url);

      const productImageName =
        product.Product_Name.replace(/[^a-zA-Z0-9 ]/g, "")
          .split(" ")
          .join("-")
          .toLowerCase() +
        "-" +
        product.SKU;

      imageUrlsMapping.forEach((urlObj) => {
        if (!urlObj.status) {
          imageFilesErrorMessage.push(
            `${urlObj.url}: Product image_url is not correct.`
          );
        } else {
          validUrls.push(urlObj.url);
        }
      });

      async.forEachOf(
        validUrls,
        async (imageUrl, index) => {
          try {
            const resolvedImage = await fetchImage(
              imageUrl,
              `${productImageName}-${index}`,
              index
            );
            imageFiles.unshift(resolvedImage.data);
          } catch (err) {
            imageFilesErrorMessage.push(`${imageUrl}: ${err.message}`);
          }
          return;
        },
        (err) => {
          // if there any error...
          if (err) {
            return callback({ status: false, message: err.message });
          }
          // no image file able to fetch & upload...
          if (imageFiles.length == 0) {
            return callback({ status: false, message: imageFilesErrorMessage });
          }

          // sort files...
          imageFiles = imageFiles.sort((file1, file2) => {
            return file1[0].at - file2[0].at;
          });

          // lets say 2 files, one file success and one file error, so a partial success...
          if (imageFiles.length && imageFilesErrorMessage.length) {
            return callback({
              status: true,
              message: imageFilesErrorMessage,
              files: imageFiles,
            });
          }
          // files successfully uploaded...
          if (imageFiles.length) {
            return callback({ status: true, files: imageFiles });
          }
        }
      );

      function fetchImage(imageUrl, imageName, index) {
        return new Promise((resolve, reject) => {
          request({ uri: imageUrl, encoding: null, headers: header }, function (
            err,
            response,
            body
          ) {
            if (err) {
              // log full error to log files...
              reject({ status: false, message: "Error fetching an image." });
            } else {
              let type = response.headers["content-type"];
              type = type.includes("application/save") ? "image/jpeg" : type;

              if (type.toLowerCase().match(/(jpeg|jpg|gif|png)$/)) {
                async function getFileMetaData(buffer) {
                  const metaReader = sharp(body);
                  return await metaReader.metadata();
                }

                // get width, height...
                getFileMetaData()
                  .then((info) => {
                    if (info.width >= 300 && info.height >= 300) {
                      let extn = type.split("/");
                      let fileName = imageName + "." + extn[1];

                      const uploadFilePromises = [
                        new Promise((resolve, reject) => {
                          let uploadUrl = `${userId}/products/${fileName}`;
                          S3.upFile(uploadUrl, body, type, function (
                            err,
                            data
                          ) {
                            if (err) {
                              // log full error to log files...
                              reject(err);
                            }
                            resolve(data);
                          });
                        }),
                      ];

                      // build different sizes...
                      let size80 = sharp(body)
                        .resize({ width: 160 })
                        .jpeg({ quality: 100 });
                      let size480 = sharp(body)
                        .resize({ width: 960 })
                        .jpeg({ quality: 100 });
                      let optimizedImageBuffers = [size80, size480];
                      let folders = ["size80", "size480"];

                      optimizedImageBuffers.forEach((image, index) => {
                        uploadFilePromises.push(
                          new Promise((resolve, reject) => {
                            const filepath = `${userId}/products/${folders[index]}/${fileName}`;
                            S3.upFile(filepath, image, type, function (
                              err,
                              data
                            ) {
                              if (err) {
                                // log full error to log files...
                                reject(err);
                              }
                              resolve(data);
                            });
                          })
                        );
                      });

                      // // start upload procedure... if main image failed to upload, no need to upload different sizes...
                      uploadFilePromises
                        .shift()
                        .then((file) => {
                          Promise.all(
                            uploadFilePromises.map((p) => p.catch((e) => e))
                          )
                            .then((results) => {
                              // check is there any failed operation...
                              const validResults = results.filter(
                                (result) => !(result instanceof Error)
                              );
                              // if sized upload files length is 2 it means both file sizes uploaded, so a successful case...
                              if (validResults.length == 2) {
                                finalFileObject = { ...file, at: index };
                                validResults.unshift(finalFileObject);
                                resolve({ status: true, data: validResults });
                              } else {
                                // cleanup: remove uploaded files if any, and return error response.
                                S3.delFile(file.key, (err, data) => {
                                  results.forEach((result) => {
                                    if (!(result instanceof Error)) {
                                      // delete file from s3 bucket... (file uploaded, one of the sized images couldn't upload, so clean all uploaded files)
                                      S3.delFile(result.key, (err, data) =>
                                        console.log(
                                          "delete wrong file data: ",
                                          err,
                                          data
                                        )
                                      );
                                    }
                                  });
                                });

                                reject({
                                  status: false,
                                  message:
                                    "Error saving an image on S3 bucket.",
                                });
                              }
                            })
                            .catch((error) => {
                              // log full error to log files...
                              reject({
                                status: false,
                                message: "Error saving an image on S3 bucket.",
                              });
                            });
                        })
                        .catch((error) => {
                          // log full error to log files...
                          reject({
                            status: false,
                            message: "Error saving an image on S3 bucket.",
                          });
                        });
                    } else {
                      reject({
                        status: false,
                        message: "File resolution is below 300x300.",
                      });
                    }
                  })
                  .catch((error) => {
                    reject({
                      status: false,
                      message: "Error getting file metadata.",
                    });
                  });
              } else {
                reject({ status: false, message: "Unsupported file type." });
              }
            }
          });
        });
      }
    },
    response(type, intro, message) {
      res.json({ status: type, intro: intro, message: message });
    },
  };
};
