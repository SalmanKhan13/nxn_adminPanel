var Mail = require('./mail');
var config = require('./config'); // Called token secret key
var _ = require('underscore'); // used Underscore for template settings
var jwt = require('jwt-simple'); // Used for generate token
var moment = require('moment');
var environment = process.env.NODE_ENV || 'development';
var fs = require('fs');
var path = require('path');
var url;
var awsBucketBasePath = "https://seebiz-images.s3.amazonaws.com";

/*
 |--------------------------------------------------------------------------
 | CSV File Records Feedback
 |--------------------------------------------------------------------------
*/
exports.csvFileRecordsFeedback = function (userInfo) {

  var homeUrl = config[environment].clientHost;
  userInfo.homeUrl = homeUrl;

  Mail.productsUploadFeedback(userInfo.email, csvFileRecordsFeedbackTemplate(userInfo), userInfo.attachments, (err, data) => {
    if (err) {
      console.log('err: ' + err);
    }
  });
};

function csvFileRecordsFeedbackTemplate(userInfo) {
  // Find Thank you email template
  var path = require('path').join(__dirname, '../views/email-template/feedback-products-bulk.html');

  // Read file synchronously and encode it 'utf8'
  var html = require('fs').readFileSync(path, 'utf8');
  var template = _.template(html);
  return template({ ...userInfo, resourcePath: awsBucketBasePath });
}
