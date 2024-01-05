const mongoose = require('mongoose');

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
  return `/cookwareinstance/${this._id}`;
});

module.exports = mongoose.model('CookwareInstance', CookwareInstanceSchema);
