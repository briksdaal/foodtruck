const CookwareInstance = require('../models/cookwareinstance');
const Cookware = require('../models/cookware');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const sortByTitle = require('../helpers/sortByTitle');

// Display list of all Cookware Instances
exports.cookwareinstance_list = asyncHandler(async (req, res, next) => {
  const allCookwareInstances = await CookwareInstance.find({})
    .populate('cookware', 'title')
    .exec();

  const sortedAllCookwareInstances = allCookwareInstances.sort(
    sortByTitle('cookware', 'title')
  );

  res.render('cookwareinstance_list', {
    title: 'Cookware List',
    cookwareinstance_list: sortedAllCookwareInstances,
    createUrl: '/cookwareinstances/create',
  });
});

// Display detail page for a specific Cookware Instance
exports.cookwareinstance_detail = asyncHandler(async (req, res, next) => {
  const cookwareInstance = await CookwareInstance.findById(req.params.id)
    .populate('cookware')
    .exec();

  if (cookwareInstance === null) {
    // no results
    const err = new Error('Cookware Not Found');
    err.status = 404;
    return next(err);
  }

  res.render('cookwareinstance_detail', {
    title: `${cookwareInstance.cookware.title} - ${cookwareInstance._id}`,
    cookware_instance: cookwareInstance,
  });
});

// Dispaly Cookware Instance create form on GET
exports.cookwareinstance_create_get = asyncHandler(async (req, res, next) => {
  const allCookware = await Cookware.find({}).sort({ title: 1 }).exec();

  res.render('cookwareinstance_form', {
    title: 'Create New Cookware',
    cookware_list: allCookware,
  });
});

// Handle Cookware Instance create on POST
exports.cookwareinstance_create_post = [
  // Validate and sanitize
  body('cookware', 'Must choose a cookware type')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('date-bought').optional({ values: 'falsy' }).isISO8601().toDate(),
  body('weight').optional({ values: 'falsy' }).trim().escape(),
  body('condition', 'Must choose a condition')
    .isLength({ min: 1 })
    .trim()
    .escape(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cookware instance object with escaped and trimmed data.
    const cookwareInstance = new CookwareInstance({
      cookware: req.body.cookware,
      description: req.body.description,
      dateBought: req.body['date-bought'],
      weight: req.body.weight,
      condition: req.body.condition,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      const allCookware = await Cookware.find({}).sort({ title: 1 }).exec();

      res.render('cookwareinstance_form', {
        title: 'Create New Cookware',
        cookwareinstance: cookwareInstance,
        cookware_list: allCookware,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await cookwareInstance.save();
      // New cookware instance saved. Redirect to CookwareInstance detail page.
      res.redirect(cookwareInstance.url);
    }
  }),
];

// Dispaly Cookware Instance delete form on GET
exports.cookwareinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance delete GET');
});

// Handle Cookware Instance delete on POST
exports.cookwareinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance delete POST');
});

// Dispaly Cookware Instance update form on GET
exports.cookwareinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance update GET');
});

// Handle Cookware Instance update on POST
exports.cookwareinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance update POST');
});
