const Cookware = require('../models/cookware');
const CookwareInstance = require('../models/cookwareinstance');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

// Display list of all Cookware
exports.cookware_list = asyncHandler(async (req, res, next) => {
  const allCookware = await Cookware.find({}).sort({ title: 1 }).exec();

  res.render('cookware_list', {
    title: 'Cookware Types List',
    cookware_list: allCookware,
    createUrl: '/cookware/create',
  });
});

// Display detail page for a specific Cookware
exports.cookware_detail = asyncHandler(async (req, res, next) => {
  const [cookware, cookwareInstances] = await Promise.all([
    Cookware.findById(req.params.id).exec(),
    CookwareInstance.find({ cookware: req.params.id }, 'description condition')
      .populate('cookware')
      .sort({ condition: -1 })
      .exec(),
  ]);

  if (cookware === null) {
    // no results
    const err = new Error('Cookware Type Not Found');
    err.status = 404;
    return next(err);
  }

  res.render('cookware_detail', {
    title: `Cookware Type Details: ${cookware.title}`,
    cookware_type: cookware,
    cookware_instances: cookwareInstances,
  });
});

// Dispaly Cookware create form on GET
exports.cookware_create_get = (req, res, next) => {
  res.render('cookware_form', {
    title: 'Create New Cookware Type',
  });
};

// Handle Cookware create on POST
exports.cookware_create_post = [
  // Validate and sanitize
  body('title', 'Cookware type title must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a cookware object with escaped and trimmed data.
    const cookware = new Cookware({
      title: req.body.title,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('cookware_form', {
        title: 'Create New Cookware Type',
        cookware,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Cookware with same name already exists.
      const cookwareExists = await Cookware.findOne({
        title: req.body.title,
      }).exec();
      if (cookwareExists) {
        // Cookware exists, redirect to its detail page.
        res.redirect(cookwareExists.url);
      } else {
        await cookware.save();
        // New cookware saved. Redirect to Cookware detail page.
        res.redirect(cookware.url);
      }
    }
  }),
];

// Dispaly Cookware delete form on GET
exports.cookware_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware delete GET');
});

// Handle Cookware delete on POST
exports.cookware_delete_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware delete POST');
});

// Dispaly Cookware update form on GET
exports.cookware_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware update GET');
});

// Handle Cookware update on POST
exports.cookware_update_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware update POST');
});
