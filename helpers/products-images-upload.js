var EmailTemplate = require('./email-send'); // Contain email templates
var _ = require('underscore'); // used Underscore for template settings
const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-writer');
const sharp = require('sharp');
const request = require('request');
const async = require('async');
const URL = require("url").URL;
const path = require('path');
var aws = require('aws-sdk');
const env = process.env.NODE_ENV || 'development';
const Product = require('../models/product.model');
const S3 = require('./s3');
const Config = require('../config/config');
const log = require('log-to-file');

var sqs = new aws.SQS();
var merchantId = '';
const iconv = require('iconv-lite');
var ignoredProducts = [];


/*
 |--------------------------------------------------------------------------
 | Create Products from uploaded csv file
 |--------------------------------------------------------------------------
*/
exports.uploadImages = (req, res) => {
  return {
    file: null,
    mailReceipt: null,
    products: [],
    readStream: null,
    csvHandler: null,
    csvFileHeader: [],
    productsLength: 0,
    requiredFieldsName: ['Product_Name', 'SKU', 'Image_Url', 'Selling_Price', 'Product_Description'],
    init(file, products_length, email) {
      //console.log('products_length: ', products_length, 'email : ', email);
      this.file = file;
      this.productsLength = products_length;
      this.readCsvFile(file);
      this.mailReceipt = email.trim() || 'basit.dev@pk.see.biz';
    },
    readCsvFile(file) {
      this.readStream = fs.createReadStream(file.path);
      var decodeStream = this.readStream.pipe(iconv.decodeStream('win1251'));
      this.csvHandler = decodeStream.pipe(csv());
      // read first line as header from csv file.
      this.csvHandler.on('headers', this.processHeader.bind(this));
      // Each line in csvfile will be successively available here as `line`.
      this.csvHandler.on('data', this.lineReader.bind(this));
      // file read done.
      this.csvHandler.on('end', this.processData.bind(this));
    },
    processHeader(headers) {
      // required field is missing then stop further processing...
      if (!headers.includes('Product_Name') || !headers.includes('SKU') || !headers.includes('Image_Url') || !headers.includes('Selling_Price')) {
        this.deleteFile();
        this.readStream.close();
        this.csvHandler.removeListener('data', this.lineReader);
        this.response('danger', 'File Rejected!', 'File is not in required format.');
      }
      // format header for new csv file...
      this.csvFileHeader = headers.map(header => { return { 'id': header, 'title': header } });
      //remove description header from csv
      for (let i = 0; i < this.csvFileHeader.length; i++) {
        if (this.csvFileHeader[i].id === 'Product_Description') {
          this.csvFileHeader.splice(i, 1);
        }
      }
      // avoid duplicate column add...
      if (!headers.includes('reason')) {
        // add validation failed reason - msg
        this.csvFileHeader.push({ id: 'reason', title: 'reason' });
      }
    },
    lineReader(line) {
      result = this.validateProduct(line);
      // console.log('single product: ', result);

      if (result.status) {
        this.products.push(line);
      } else {
        line.reason = result.msg;
        ignoredProducts.push(line);
      }
    },
    async processData() {
      if (this.productsLength > 0) {
        for (let j = 0; j < this.productsLength; j++) {
          console.log('j', j + 1);
          await updateImages(j);
          console.log('*********');
          if ((j + 1) === this.productsLength) {
            //console.log('inside if condition');
            this.sendMail();
          }
        }
      }
      else {
        this.response('danger', 'No Product Image Url in SQS', "No product is in sqs queue!");
      }

    },
    validateProduct(product) {
      if (!product.Product_Name)
        return { status: false, msg: 'Product name is missing.' };
      if (!product.SKU)
        return { status: false, msg: 'Product sku is missing.' };
      if (!product.Selling_Price)
        return { status: false, msg: 'Product price is missing.' };
      if (!product.Image_Url)
        return { status: false, msg: 'Product image_url is missing.' };
      if (product.Product_Name && product.SKU && product.Image_Url && product.Selling_Price && product.Product_Description) {
        return { status: true };
      }
      return { status: false };
    },
    sendMail() {
      // filename...
      //console.log('in send mail');
      const fileName = path.basename(this.file.originalname, path.extname(this.file.originalname));

      const attachments = [];

      if (ignoredProducts && ignoredProducts.length) {
        createLog(ignoredProducts, 'ignore-product-images');
        const csvStringify = csvWriter.createObjectCsvStringifier({ header: this.csvFileHeader });
        attachments.push({
          filename: `${fileName}-ignored-images.csv`,
          content: csvStringify.getHeaderString() + csvStringify.stringifyRecords(ignoredProducts),
          contentType: 'text/plain'
        });
      }

      if (attachments.length && this.mailReceipt) {
        //console.log('message sent to:',this.mailReceipt.trim());
        EmailTemplate.csvFileRecordsFeedback({ email: this.mailReceipt.trim(), attachments: attachments });
      }
      this.deleteFile();
      merchantId = '';
    },
    deleteFile() {
      console.log('before delete file');
      fs.unlink(this.file.path, () => { });
    },
    response(type, intro, message) {
      //req.session.message = { type, intro, message };
      res.json({ 'status': type, 'intro': intro, 'message': message });
    }
  }
};

