const Perishable = require('../models/perishable');
const PerishableInstance = require('../models/perishableinstance');
const Category = require('../models/category');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Perishables
exports.perishable_list = asyncHandler(async (req, res, next) => {
  const allPerishables = await Perishable.find({}).sort({ title: 1 }).exec();

  res.render('perishable_list', {
    title: 'Perishable Types List',
    perishable_list: allPerishables,
    createUrl: '/perishables/create',
  });
});

// Display detail page for a specific Perishable
exports.perishable_detail = asyncHandler(async (req, res, next) => {
  const [perishable, perishableInstances] = await Promise.all([
    Perishable.findById(req.params.id).populate('category').exec(),
    PerishableInstance.find({ perishable: req.params.id }, 'dateLastUse')
      .populate('perishable', 'title')
      .sort({ dateLastUse: 1 })
      .exec(),
  ]);

  if (perishable === null) {
    // no results
    const err = new Error('Perishable Type Not Found');
    err.status = 404;
    return next(err);
  }

  const before_last_date_perishables = perishableInstances.filter(
    (p) => p.dateLastUse >= Date.now()
  );

  const after_last_date_perishables = perishableInstances.filter(
    (p) => p.dateLastUse < Date.now()
  );

  res.render('perishable_detail', {
    title: `Perishable Type Details: ${perishable.title}`,
    perishable_type: perishable,
    before_last_date_perishables,
    after_last_date_perishables,
  });
});

// Dispaly Perishable create form on GET
exports.perishable_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}).sort({ title: 1 }).exec();

  res.render('perishable_form', {
    title: 'Create New Perishable Type',
    category_list: allCategories,
  });
});

// Handle Perishable create on POST
exports.perishable_create_post = [
  // Validate and sanitize
  body('title', 'Title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category').optional({ values: 'falsy' }).trim().escape(),
  body('measure-type', 'Must choose a measurement type')
    .isLength({ min: 1 })
    .trim()
    .escape(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a perishable object with escaped and trimmed data.
    const perishable = new Perishable({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      measureType: req.body['measure-type'],
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allCategories = await Category.find({}).sort({ title: 1 }).exec();

      res.render('perishable_form', {
        title: 'Create New Perishable Type',
        category_list: allCategories,
        perishable: perishable,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await perishable.save();
      // New perishable saved. Redirect to perishable detail page.
      res.redirect(perishable.url);
    }
  }),
];

// Dispaly Perishable delete form on GET
exports.perishable_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable delete GET');
});

// Handle Perishable delete on POST
exports.perishable_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable delete POST');
});

// Dispaly Perishable update form on GET
exports.perishable_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable update GET');
});

// Handle Perishable update on POST
exports.perishable_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable update POST');
});
