var Mail = require("./Mail");
var config = require("../config/config"); // Called token secret key
var _ = require("underscore"); // used Underscore for template settings
var environment = process.env.NODE_ENV || "development";
var awsBucketBasePath = "https://seebiz-images.s3.amazonaws.com";
//const nodemailer = require("nodemailer");

/*
 |--------------------------------------------------------------------------
 | CSV File Records Feedback
 |--------------------------------------------------------------------------
*/
exports.csvFileRecordsFeedback = function (userInfo) {
  var homeUrl = config[environment].clientHost;
  userInfo.homeUrl = homeUrl;

  Mail.productsUploadFeedback(
    userInfo.email,
    csvFileRecordsFeedbackTemplate(userInfo),
    userInfo.attachments,
    (err, data) => {
      if (err) {
        console.log("err: " + err);
      }
    }
  );
};

function csvFileRecordsFeedbackTemplate(userInfo) {
  // Find Thank you email template
  // <<<<<<< HEAD
  //   var path = require("path").join(
  //     __dirname,
  //     "../app/views/email-template/feedback-products-bulk.html"
  //   );
  //=======
  var path = require('path').join(__dirname, '../views/email-template/feedback-products-bulk.html');
  //>>>>>>> ca0c83b1069245448b09d15f914819bc1ca7fc44

  // Read file synchronously and encode it 'utf8'
  var html = require("fs").readFileSync(path, "utf8");
  var template = _.template(html);
  return template({ ...userInfo, resourcePath: awsBucketBasePath });
}

/*
 |--------------------------------------------------------------------------
 | Mail Server is used for Email Sending
 |--------------------------------------------------------------------------
*/