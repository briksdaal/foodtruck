const Recipe = require('../models/recipe');
const Cookware = require('../models/cookware');
const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { recipePreprocess } = require('./recipePreprocess');
const { imageUploadAndValidation, deleteImage } = require('./imageActions');

// Display list of all Recipes
exports.recipe_list = asyncHandler(async (req, res, next) => {
  const allRecipes = await Recipe.find({}).sort({ title: 1 }).exec();

  res.render('recipe_list', {
    title: 'Recipes List',
    recipe_list: allRecipes,
    createUrl: '/recipes/create',
  });
});

// Display detail page for a specific recipe
exports.recipe_detail = asyncHandler(async (req, res, next) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate('cookware ingredients.perishable')
    .exec();

  if (recipe === null) {
    // no results
    const err = new Error('Recipe Not Found');
    err.status = 404;
    return next(err);
  }

  res.render('recipe_detail', {
    title: `${recipe.title} - Recipe`,
    recipe,
  });
});

// Dispaly recipe create form on GET
exports.recipe_create_get = asyncHandler(async (req, res, next) => {
  const [allPerishables, allCookware] = await Promise.all([
    Perishable.find({}).sort({ title: 1 }).exec(),
    Cookware.find({}).sort({ title: 1 }).exec(),
  ]);

  res.render('recipe_form', {
    title: 'Create New Recipe',
    perishable_list: allPerishables,
    cookware_list: allCookware,
  });
});

// Handle recipe create on POST
exports.recipe_create_post = [
  // Upload and validate image
  imageUploadAndValidation,
  // Convert relevant fields to arrays, rename fields, validate and sanitize
  recipePreprocess,
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const ingredients = req.body.ingredientperishables.map((p, i) => ({
      perishable: p,
      amount: +req.body.ingredientamounts[i],
    }));

    const cookware = req.body.cookware.map((c) => (c ? c : null));

    // Create a Recipe object with escaped and trimmed data.
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      cookware: cookware,
      ingredients: ingredients,
      instructions: req.body.instructions,
      image: req.file?.filename || null,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      deleteImage(recipe);

      // Render form again with sanitized values/error messages.
      const [allPerishables, allCookware] = await Promise.all([
        Perishable.find({}).sort({ title: 1 }).exec(),
        Cookware.find({}).sort({ title: 1 }).exec(),
      ]);

      res.render('recipe_form', {
        title: 'Create New Recipe',
        perishable_list: allPerishables,
        cookware_list: allCookware,
        recipe: recipe,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid.
      // Check if Recipe with same name already exists.
      const recipeExists = await Recipe.findOne({
        title: req.body.title,
      }).exec();
      if (recipeExists) {
        // Recipe exists, redirect to its detail page.
        res.redirect(recipeExists.url);
      } else {
        await recipe.save();
        // New recipe saved. Redirect to recipe detail page.
        res.redirect(recipe.url);
      }
    }
  }),
];

// Dispaly recipe delete form on GET
exports.recipe_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of recipe
  const recipe = await Recipe.findById(req.params.id).exec();

  if (recipe === null) {
    // No results.
    res.redirect('/recipes');
    return;
  }

  res.render('recipe_delete', {
    title: `Delete recipe - ${recipe.title}`,
    recipe: recipe,
  });
});

// Handle recipe delete on POST
exports.recipe_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of recipe
  const recipe = await Recipe.findById(req.params.id).exec();

  if (recipe === null) {
    res.redirect('recipes');
    return;
  }

  deleteImage(recipe);

  await Recipe.findByIdAndDelete(req.body.recipeid);
  res.redirect('/recipes');
});

// Dispaly recipe update form on GET
exports.recipe_update_get = asyncHandler(async (req, res, next) => {
  const [recipe, allPerishables, allCookware] = await Promise.all([
    Recipe.findById(req.params.id).exec(),
    Perishable.find({}).sort({ title: 1 }).exec(),
    Cookware.find({}).sort({ title: 1 }).exec(),
  ]);

  if (recipe === null) {
    // No results.
    const err = new Error('Recipe not found');
    err.status = 404;
    return next(err);
  }

  res.render('recipe_form', {
    title: `Update Recipe - ${recipe.title}`,
    recipe: recipe,
    perishable_list: allPerishables,
    cookware_list: allCookware,
  });
});

// Handle recipe update on POST
exports.recipe_update_post = [
  // Upload and validate image
  imageUploadAndValidation,
  // Convert relevant fields to arrays, rename fields, validate and sanitize
  recipePreprocess,
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const ingredients = req.body.ingredientperishables.map((p, i) => ({
      perishable: p,
      amount: +req.body.ingredientamounts[i],
    }));

    const cookware = req.body.cookware.map((c) => (c ? c : null));

    const instructions = req.body.instructions.replaceAll('\r\n', '<br/>');

    // Create a Recipe object with escaped and trimmed data, and old id.
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      cookware: cookware,
      ingredients: ingredients,
      instructions: instructions,
      image: req.file?.filename || null,
      _id: req.params.id,
    });

    // Get currrent recipe
    const currentRecipe = await Recipe.findById(req.params.id).exec();

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      deleteImage(recipe);

      // Get perishable and cookware lists for rerender
      const [allPerishables, allCookware] = await Promise.all([
        Perishable.find({}).sort({ title: 1 }).exec(),
        Cookware.find({}).sort({ title: 1 }).exec(),
      ]);

      res.render('recipe_form', {
        title: `Update Recipe - ${currentRecipe.title}`,
        recipe: recipe,
        perishable_list: allPerishables,
        cookware_list: allCookware,
        errors: errors.array(),
      });
      return;
    } else {
      // Delete current image
      deleteImage(currentRecipe);

      // Data from form is valid. Update the record
      const updatedRecipe = await Recipe.findByIdAndUpdate(
        req.params.id,
        recipe
      );
      // Recipe updated. Redirect to recipe detail page.
      res.redirect(updatedRecipe.url);
    }
  }),
];
