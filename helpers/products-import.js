const productHelper = require('./product');
var EmailTemplate = require('./email-send'); // Contain email templates
var _ = require('underscore'); // used Underscore for template settings
const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-writer');
const shortId = require('shortid');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const Product = require('../models/product.model');
const Config = require('../config/config');
//aws.config = Config.Aws.AuthSQS[env];
var sqs = new aws.SQS();
const log = require('log-to-file');
const ProductImages = require('./products-images-upload');
var sqs_err_products = [];
var ignoredProducts = [];
var userId = null;
var catalogId = null;
var finalProductslength = 0;
const iconv = require('iconv-lite');
/*
 |--------------------------------------------------------------------------
 | Create Products from uploaded csv file
 |--------------------------------------------------------------------------
*/
exports.Import = (req, res) => {
  return {
    file: null,
    mailReceipt: null,
    products: [],
    duplicateProducts: [],
    readStream: null,
    csvHandler: null,
    csvFileHeader: [],
    requiredFieldsName: ['Product_Name', 'SKU', 'Image_Url', 'Selling_Price', 'Product_Description'],
    init(file, fields) {
      //console.log('file, ', this, file, fields);
      this.file = file;
      userId = fields.userId;
      catalogId = fields.catalogId;
      this.mailReceipt = fields.email || 'basit.dev@pk.see.biz';
      this.readCsvFile(file);
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
      if (!headers.includes('Product_Name') || !headers.includes('SKU') || !headers.includes('Image_Url') || !headers.includes('Selling_Price') || !headers.includes('Product_Description')) {
        this.deleteFile();
        this.readStream.close();
        this.csvHandler.removeListener('data', this.lineReader);
        this.response('danger', 'File Rejected!', 'File is not in required format.');
      }
      // format header for new csv file...
      this.csvFileHeader = headers.map(header => { return { 'id': header, 'title': header } });
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
    processData() {
      if (this.products.length) {
        //console.log('products.length', this.products.length);
        const slug = shortId.generate().toLowerCase();
        // return response and let processing asyc...
        this.response('success', 'File Accepted!', 'Products uploading is in progress, once done will be notify by email.');
        this.removeDuplicateProducts().then(async products => {
          //console.log('products',products.length);
          finalProductslength = products.length;
          for (let i = 0; i < products.length; i++) {
            //console.log('i',i);
            await saveProduct(products[i], slug);
            if ((i + 1) === products.length) {
              //console.log('before call upload images script');
              this.uploadProductImages();
            }
          }
          // final block: generate csv from ignoredProducts and send as attachment in email.
          //console.log('before mail');
          this.sendMail();
          console.log('Finally Done - Rejected Records: ', ignoredProducts.length,
            ' Duplicate Records: ', this.duplicateProducts.length,
            ' SQS Not Uploaded Products Records: ', sqs_err_products.length,
            ' Completed Records: ', products.length);
          if (products.length <= 0) {
            this.deleteFile();
          }
        }, err => {
          console.log('err', err);
          console.error(err);
          this.response('danger', 'File Processing Error', err.message);
        }).catch(function (any) {
          console.error(any);
          this.response('danger', 'File Processing Error', any.message);
        });
      }
      else {
        console.log('Finally Done - Rejected Records: ', ignoredProducts.length,
          ' Duplicate Records: ', this.duplicateProducts.length,
          ' SQS Not Uploaded Products Records: ', sqs_err_products.length,
          ' Completed Records: ', 0);
        this.sendMail();
        this.deleteFile();
        this.response('danger', 'File Processing Error', "No product pass the validations!");
      }
    },
    validateProduct(product) {
      if (!product.Product_Name)
        return { status: false, msg: 'Product name is missing.' };
      if (!product.SKU)
        return { status: false, msg: 'Product sku is missing.' };
      if (!product.Selling_Price)
        return { status: false, msg: 'Product price is missing.' };
      if (!product.Product_Description)
        return { status: false, msg: 'Product description is missing.' };
      if (!product.Image_Url)
        return { status: false, msg: 'Product image_url is missing.' };
      if (product.Product_Name && product.SKU && product.Image_Url && product.Selling_Price && product.Product_Description) {
        return { status: true };
      }
      return { status: false };
    },
    removeDuplicateProducts() {
      return new Promise((resolve, reject) => {
        var fileDuplicates = [];
        const filteredArr = this.products.reduce((acc, current) => {
          const x = acc.find(item => item.SKU === current.SKU);
          if (!x) {
            return acc.concat([current]);
          } else {
            fileDuplicates.push(x);
            return acc;
          }
        }, []);
        this.duplicateProducts = fileDuplicates;

        let productSkus = filteredArr.map(({ SKU }) => SKU);
        const finalProducts = [];
        Product.find({ merchant_id: userId, sku: { $in: productSkus } }, { 'sku': 1, '_id': 0 }).exec((err, docs) => {
          if (err) reject({ msg: 'unable to check products in database.' });
          if (docs && docs.length) {
            const duplicates = [];
            fetchedDocs = docs.map(({ sku }) => sku);
            productSkus.forEach(item => {
              const product = filteredArr.find(({ SKU }) => SKU === item);
              if (!fetchedDocs.includes(item)) {
                finalProducts.push(product);
              } else {
                duplicates.push(product);
              }
            });
            fileDuplicates = fileDuplicates.concat(duplicates);
            const filterDuplicatesArray = fileDuplicates.reduce((acc, current) => {
              const x = acc.find(item => item.SKU === current.SKU);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            this.duplicateProducts = filterDuplicatesArray;
            // resolve(this.products);
            resolve(finalProducts);
          }
          else {
            resolve(filteredArr);
          }
        });
      });
    },
    sendMail() {
      // filename...
      const fileName = path.basename(this.file.originalname, path.extname(this.file.originalname));

      const attachments = [];

      if (ignoredProducts && ignoredProducts.length) {
        //console.log('ignoredProducts', ignoredProducts);
        createLog(ignoredProducts, 'ignore-product');
        const csvStringify = csvWriter.createObjectCsvStringifier({ header: this.csvFileHeader });
        attachments.push({
          filename: `${fileName}-ignored.csv`,
          content: csvStringify.getHeaderString() + csvStringify.stringifyRecords(ignoredProducts),
          contentType: 'text/plain'
        });
      }

      if (this.duplicateProducts && this.duplicateProducts.length) {
        //console.log('this.duplicateProducts', this.duplicateProducts);
        createLog(this.duplicateProducts, 'duplicate-product');
        // remove reason key from duplicate file
        const header = this.csvFileHeader.filter(header => header.id !== 'reason');
        // build final header
        const csvDupStringify = csvWriter.createObjectCsvStringifier({ header: header });
        // build attachment
        attachments.push({
          filename: `${fileName}-duplicates.csv`,
          content: csvDupStringify.getHeaderString() + csvDupStringify.stringifyRecords(this.duplicateProducts),
          contentType: 'text/plain'
        });
      }

      if (attachments.length && this.mailReceipt) {
        EmailTemplate.csvFileRecordsFeedback({ email: this.mailReceipt, attachments: attachments });
      }
    },
    uploadProductImages() {
      req.products_length = finalProductslength;
      req.emil = this.mailReceipt;
      setTimeout(function () {
        ProductImages.uploadImages(req, res).init(req.file, req.products_length, req.emil);
      }, 3000);
    },
    deleteFile() {
      fs.unlink(this.file.path, () => { });
    },
    response(type, intro, message) {
      res.json({ 'status': type, 'intro': intro, 'message': message });
    }
  }
};

function formatProduct(product) {
  var price = parseFloat(product.Selling_Price.replace(/\$/g, ""));
  return {
    title: product.Product_Name,
    slug: product.slugPrefix + '-' + productHelper.createSlug(product.Product_Name),
    price: isNaN(price) ? 0 : price,
    sku: product.SKU,
    upc: product.UPC || '',
    brand: product.Brand || '',
    manufacturer: product.Manufacturer || '',
    totalCost: product.Purchase_Price || 0,
    description: product.Product_Description || '',
  }
}

function saveProduct(csv_product, slug) {
  return new Promise(function (resolve) {
    console.log('product', csv_product.SKU);
    const productFormat = formatProduct({ ...csv_product, slugPrefix: slug });
    const productObj = {
      ...productFormat,
      merchant_id: userId,
      catalogCategory: catalogId,
      main_image: '',
      images: [],
      optimizedImages: [],
    };
    var newProduct = new Product(productObj);
    //console.log('product.Image_Url', product.Image_Url);

    newProduct.save(function (err, result) {
      if (err) {
        product.reason = 'unable to save - db message: ' + err.message;
        ignoredProducts.push(product);
      }
      var productArray =
      {
        product_id: result._id,
        sku: csv_product.SKU,
        merchant_id: userId,
        img_url: csv_product.Image_Url,
        name: csv_product.Product_Name,
        product_url: csv_product.Product_url,
        price: csv_product.Selling_Price,
        category: csv_product.Category
      };
      //console.log('productArray', productArray);
      var params = {
        MessageBody: JSON.stringify(productArray),
        QueueUrl: queueUrl,
        //MessageGroupId: product.SKU
      };
      sqs.sendMessage(params, function (err, data) {
        if (err) {
          console.log('danger', 'SQS Error!', err);
          var productLog = 'Send SQS Queue Message Error ' + JSON.stringify(csv_product);
          log(productLog, 'csv_product_images/csv-images.log');
          sqs_err_products.push(csv_product);
          resolve();
        }
        else {
          console.log('successfully uploaded data to sqs', csv_product.SKU);
          console.log('*************');
          resolve();
        }
      });

    });
    // create new record...
  });
}

function createLog(productsArray, message) {
  productsArray.forEach(function (product) {
    product.merchant_id = userId;
    var productLog = message + ' ' + JSON.stringify(product);
    log(productLog, 'csv_product_images/csv-images.log');
  });
}
