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
});

CookwareInstanceSchema.virtual('url').get(function () {
  return `/cookwareinstances/${this._id}`;
});

CookwareInstanceSchema.virtual('ddmmyy_dateBought').get(function () {
  return DateTime.fromJSDate(this.dateBought).toFormat("dd'/'MM'/'yyyy");
});

module.exports = mongoose.model('CookwareInstance', CookwareInstanceSchema);
