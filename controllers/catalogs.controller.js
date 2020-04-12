const User = require('../models/user.model');
const Catalog = require('../models/catalog.model');

/*
 |--------------------------------------------------------------------------
 | catalog list for a particular user
 |--------------------------------------------------------------------------
*/
exports.findCatalogsByUserId = async function (req, res) {
    try {
        if (req.params.userId) {
            const user = await User.findOne({ _id: req.params.userId }, { username: 1 });
            if (user) {
                Catalog.find({ userId: user._id }, ['slug', '_id'], (err, docs) => {
                    if (err) {
                        res.end(JSON.stringify({ status: false }));
                    } else {
                        res.end(JSON.stringify({ status: true, catalogs: docs }));
                    }
                });
            } else {
                res.end(JSON.stringify({ status: false }));
            }
        }
        else {
            throw Error('Please provide UserId');
        }
    }
    catch (e) {
        console.log(e);
        return res.status(500).end(e.message);
    }
};