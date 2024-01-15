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
  image: { type: String },
});

PerishableInstanceSchema.virtual('url').get(function () {
  return `/perishableinstances/${this._id}`;
});

PerishableInstanceSchema.virtual('imagepath').get(function () {
  return `/uploads/${this.image}`;
});

PerishableInstanceSchema.virtual('ddmmyy_dateBought').get(function () {
  return this.dateBought
    ? DateTime.fromJSDate(this.dateBought).toFormat("dd'/'MM'/'yy")
    : '';
});

PerishableInstanceSchema.virtual('yyyymmdd_dateBought').get(function () {
  return this.dateBought
    ? DateTime.fromJSDate(this.dateBought).toISODate()
    : '';
});

PerishableInstanceSchema.virtual('ddmmyy_dateLastUse').get(function () {
  return this.dateLastUse
    ? DateTime.fromJSDate(this.dateLastUse).toFormat("dd'/'MM'/'yy")
    : '';
});

PerishableInstanceSchema.virtual('yyyymmdd_dateLastUse').get(function () {
  return this.dateLastUse
    ? DateTime.fromJSDate(this.dateLastUse).toISODate()
    : '';
});

PerishableInstanceSchema.virtual('past_date').get(function () {
  return this.dateLastUse < Date.now();
});

module.exports = mongoose.model('PerishableInstance', PerishableInstanceSchema);
