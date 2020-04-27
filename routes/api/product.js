const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const controllers = require("../../controllers/userController");
const {productuploadrules} = require("../../helpers/valid");
const productController = require("../../controllers/products.controller");

// .single('csvFile')
const upload = require("../../middleware/products.fileupload.js");


// @route    POST api/product/
// @desc     Upload Product
// @access   Public
router.post(
  "/upload",
  auth,
  controllers.grantAccess("updateAny", "product_upload"),
  upload.fileUpload,
  productuploadrules,
  productController.upload
);

module.exports = router;