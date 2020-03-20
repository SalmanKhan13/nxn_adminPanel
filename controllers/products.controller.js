const { validationResult } = require('express-validator');
const Products = require('../helpers/products-import');


/*
 |--------------------------------------------------------------------------
 | Import Products page
 |--------------------------------------------------------------------------
*/
exports.upload = function(req, res) {

    const fileError = req.fileError;
    const fieldErrors = validationResult(req);
    const errors = fieldErrors.isEmpty() ? [] : fieldErrors.array();
  
    // file error if any...
    if ( fileError ) {
      errors.push(fileError)
    }
  
    if ( errors && errors.length ) {
      return res.status(422).json({ errors });
    }
  
    const {user_email: userId, catalog: catalogId} = req.body;
  
    Products.Import(req, res).init(req.file, {userId, catalogId});
  };