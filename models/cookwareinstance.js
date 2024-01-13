const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const CookwareInstanceSchema = new Schema({
  cookware: { type: Schema.Types.ObjectId, ref: 'Cookware', required: true },
  description: { type: String },
  dateBought: { type: Date },
  weight: { type: Number },
  condition: {
    type: String,
    enum: ['Usable', 'Maintenance', 'No Longer Usable'],
    default: 'Usable',
  },
  image: { type: String },
});

CookwareInstanceSchema.virtual('url').get(function () {
  return `/cookwareinstances/${this._id}`;
});

CookwareInstanceSchema.virtual('imagepath').get(function () {
  return `/uploads/${this.image}`;
});

CookwareInstanceSchema.virtual('ddmmyy_dateBought').get(function () {
  return this.dateBought
    ? DateTime.fromJSDate(this.dateBought).toFormat("dd'/'MM'/'yyyy")
    : '';
});

CookwareInstanceSchema.virtual('yyyymmdd_dateBought').get(function () {
  return this.dateBought
    ? DateTime.fromJSDate(this.dateBought).toISODate()
    : '';
});

module.exports = mongoose.model('CookwareInstance', CookwareInstanceSchema);
