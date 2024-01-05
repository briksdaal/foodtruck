const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CookwareSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
});

CookwareSchema.virtual('url').get(function () {
  return `/cookware/${this._id}`;
});

module.exports = mongoose.model('Cookware', CookwareSchema);
