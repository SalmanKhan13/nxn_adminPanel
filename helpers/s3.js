"use strict";
var env = process.env.NODE_ENV || "development";
var fs = require("fs");
var Config = require("../config/config");
var BucketName = Config[env].Bucket;
// var Auth = {
//   accessKeyId: Config.Aws.AuthStorage.accessKey,
//   secretAccessKey: Config.Aws.AuthStorage.secretKey,
//   region: 'us-west-2'
// };


// Creating bucket function
exports.bucketCreate = function (bucket_name, permission, location, next) {
  var params = {
    Bucket: bucket_name,
    /* required */
    ACL: permission, // 'private | public-read | public-read-write | authenticated-read',
    CreateBucketConfiguration: {
      LocationConstraint: location, // 'EU | eu-west-1 | us-west-1 | us-west-2 | ap-southeast-1 | ap-southeast-2 | ap-northeast-1 | sa-east-1 | cn-north-1 | eu-central-1'
    },
  };
  s3.createBucket(params, function (err, data) {
    next(err, data);
  });
};
// Deleting bucket function
exports.bucketDel = function (bucket_name, next) {
  s3.deleteBucket(
    {
      Bucket: bucket_name,
    },
    function (err, data) {
      next(err, data);
    }
  );
};
// uploading file or object into bucket
exports.upFile = function (key, file, type, next) {
  var params = {
    Bucket: BucketName,
    Key: key,
    ContentType: type,
    Body: file,
    ACL: "public-read",
  };
  s3.upload(params, function (err, data) {
    next(err, data);
  });
};
//put the buffetr object
exports.putObj = function (key, file, type, next) {
  var params = {
    Bucket: BucketName,
    Key: key,
    ContentType: type,
    Body: file,
    ACL: "public-read",
  };
  s3.putObject(params, function (err, data) {
    next(err, data);
  });
};
// Deleting file / object from bucket
exports.delFile = function (key, next) {
  var params = {
    Bucket: BucketName,
    /* required */
    Key: key,
    /* required */
    // MFA: 'STRING_VALUE',
    // RequestPayer: 'requester',
    // VersionId: 'STRING_VALUE'
  };
  s3.deleteObject(params, function (err, data) {
    next(err, data);
  });
};

exports.delMultipleFile = function (objects, next) {
  var params = {
    Bucket: BucketName,
    /* required */
    Delete: {
      Objects: objects,
    },
    /* required */
    // MFA: 'STRING_VALUE',
    // RequestPayer: 'requester',
    // VersionId: 'STRING_VALUE'
  };
  s3.deleteObjects(params, function (err, data) {
    next(err, data);
  });
};

// copying file or object from one bucket into another
exports.copyFile = function (sourceKey, destinationKey, next) {
  var finalSourceKey = IMSBuckterName + sourceKey;
  var params = {
    Bucket: BucketName,
    CopySource: finalSourceKey,
    Key: destinationKey,
    ACL: "public-read",
  };
  s3.copyObject(params, function (err, data) {
    next(err, data);
  });
};

module.exports = exports;
