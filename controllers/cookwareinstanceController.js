const fs = require('fs').promises;
const CookwareInstance = require('../models/cookwareinstance');
const Cookware = require('../models/cookware');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { imageUploadAndValidation } = require('./imageUploadAndValidation');

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

  console.log(cookwareInstance);
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
  // Upload and validate image
  imageUploadAndValidation,
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
      image: req.file?.filename || null,
      condition: req.body.condition,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      if (cookwareInstance.image) {
        fs.unlink(`public/uploads/${cookwareInstance.image}`);
      }
      // Render the form again with sanitized values/error messages.
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
  // Get details of cookware instance
  const cookwareinstance = await CookwareInstance.findById(req.params.id)
    .populate('cookware')
    .exec();

  if (cookwareinstance === null) {
    // No results.
    res.redirect('/cookwareinstances');
    return;
  }

  res.render('cookwareinstance_delete', {
    title: `Delete Cookware - ${cookwareinstance.cookware.title} - ${cookwareinstance._id}`,
    cookwareinstance: cookwareinstance,
  });
});

// Handle Cookware Instance delete on POST
exports.cookwareinstance_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of cookware instance

  const cookwareinstance = await CookwareInstance.findById(req.params.id)
    .populate('cookware')
    .exec();

  if (cookwareinstance === null) {
    res.redirect('cookwareinstances');
    return;
  }

  if (cookwareinstance.image) {
    fs.unlink(`public/uploads/${cookwareinstance.image}`);
  }

  await CookwareInstance.findByIdAndDelete(req.body.cookwareinstanceid);
  res.redirect('/cookwareinstances');
});

// Dispaly Cookware Instance update form on GET
exports.cookwareinstance_update_get = asyncHandler(async (req, res, next) => {
  const [cookwareinstance, allCookware] = await Promise.all([
    CookwareInstance.findById(req.params.id).populate('cookware').exec(),
    Cookware.find({}).sort({ title: 1 }).exec(),
  ]);

  if (cookwareinstance === null) {
    // No results.
    const err = new Error('Cookware not found');
    err.status = 404;
    return next(err);
  }

  res.render('cookwareinstance_form', {
    title: `Update Cookware - ${cookwareinstance.cookware.title} - ${cookwareinstance._id}`,
    cookwareinstance: cookwareinstance,
    cookware_list: allCookware,
  });
});

// Handle Cookware Instance update on POST
exports.cookwareinstance_update_post = [
  // Upload and validate image
  imageUploadAndValidation,
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

    // Create a cookware instance object with escaped and trimmed data, and old id.
    const cookwareInstance = new CookwareInstance({
      cookware: req.body.cookware,
      description: req.body.description,
      dateBought: req.body['date-bought'],
      weight: req.body.weight,
      condition: req.body.condition,
      image: req.file?.filename || null,
      _id: req.params.id,
    });

    const currentCookwareinstance = await CookwareInstance.findById(
      req.params.id
    )
      .populate('cookware')
      .exec();

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      if (cookwareInstance.image) {
        fs.unlink(`public/uploads/${cookwareInstance.image}`);
      }

      // Get currrent cookware instance and cookware list for rerender
      const allCookware = await Cookware.find({}).sort({ title: 1 }).exec();

      res.render('cookwareinstance_form', {
        title: `Update Cookware - ${currentCookwareinstance.cookware.title} - ${currentCookwareinstance._id}`,
        cookwareinstance: cookwareInstance,
        cookware_list: allCookware,
        errors: errors.array(),
      });
      return;
    } else {
      // Delete current image
      if (currentCookwareinstance.image) {
        fs.unlink(`public/uploads/${currentCookwareinstance.image}`);
      }

      // Data from form is valid. Update the record
      const updatedCookwareInstance = await CookwareInstance.findByIdAndUpdate(
        req.params.id,
        cookwareInstance
      );
      // Cookware updated. Redirect to Cookware detail page.
      res.redirect(updatedCookwareInstance.url);
    }
  }),
];
