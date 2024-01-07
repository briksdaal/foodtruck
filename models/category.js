const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, required: true },
});

CategorySchema.virtual('url').get(function () {
  return `/categories/${this._id}`;
});

module.exports = mongoose.model('Category', CategorySchema);
