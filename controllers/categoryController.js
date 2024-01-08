const Category = require('../models/category');
const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ title: 1 }).exec();

  res.render('category_list', {
    title: 'Perishable Category List',
    category_list: allCategories,
    createUrl: '/categories/create',
  });
});

// Display detail page for a specific Category
exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, perishablesInCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Perishable.find({ category: req.params.id }, 'title description')
      .sort({ title: 1 })
      .exec(),
  ]);

  if (category === null) {
    // no results
    const err = new Error('Category Not Found');
    err.status = 404;
    return next(err);
  }

  res.render('category_detail', {
    title: `Perishable Category Details: ${category.title}`,
    category,
    category_perishables: perishablesInCategory,
  });
});

// Dispaly Category create form on GET
exports.category_create_get = (req, res, next) => {
  res.render('category_form', {
    title: 'Create New Category',
  });
};

// Handle Category create on POST
exports.category_create_post = [
  // Validate and sanitize
  body('title', 'Category title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a category object with escaped and trimmed data.
    const category = new Category({ title: req.body.title });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('category_form', {
        title: 'Create New Category',
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      const categoryExists = await Category.findOne({
        title: req.body.title,
      }).exec();
      if (categoryExists) {
        // Category exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New category saved. Redirect to Category detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// Dispaly Category delete form on GET
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete GET');
});

// Handle Category delete on POST
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category delete POST');
});

// Dispaly Category update form on GET
exports.category_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update GET');
});

// Handle Category update on POST
exports.category_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category update POST');
});
