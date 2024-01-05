const Recipe = require('../models/recipe');
const asyncHandler = require('express-async-handler');

// Display list of all Recipes
exports.recipe_list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe list');
});

// Display detail page for a specific recipe
exports.recipe_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Recipe detail: ${req.params.id}`);
});

// Dispaly recipe create form on GET
exports.recipe_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe create GET');
});

// Handle recipe create on POST
exports.recipe_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe create POST');
});

// Dispaly recipe delete form on GET
exports.recipe_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe delete GET');
});

// Handle recipe delete on POST
exports.recipe_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe delete POST');
});

// Dispaly recipe update form on GET
exports.recipe_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe update GET');
});

// Handle recipe update on POST
exports.recipe_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Recipe update POST');
});
