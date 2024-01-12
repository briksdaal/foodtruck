const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  title: { type: String, required: true },
  image: { type: String },
});

CategorySchema.virtual('url').get(function () {
  return `/categories/${this._id}`;
});

CategorySchema.virtual('imagepath').get(function () {
  return `/uploads/${this.image}`;
});

module.exports = mongoose.model('Category', CategorySchema);
