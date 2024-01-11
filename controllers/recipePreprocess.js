const { body } = require('express-validator');

exports.recipePreprocess = [
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
  body('cookware.*', 'Cookware must be selected or removed')
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
];
