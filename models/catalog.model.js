/**
 * This schema design for user catalog
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CatalogSchema = new Schema({
  catalogCategory: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // items:[{type:mongoose.Schema.Types.ObjectId, ref:'Post' }],
  slug: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['public', 'private'],
    default: "private"
  },
  seo: {
    type: String
  },
  isTrashed: {
    type: Boolean,
    default: false
  }, // published or deleted
  privacyGroups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ContactGroup'
  }],
  createdDate: {
    type: Date,
    default: Date.now
  },
  updatedDate: {
    type: Date,
    default: Date.now
  },
}, { usePushEach: true });
var Model = mongoose.model('Catalog', CatalogSchema);
module.exports = Model;
