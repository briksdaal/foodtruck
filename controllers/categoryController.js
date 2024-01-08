const Category = require('../models/category');
const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');

// Display list of all Categories
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ title: 1 }).exec();

  res.render('category_list', {
    title: 'Perishable Category List',
    category_list: allCategories,
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
exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category create GET');
});

// Handle Category create on POST
exports.category_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Category create POST');
});

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
