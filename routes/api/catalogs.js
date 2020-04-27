const express = require("express");
const router = express.Router();
const catalogController = require("../../controllers/catalogs.controller");

router.get("/search/:userId", catalogController.findCatalogsByUserId);

module.exports = router;
