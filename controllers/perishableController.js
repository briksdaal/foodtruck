const Perishable = require('../models/perishable');
const PerishableInstance = require('../models/perishableinstance');
const Recipe = require('../models/recipe');
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
      measureType: req.body['measure-type'],
    });

    if (req.body.category) perishable.category = req.body.category;

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
      // Check if perishable with same name already exists.
      const perishableExists = await Perishable.findOne({
        title: req.body.title,
      }).exec();
      if (perishableExists) {
        // perishable exists, redirect to its detail page.
        res.redirect(perishableExists.url);
      } else {
        await perishable.save();
        // New perishable saved. Redirect to perishable detail page.
        res.redirect(perishable.url);
      }
    }
  }),
];

// Dispaly Perishable delete form on GET
exports.perishable_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of perishable and all perishable instances and recipes using it
  const [perishable, allInstancesOfPerishable, allRecipesWithPerishable] =
    await Promise.all([
      Perishable.findById(req.params.id).exec(),
      PerishableInstance.find({ perishable: req.params.id }, 'title').exec(),
      Recipe.find({ 'ingredients.perishable': req.params.id }, 'title').exec(),
    ]);

  if (perishable === null) {
    // No results.
    res.redirect('/perishables');
    return;
  }

  res.render('perishable_delete', {
    title: `Delete Perishable Type - ${perishable.title}`,
    perishable: perishable,
    perishableinstance_list: allInstancesOfPerishable,
    recipe_list: allRecipesWithPerishable,
  });
});

// Handle Perishable delete on POST
exports.perishable_delete_post = asyncHandler(async (req, res, next) => {
  // Get details of perishable and all perishable instances and recipes using it
  const [perishable, allInstancesOfPerishable, allRecipesWithPerishable] =
    await Promise.all([
      Perishable.findById(req.params.id).exec(),
      PerishableInstance.find({ perishable: req.params.id }, 'title').exec(),
      Recipe.find({ 'ingredients.perishable': req.params.id }, 'title').exec(),
    ]);

  if (perishable === null) {
    // No results.
    res.redirect('/perishables');
    return;
  }

  if (
    allInstancesOfPerishable.length > 0 ||
    allRecipesWithPerishable.length > 0
  ) {
    // Perishable has instances or recipes using it. Render in the same way as for GET route
    res.render('perishable_delete', {
      title: `Delete Perishable Type - ${perishable.title}`,
      perishable: perishable,
      perishableinstance_list: allInstancesOfPerishable,
      recipe_list: allRecipesWithPerishable,
    });
    return;
  } else {
    // Perishable has no instances or recipes using it. Delete object and redirect to perishable list
    await Perishable.findByIdAndDelete(req.body.perishableid);
    res.redirect('/perishables');
  }
});

// Dispaly Perishable update form on GET
exports.perishable_update_get = asyncHandler(async (req, res, next) => {
  const [perishable, allCategories] = await Promise.all([
    Perishable.findById(req.params.id).exec(),
    Category.find({}).sort({ title: 1 }).exec(),
  ]);

  res.render('perishable_form', {
    title: `Update Perishable Type - ${perishable.title}`,
    perishable: perishable,
    category_list: allCategories,
  });
});

// Handle Perishable update on POST
exports.perishable_update_post = [
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

    // Create a perishable object with escaped and trimmed data, and old id.
    const perishable = new Perishable({
      title: req.body.title,
      description: req.body.description,
      measureType: req.body['measure-type'],
      category: req.body.category || null,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.

      // Get currrent perishable and category list for rerender
      const [currentPerishable, allCategories] = await Promise.all([
        Perishable.findById(req.params.id).exec(),
        Category.find({}).sort({ title: 1 }).exec(),
      ]);

      res.render('perishable_form', {
        title: `Update Perishable Type - ${currentPerishable.title}`,
        perishable: perishable,
        category_list: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record
      const updatedPerishable = await Perishable.findByIdAndUpdate(
        req.params.id,
        perishable
      );
      // Perishable updated. Redirect to Perishable detail page.
      res.redirect(updatedPerishable.url);
    }
  }),
];
