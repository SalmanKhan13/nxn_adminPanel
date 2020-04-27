var Mail = require("./mail");
var config = require("./config"); // Called token secret key
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
  var path = require("path").join(
    __dirname,
    "../app/views/email-template/feedback-products-bulk.html"
  );

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

// exports.transporter = 
//   nodemailer.createTransport({
//     service: "gmail",
//     secure: "false",
//     auth: {
//       user: "salmank91922@gmail.com",
//       pass: "asif9999",
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });

