const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PerishableInstanceSchema = new Schema({
  perishable: {
    type: Schema.Types.ObjectId,
    ref: 'Perishable',
    required: true,
  },
  amount: { type: Number, required: true },
  placeBought: { type: String },
  dateBought: { type: Date, default: Date.now },
  dateLastUse: {
    type: Date,
    default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
});

PerishableInstanceSchema.virtual('url').get(function () {
  return `/perishableinstance/${this._id}`;
});

module.exports = mongoose.model('PerishableInstance', PerishableInstanceSchema);
