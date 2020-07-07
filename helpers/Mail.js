var Config = require("../config/config");
const nodemailer = require("nodemailer");
var env = process.env.NODE_ENV || "development"; // Server environment
var mailAddress = Config[env].mailAddress;

const sendMailWithAttachments = (
  from,
  to,
  subject,
  body,
  attachments,
  next
) => {
  const transporter = nodemailer.createTransport({

    auth: {

    }

  });

  const options = { from, to, subject, html: body };
  if (attachments) {
    options.attachments = attachments;
  }

  // send mail with defined transport object
  transporter.sendMail(options, function (error, body) {
    if (error) {
      console.log(error);
    } else {
      console.log("Message sent: %s", body.messageId);
    }
    next(error, body);
  });
};

// Email address verification
exports.productsUploadFeedback = function (email, message, attachments, next) {
  sendMailWithAttachments(
    mailAddress,
    email,
    "Products Feedback.",
    message,
    attachments,
    next
  );
};

module.exports = exports;
