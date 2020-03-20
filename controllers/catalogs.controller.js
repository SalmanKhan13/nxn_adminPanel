const { validationResult } = require('express-validator');
const Catalog = require('../models/catalog.model');
const catalogsPath = 'internal-admin/pages/catalogs';

/*
 |--------------------------------------------------------------------------
 | Get catalogs List
 |--------------------------------------------------------------------------
*/
exports.catalogsList = async function(req, res) {
    try {
        const catalogs = await Catalog.aggregate([
                    {
                        $project: {
                            catalogCategory: 1,
                            slug: 1,
                            type: 1,
                            description: 1,
                            createdDate: { "$dateToString": { format:"%Y-%m-%d %H:%M:%S", date:"$updatedDate", timezone:'+05:00', onNull: 'N/A' } },
                            updatedDate: { "$dateToString": { format:"%Y-%m-%d %H:%M:%S", date:"$updatedDate", timezone:'+05:00', onNull: 'N/A' } }
                        }
                    }
                ]);
      //  res.render(`${catalogsPath}/index`, { catalogs });
      console.log("it's coming from catalog.controller.js")
    } catch ( err ) {
        console.error(err);
    }
};
