const PerishableInstance = require('../models/perishableinstance');
const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { imageUploadAndValidation, deleteImage } = require('./imageActions');

// Display list of all Perishable Instances
exports.perishableinstance_list = asyncHandler(async (req, res, next) => {
  const allPerishableInstances = await PerishableInstance.find(
    {},
    'dateLastUse'
  )
    .populate('perishable', 'title')
    .sort({ dateLastUse: 1 })
    .exec();

  res.render('perishableinstance_list', {
    title: 'Perishables List',
    perishableinstance_list: allPerishableInstances,
    createUrl: '/perishableinstances/create',
  });
});

// Display detail page for a specific Perishable Instance
exports.perishableinstance_detail = asyncHandler(async (req, res, next) => {
  const perishableInstance = await PerishableInstance.findById(req.params.id)
    .populate({
      path: 'perishable',
      populate: {
        path: 'category',
      },
    })
    .exec();

  if (perishableInstance === null) {
    // no results
    const err = new Error('Perishable Not Found');
    err.status = 404;
    return next(err);
  }

  res.render('perishableinstance_detail', {
    title: `${perishableInstance.perishable.title} - ${perishableInstance._id}`,
    perishable_instance: perishableInstance,
  });
});

// Dispaly Perishable Instance create form on GET
exports.perishableinstance_create_get = asyncHandler(async (req, res, next) => {
  const allPerishables = await Perishable.find({}).sort({ title: 1 }).exec();

  res.render('perishableinstance_form', {
    title: 'Create New Perishable',
    perishable_list: allPerishables,
  });
});

// Handle Perishable Instance create on POST
exports.perishableinstance_create_post = [
  // Upload and validate image
  imageUploadAndValidation,
  // Validate and sanitize
  body('perishable', 'Must choose a perishable type')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('amount', 'Must specify an amount').trim().isLength({ min: 1 }).escape(),
  body('place-bought', 'Place must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('date-bought').optional({ values: 'falsy' }).isISO8601().toDate(),
  body('date-last-use').optional({ values: 'falsy' }).isISO8601().toDate(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a perishable instance object with escaped and trimmed data.
    const perishableInstance = new PerishableInstance({
      perishable: req.body.perishable,
      amount: req.body.amount,
      placeBought: req.body['place-bought'],
      dateBought: req.body['date-bought'],
      dateLastUse: req.body['date-last-use'],
      image: req.file?.filename || null,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      deleteImage(perishableInstance);
      // Render the form again with sanitized values/error messages.
      const allPerishables = await Perishable.find({})
        .sort({ title: 1 })
        .exec();

      res.render('perishableinstance_form', {
        title: 'Create New Perishable',
        perishable_list: allPerishables,
        perishableinstance: perishableInstance,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      await perishableInstance.save();
      // New perishable saved. Redirect to Perishable detail page.
      res.redirect(perishableInstance.url);
    }
  }),
];

// Dispaly Perishable Instance delete form on GET
exports.perishableinstance_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of perishable instance
  const perishableinstance = await PerishableInstance.findById(req.params.id)
    .populate('perishable')
    .exec();

  if (perishableinstance === null) {
    // No results.
    res.redirect('/perishableinstances');
    return;
  }

  res.render('perishableinstance_delete', {
    title: `Delete Perishable - ${perishableinstance.perishable.title} - ${perishableinstance._id}`,
    perishableinstance: perishableinstance,
  });
});

// Handle Perishable Instance delete on POST
exports.perishableinstance_delete_post = asyncHandler(
  async (req, res, next) => {
    // Get details of perishable instance
    const perishableinstance = await PerishableInstance.findById(req.params.id)
      .populate('perishable')
      .exec();

    if (perishableinstance === null) {
      res.redirect('perishableinstances');
      return;
    }

    deleteImage(perishableinstance);

    await PerishableInstance.findByIdAndDelete(req.body.perishableinstanceid);
    res.redirect('/perishableinstances');
  }
);

// Dispaly Perishable Instance update form on GET
exports.perishableinstance_update_get = asyncHandler(async (req, res, next) => {
  const [perishableinstance, allPerishables] = await Promise.all([
    PerishableInstance.findById(req.params.id).populate('perishable').exec(),
    Perishable.find({}).sort({ title: 1 }).exec(),
  ]);

  if (perishableinstance === null) {
    // No results.
    const err = new Error('Perishable not found');
    err.status = 404;
    return next(err);
  }

  res.render('perishableinstance_form', {
    title: `Update perishable - ${perishableinstance.perishable.title} - ${perishableinstance._id}`,
    perishableinstance: perishableinstance,
    perishable_list: allPerishables,
  });
});

// Handle Perishable Instance update on POST
exports.perishableinstance_update_post = [
  // Upload and validate image
  imageUploadAndValidation,
  // Validate and sanitize
  body('perishable', 'Must choose a perishable type')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('amount', 'Must specify an amount').trim().isLength({ min: 1 }).escape(),
  body('place-bought', 'Place must contain at least 3 characters')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('date-bought').optional({ values: 'falsy' }).isISO8601().toDate(),
  body('date-last-use').optional({ values: 'falsy' }).isISO8601().toDate(),
  // Process request
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a perishable instance object with escaped and trimmed data, and old id.
    const perishableInstance = new PerishableInstance({
      perishable: req.body.perishable,
      amount: req.body.amount,
      placeBought: req.body['place-bought'],
      dateBought: req.body['date-bought'],
      dateLastUse: req.body['date-last-use'],
      image: req.file?.filename || null,
      _id: req.params.id,
    });

    // Get currrent perishable instance
    const currentPerishableinstance = await PerishableInstance.findById(
      req.params.id
    )
      .populate('perishable')
      .exec();

    if (!errors.isEmpty()) {
      // There are errors
      // Delete image
      deleteImage(perishableInstance);

      // Get perishable list for rerender
      const allPerishables = await Perishable.find({})
        .sort({ title: 1 })
        .exec();

      res.render('perishableinstance_form', {
        title: `Update Perishable - ${currentPerishableinstance.perishable.title} - ${currentPerishableinstance._id}`,
        perishableinstance: perishableInstance,
        perishable_list: allPerishables,
        errors: errors.array(),
      });
      return;
    } else {
      // Delete current image
      deleteImage(currentPerishableinstance);

      // Data from form is valid. Update the record
      const updatedPerishableInstance =
        await PerishableInstance.findByIdAndUpdate(
          req.params.id,
          perishableInstance
        );
      // Perishable updated. Redirect to perishable detail page.
      res.redirect(updatedPerishableInstance.url);
    }
  }),
];
