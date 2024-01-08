const CookwareInstance = require('../models/cookwareinstance');
const asyncHandler = require('express-async-handler');

const sortByTitle = require('../helpers/sortByTitle');

// Display list of all Cookware Instances
exports.cookwareinstance_list = asyncHandler(async (req, res, next) => {
  const allCookwareInstances = await CookwareInstance.find({})
    .populate('cookware', 'title')
    .exec();

  const sortedAllCookwareInstances = allCookwareInstances.sort(
    sortByTitle('cookware', 'title')
  );

  console.log(sortedAllCookwareInstances.map((c) => c.description));

  res.render('cookwareinstance_list', {
    title: 'Cookware List',
    cookwareinstance_list: sortedAllCookwareInstances,
  });
});

// Display detail page for a specific Cookware Instance
exports.cookwareinstance_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Cookware Instance detail: ${req.params.id}`);
});

// Dispaly Cookware Instance create form on GET
exports.cookwareinstance_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance create GET');
});

// Handle Cookware Instance create on POST
exports.cookwareinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware Instance create POST');
});

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