async function updateImages(j) {
  //console.log('i m here');
  return new Promise(async function (resolve) {
    let sqs_resp = await receiveSQSMessage();
    //console.log('sqs receive resp',sqs_resp);
    if (sqs_resp.status === true) {
      //console.log('status is true');
      var product = JSON.parse(sqs_resp.product);
      //****************
      //console.log('product in upload image script',product);
      merchantId = product.merchant_id;
      var response = await copyFile(product, product.merchant_id);
      //console.log('response', response);
      if (response && response.status && response.files) {
        // main image...
        const main_image = response.files[0][0].key;
        // more images...
        const moreImages = response.files.map(files => files[0].key);
        // optimized images...
        const optimizedImages = response.files.map(files => { return { size500: files[1].key, size480: files[2].key, size250: files[3].key, size100: files[4].key, size80: files[5].key }; });
        //console.log(optimizedImages);
        const productObj = {
          main_image: main_image,
          images: moreImages,
          optimizedImages: optimizedImages,
        };

        if (response.message) {
          // also add product image failure reason and add it to ignoredProducts...
          product.reason = response.message.join(' | ');
          ignoredProducts.push(getProductArray(product));
          //console.log('ignoredProducts 196',ignoredProducts);
        }

        // create or update existing record...
        Product.findOneAndUpdate({ merchant_id: product.merchant_id, sku: product.sku }, productObj, { upsert: true, new: true }, (err, doc, res) => {
          //console.log('update product');
          if (err) {
            product.reason = 'unable to save images - db message: ' + err.message;
            ignoredProducts.push(getProductArray(product));
            //console.log('ignoredProducts 205',ignoredProducts);
            resolve();
          }
          console.log('Finally Done - Images uploaded for: ', product.sku, ' ---- ', j + 1); //database operation done...
          resolve();
        });
      }
      else {
        //console.log('fail response', response);
        product.reason = response.message.join(' | ');
        ignoredProducts.push(getProductArray(product)); //image error...
        //console.log('ignoredProducts 216',ignoredProducts);
        resolve();
      }
    }
    else {
      //console.log('i m here in else');
      resolve();
    }

    //****************
  });
}

function receiveSQSMessage() {
  //console.log('i m here in receiveSQSMessage');
  return new Promise((resolve, reject) => {
    var params = {
      AttributeNames: ["SentTimestamp"],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: ["All"],
      QueueUrl: queueUrl,
      VisibilityTimeout: 10,
      WaitTimeSeconds: 0
    };
    sqs.receiveMessage(params, function (err, data) {
      if (err) {
        //res.send({error:err});
        console.log('error', err);
        // updateImages function not using any catch or rejection method
        var productLog = 'Receive SQS Queue Message Error' + JSON.stringify(err);
        log(productLog, 'csv_product_images/csv-images.log');
        resolve({ error: err, status: false });
      }
      else if (data.Messages) {
        //console.log('data',data.Messages[0].Body);
        var product = data.Messages[0].Body;
        //console.log('******************');
        //deleteMessageId = data.Messages[0].ReceiptHandle;
        //console.log('deleteMessageId', data.Messages[0].ReceiptHandle);
        //console.log('******************');
        deleteSQSMessage(data.Messages[0].ReceiptHandle).then(success => {
          if (success === 'success') {
            resolve({ product: product, status: true });
          }
        }, err => {
          console.log('error deleteSQSMessage', err);
          // updateImages function not using any catch or rejection method
          resolve({ error: err, status: false });
        });
      }
      else {
        var productLog = 'No product found in sqs queue';
        log(productLog, 'csv_product_images/csv-images.log');
        // updateImages function not using any catch or rejection method
        resolve({ error: productLog, status: false });
      }
    });
  });
}

