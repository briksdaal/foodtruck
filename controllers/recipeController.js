const Recipe = require('../models/recipe');
const Cookware = require('../models/cookware');
const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

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
  // Convert cookware and ingredients to arrays.
  (req, res, next) => {
    if (!Array.isArray(req.body['cookware[]'])) {
      req.body['cookware[]'] =
        typeof req.body['cookware[]'] === 'undefined'
          ? []
          : [req.body['cookware[]']];
    }
    if (!Array.isArray(req.body['ingredients[][perishable]'])) {
      req.body['ingredients[][perishable]'] =
        typeof req.body['ingredients[][perishable]'] === 'undefined'
          ? []
          : [req.body['ingredients[][perishable]']];
    }
    if (!Array.isArray(req.body['ingredients[][amount]'])) {
      req.body['ingredients[][amount]'] =
        typeof req.body['ingredients[][amount]'] === 'undefined'
          ? []
          : [req.body['ingredients[][amount]']];
    }

    // Rename fields for ease of use and because express validator doesn't recognize [] characters
    req.body.cookware = req.body['cookware[]'];
    delete req.body['cookware[]'];
    req.body.ingredientperishables = req.body['ingredients[][perishable]'];
    delete req.body['ingredients[][perishable]'];
    req.body.ingredientamounts = req.body['ingredients[][amount]'];
    delete req.body['ingredients[][amount]'];
    next();
  },
  // Validate and sanitize fields.
  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('cookware', 'Cookware error').isArray({ min: 0 }),
  body('cookware.*', 'Cookware element error')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('ingredientperishables', 'Must contain at least one ingredient').isArray(
    { min: 1 }
  ),
  body('ingredientperishables.*', 'Perishable must be selected or removed')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('ingredientamounts.*', 'Amount must not be empty or 0')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('instructions', 'Instructions must contain at least 5 chracters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    const ingredients = req.body.ingredientperishables.map((p, i) => ({
      perishable: p,
      amount: +req.body.ingredientamounts[i],
    }));

    // Create a Recipe object with escaped and trimmed data.
    const recipe = new Recipe({
      title: req.body.title,
      description: req.body.description,
      cookware: req.body.cookware,
      ingredients: ingredients,
      instructions: req.body.instructions,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all perishables and cookware for form.
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
