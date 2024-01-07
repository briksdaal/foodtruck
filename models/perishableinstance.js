const mongoose = require('mongoose');
const { DateTime } = require('luxon');

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
  return `/perishableinstances/${this._id}`;
});

PerishableInstanceSchema.virtual('ddmmyy_dateLastUse').get(function () {
  return DateTime.fromJSDate(this.dateLastUse).toFormat("dd'/'MM'/'yy");
});

module.exports = mongoose.model('PerishableInstance', PerishableInstanceSchema);