function deleteSQSMessage(id) {
  //console.log('i m here in deleteSQSMessage');
  return new Promise((resolve, reject) => {
    var deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: id
    };
    sqs.deleteMessage(deleteParams, function (err, data) {
      if (err) {
        var message = 'SQS delete message error' + err;
        var productLog = 'Delete SQS Queue Message Error' + JSON.stringify(err);
        log(productLog, 'csv_product_images/csv-images.log');
        reject(message);
      } else {
        resolve('success');
      }
    });
  });
}

async function copyFile(product, userId) {
  return new Promise(function (resolve) {
    const header = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36'
    };

    const imageFiles = [];
    const validUrls = [];
    const imageFilesErrorMessage = [];
    const imageUrlsMapping = validateImageUrls(product.img_url);
    const productImageName = product.name.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').join('-').toLowerCase();
    const product_id = product.product_id;

    imageUrlsMapping.forEach(urlObj => {
      if (!urlObj.status) {
        imageFilesErrorMessage.push(`${urlObj.url}: Product image_url is not correct.`);
      } else {
        validUrls.push(urlObj.url);
      }
    });

    async.forEachOf(validUrls, async (imageUrl, index) => {
      try {
        const resolvedImage = await fetchImage(imageUrl, `${productImageName}-${index}`, `${product_id}`);
        imageFiles.push(resolvedImage.data);
      } catch (err) {
        imageFilesErrorMessage.push(`${imageUrl}: ${err.message}`);
      }
      return;
    }, (err) => {
      // if there any error...
      if (err) {
        resolve({ status: false, message: err.message });
      }
      // no image file able to fetch & upload...
      if (imageFiles.length == 0) {
        resolve({ status: false, message: imageFilesErrorMessage });
      }
      // lets say 2 files, one file success and one file error, so a partial success...
      if (imageFiles.length && imageFilesErrorMessage.length) {
        resolve({ status: true, message: imageFilesErrorMessage, files: imageFiles });
      }
      // files successfully uploaded...
      if (imageFiles.length) {
        resolve({ status: true, files: imageFiles });
      }
    });

    function fetchImage(imageUrl, imageName, product_id) {
      return new Promise((resolve, reject) => {
        request({ uri: imageUrl, encoding: null, headers: header }, function (err, response, body) {
          if (err) {
            // log full error to log files...
            reject({ status: false, message: 'Error fetching an image.' });
          }
          else {
            let type = response.headers['content-type'];
            type = type.includes("application/save") ? 'image/jpeg' : type;

            if (type.toLowerCase().match(/(jpeg|jpg|gif|png)$/)) {

              async function getFileMetaData(buffer) {
                const metaReader = sharp(body);
                return await metaReader.metadata();
              }

              // get width, height...
              getFileMetaData().then(info => {
                if (info.width >= 300 && info.height >= 300) {
                  let extn = type.split('/');
                  let fileName = imageName + '.' + extn[1];

                  const uploadFilePromises = [
                    new Promise(async (resolve, reject) => {
                      let uploadUrl = `${userId}/products/${product_id}/original/${fileName}`;
                      //console.log('uploadUrl',uploadUrl);
                      //console.log('body', body);
                      //console.log('type', type);
                      await S3.upFile(uploadUrl, body, type, function (err, data) {
                        //console.log('err', err);
                        //console.log('data', data);
                        if (err) {
                          // log full error to log files...
                          //console.log('S3 error original', err);
                          reject(err);
                        }
                        //console.log('resolve data for original image');
                        resolve(data);
                      });
                    })
                  ];

                  // build different sizes...
                  let size500 = sharp(body).resize({ width: 500 }).jpeg({ quality: 100 });
                  let size480 = sharp(body).resize({ width: 480 }).jpeg({ quality: 100 });
                  let size250 = sharp(body).resize({ width: 250 }).jpeg({ quality: 100 });
                  let size100 = sharp(body).resize({ width: 100 }).jpeg({ quality: 100 });
                  let size80 = sharp(body).resize({ width: 80 }).jpeg({ quality: 100 });

                  let optimizedImageBuffers = [size500, size480, size250, size100, size80];
                  let folders = ['500', '480', '250', '100', '80'];

                  optimizedImageBuffers.forEach((image, index) => {
                    uploadFilePromises.push(
                      new Promise((resolve, reject) => {
                        const file_path = `${userId}/products/${product_id}/${folders[index]}/${fileName}`;
                        //console.log('file_path',file_path);
                        S3.upFile(file_path, image, type, function (err, data) {
                          //console.log('err', err);
                          //console.log('data', data);
                          if (err) {
                            // log full error to log files...
                            //console.log('S3 error optimizedImageBuffers', err);
                            reject(err);
                          }
                          //console.log('resolve data for optimized image');
                          resolve(data);
                        });
                      })
                    );
                  });

                  // // start upload procedure... if main image failed to upload, no need to upload different sizes...
                  uploadFilePromises.shift().then(file => {
                    Promise.all(uploadFilePromises.map(p => p.catch(e => e)))
                      .then(results => {
                        // check is there any failed operation...
                        const validResults = results.filter(result => !(result instanceof Error));
                        // if sized upload files length is 5 it means all file sizes uploaded, so a successful case...
                        if (validResults.length == 5) {
                          validResults.unshift(file);
                          resolve({ status: true, data: validResults });
                        }
                        else {
                          // cleanup: remove uploaded files if any, and return error response.
                          S3.delFile(file.key, (err, data) => {
                            results.forEach(result => {
                              if (!(result instanceof Error)) {
                                // delete file from s3 bucket... (file uploaded, one of the sized images couldn't upload, so clean all uploaded files)
                                S3.delFile(result.key, (err, data) => console.log('delete wrong file data: ', err, data));
                              }
                            });
                          });

                          reject({ status: false, message: 'Error saving an image on S3 bucket.' });
                        }
                      })
                      .catch(error => {
                        // log full error to log files...
                        reject({ status: false, message: 'Error saving an image on S3 bucket.' });
                      });
                  })
                    .catch(error => {
                      // log full error to log files...
                      reject({ status: false, message: 'Error saving an image on S3 bucket.' });
                    });
                }
                else {
                  reject({ status: false, message: 'File resolution is below 300x300.' });
                }
              })
                .catch(error => {
                  reject({ status: false, message: 'Error getting file metadata.' })
                });
            }
            else {
              reject({ status: false, message: 'Unsupported file type.' })
            }
          }
        });
      });
    }

  });
}

function validateImageUrls(urlString) {
  const urlMapping = [];
  urlString.split('|').forEach(originalUrl => {
    try {
      const trimmedUrl = originalUrl.trim();
      const imageUrl = decodeURIComponent(trimmedUrl);
      const url = new URL(imageUrl);
      // as many checks can be added to further validate the url...
      urlMapping.push({ status: imageUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? true : false, url: trimmedUrl });
    } catch (err) {
      urlMapping.push({ status: false, url: originalUrl });
    }
  });

  return urlMapping;
}

function getProductArray(product) {
  let product_array = {
    SKU: product.sku,
    Image_Url: product.img_url,
    Product_Name: product.name,
    Product_Url: product.product_url,
    reason: product.reason,
    Selling_Price: product.price,
    Category: product.category,
  };
  return (product_array);
}

function createLog(productsArray, message) {
  productsArray.forEach(function (product) {
    product.merchant_id = merchantId;
    var productLog = message + ' ' + JSON.stringify(product);
    log(productLog, 'csv_product_images/csv-images.log');
  });
}

