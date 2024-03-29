const Cookware = require('../models/cookware');
const CookwareInstance = require('../models/cookwareinstance');
const Recipe = require('../models/recipe');
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
  // Get details of cookware and all cookware instances and recipes using it
  const [cookware, allInstancesOfCookware, allRecipesWithCookware] =
    await Promise.all([
      Cookware.findById(req.params.id).exec(),
      CookwareInstance.find({ cookware: req.params.id }, 'title').exec(),
      Recipe.find({ cookware: req.params.id }, 'title').exec(),
    ]);

  if (cookware === null) {
    // No results.
    res.redirect('/cookware');
    return;
  }

  res.render('cookware_delete', {
    title: `Delete Cookware Type - ${cookware.title}`,
    cookware: cookware,
    cookwareinstance_list: allInstancesOfCookware,
    recipe_list: allRecipesWithCookware,
  });
});

// Handle Cookware delete on POST
exports.cookware_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of cookware and all cookware instances and recipes using it
  const [cookware, allInstancesOfCookware, allRecipesWithCookware] =
    await Promise.all([
      Cookware.findById(req.params.id).exec(),
      CookwareInstance.find({ cookware: req.params.id }, 'title').exec(),
      Recipe.find({ cookware: req.params.id }, 'title').exec(),
    ]);

  if (cookware === null) {
    // No results.
    res.redirect('/cookware');
    return;
  }

  if (allInstancesOfCookware.length > 0 || allRecipesWithCookware.length > 0) {
    // Cookware has instances or recipes using it. Render in the same way as for GET route
    res.render('cookware_delete', {
      title: `Delete Cookware Type - ${cookware.title}`,
      cookware: cookware,
      cookwareinstance_list: allInstancesOfCookware,
      recipe_list: allRecipesWithCookware,
    });
    return;
  } else {
    // Cookware has no instances or recipes using it. Delete object and redirect to cookware list
    await Cookware.findByIdAndDelete(req.body.cookwareid);
    res.redirect('/cookware');
  }
});

// Dispaly Cookware update form on GET
exports.cookware_update_get = asyncHandler(async (req, res, next) => {
  const cookware = await Cookware.findById(req.params.id);

  if (cookware === null) {
    // No results.
    const err = new Error('Cookware type not found');
    err.status = 404;
    return next(err);
  }

  res.render('cookware_form', {
    title: `Update Cookware Type - ${cookware.title}`,
    cookware: cookware,
  });
});

// Handle Cookware update on POST
exports.cookware_update_post = [
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

    // Create a cookware object with escaped and trimmed data, and old id.
    const cookware = new Cookware({
      title: req.body.title,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      // Get current cookware object
      const currentCookware = await Cookware.findById(req.params.id);

      res.render('cookware_form', {
        title: `Update Cookware Type - ${currentCookware.title}`,
        cookware: cookware,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record
      const updatedCookware = await Cookware.findByIdAndUpdate(
        req.params.id,
        cookware
      );
      // Cookware updated. Redirect to Cookware detail page.
      res.redirect(updatedCookware.url);
    }
  }),
];
