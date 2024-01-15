const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  perishable: {
    type: Schema.Types.ObjectId,
    ref: 'Perishable',
    required: true,
  },
  amount: { type: Number, required: true },
});

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  instructions: { type: String, required: true },
  cookware: [{ type: Schema.Types.ObjectId, ref: 'Cookware' }],
  ingredients: {
    type: [IngredientSchema],
    required: true,
  },
  image: { type: String },
});

RecipeSchema.virtual('url').get(function () {
  return `/recipes/${this._id}`;
});

RecipeSchema.virtual('imagepath').get(function () {
  return `/uploads/${this.image}`;
});

module.exports = mongoose.model('Recipe', RecipeSchema);
