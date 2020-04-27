var mongoose = require("mongoose");
//var mongoosastic = require('mongoosastic');
//var elastic = require('../../config/elasticsearch');
var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    title: {
      type: String,
      es_indexed: true,
      es_type: "text",
      es_fields: {
        completion: {
          type: "completion",
          analyzer: "standard",
          preserve_position_increments: true,
          preserve_separators: true,
        },
      },
    },
    slug: {
      type: String,
      uniqe: true,
      es_type: "text",
      es_indexed: true,
    },
    sku: {
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { sku: { $type: "string" } },
      },
      es_indexed: false,
    },
    upc: {
      type: String,
      es_type: "text",
      es_indexed: false,
    },
    catalogCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Catalog",
        es_indexed: true,
        es_type: "text",
      },
    ], // IDs of the catlog Categories
    userCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      es_indexed: false,
    },
    description: {
      type: String,
      es_type: "text",
      es_indexed: true,
    },
    merchant_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      es_type: "text",
      es_indexed: true,
    }, // User ID of the Merchant / produtc owner
    productState: {
      type: String,
      es_type: "text",
      es_indexed: false,
    },
    price: {
      type: Number,
      es_indexed: true,
    }, // product unit price
    groupPrice: {
      type: [
        {
          groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContactGroup",
          },
          price: Number,
        },
      ],
      es_indexed: false,
    }, // price for different contacts group
    tierPrice: {
      type: [
        {
          groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ContactGroup",
          },
          quantity: Number,
          price: Number,
        },
      ],
      es_indexed: false,
    }, // price for different units of product
    customPrice: {
      type: Number,
      es_indexed: true,
    }, // User defined custom price
    msrp: {
      type: Number,
      es_indexed: false,
    }, // market suggested retail price
    totalCost: {
      type: Number,
      es_indexed: false,
    }, // total cost of the product
    stock: {
      type: Number,
      es_indexed: false,
    }, // stock of the product
    main_image: {
      type: String,
      es_type: "text",
      es_indexed: true,
    }, // main featured image of the product
    images: [
      {
        type: String,
        es_type: "text",
        es_indexed: true,
      },
    ], // more images of the product. about 6 image links
    optimizedImages: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          es_indexed: true,
          es_type: "text",
        },
        size80: {
          type: String,
          es_type: "text",
          es_indexed: true,
        },
        size480: {
          type: String,
          es_type: "text",
          es_indexed: true,
        },
      },
    ],
    product_origin: {
      type: String,
      es_type: "text",
      es_indexed: false,
    },
    brand: {
      type: String,
      es_type: "text",
      es_indexed: false,
    },
    manufacturer: {
      type: String,
      es_type: "text",
      es_indexed: false,
    },
    custom_properties: {}, //User defined custom product properties
    status: {
      type: Boolean,
      Default: true,
      es_indexed: false,
    }, // published or drafted
    published_date: {
      type: Date,
      default: Date.now,
      es_type: "date",
    }, // for publishing product in schedule
    created_at: {
      type: Date,
      default: Date.now,
      es_indexed: false,
    },
    updated_at: {
      type: Date,
      es_indexed: false,
    },
  },
  {
    usePushEach: true,
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// ProductSchema.plugin(mongoosastic, {
//   esClient: elastic.client,
//   filter: function(product) {
//     return product.catalogCategory.length === 0;
//   }
// });

var Model = mongoose.model("Product", ProductSchema);

// Model.createMapping(function(err, mapping) {
//   if (err) {
//     console.log('error creating mapping (you can safely ignore this)');
//     console.log(err);
//   } else {
//     console.log('mapping created!');
//     console.log(mapping);
//     synchronize();
//   }
// });

function synchronize() {
  var stream = Model.synchronize({
    "catalogCategory.0": {
      $exists: true,
    },
  });
  var count = 0;

  stream.on("data", function (err, doc) {
    count++;
  });
  stream.on("close", function () {
    console.log("indexed " + count + " documents!");
  });
  stream.on("error", function (err) {
    console.log(err);
  });
}

module.exports = Model;
