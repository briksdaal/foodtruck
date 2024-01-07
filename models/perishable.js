const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PerishableSchema = new Schema({
  title: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category' },
  measureType: {
    type: String,
    enum: ['weight', 'volume', 'units'],
    required: true,
  },
  description: { type: String },
});

PerishableSchema.virtual('url').get(function () {
  return `/perishables/${this._id}`;
});

module.exports = mongoose.model('Perishable', PerishableSchema);
