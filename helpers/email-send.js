const _ = require('underscore');
const Mail = require('./mail');

const config = require('./config');
const environment = process.env.NODE_ENV || 'development';
const awsBucketBasePath = "https://seebiz-images.s3.amazonaws.com";

/*
 |--------------------------------------------------------------------------
 | CSV File Records Feedback
 |--------------------------------------------------------------------------
*/
exports.csvFileRecordsFeedback = function(userInfo) {
  const homeUrl = config[environment].clientHost;
  userInfo.homeUrl = homeUrl;

  Mail.productsUploadFeedback(userInfo.email, csvFileRecordsFeedbackTemplate(userInfo), userInfo.attachments, (err, data) => {
    if (err) {
      console.log('err: ' + err);
    }
  });
};

function csvFileRecordsFeedbackTemplate(userInfo) {
  // Find Thank you email template
  const path = require('path').join(__dirname, '../views/email-template/feedback-products-bulk.html');

  // Read file synchronously and encode it 'utf8'
  const html = require('fs').readFileSync(path, 'utf8');
  const template = _.template(html);
  return template({...userInfo, resourcePath: awsBucketBasePath});
}
  