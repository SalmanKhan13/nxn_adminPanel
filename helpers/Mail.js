//var AWS = require('aws-sdk');
var Config = require('./config');
const nodemailer = require('nodemailer');
var environment = process.env.NODE_ENV || 'development'; // Server environment
//var mailAddress = 'noreply@seebiz.com';
//var supportAddress = 'contact@seebiz.com';
var mailAddress = Config[environment].mailAddress;
var supportMailAddress = Config[environment].supportAddress;

// var Auth = {
//   accessKeyId: Config.Aws.AuthMail.accessKey,
//   secretAccessKey: Config.Aws.AuthMail.secretKey,
//   region: 'us-west-2'
// };
// var ses = new AWS.SES(Auth);

const sendMailWithAttachments = (from, to, subject, body, attachments, next) => {
  const transporter =  nodemailer.createTransport({
    service: "gmail",
    secure: "false",
    auth: {
      user: "salmank91922@gmail.com",
      pass: "asif9999"
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let options = {
    from: "salmank91922@gmail.com", // sender address
    to: "salmank91922@gmail.com", // list of receivers
    subject, // Subject line
    html: body,
    attachments: attachments
  };

  //   host: "smtp.mailtrap.io",
  //   port: 2525,
  //   auth: {
  //     user: "049b8df2abf42a",
  //     pass: "6db9a05bd936f5"
  //   }
  // auth: {
  //   user: "1fe25310eaae47",
  //   pass: "b0c568fcad0783"
  // }

  // const options = {from, to, subject, html: body};
    
  if ( attachments ) {
    options.attachments = attachments;
  }
  
  // send mail with defined transport object
  transporter.sendMail(options, function(error, body){
    if (error) {
      console.log(error);
    } else {
      console.log('Message sent: %s', body.messageId);
    }
    next(error, body);
  });
};

// Email address verification
exports.productsUploadFeedback = function (email, message, attachments, next) {
  sendMailWithAttachments(mailAddress, email, 'Products Feedback.', message, attachments, next);
};


module.exports = exports;
