const Cookware = require('../models/cookware');
const asyncHandler = require('express-async-handler');

// Display list of all Cookware
exports.cookware_list = asyncHandler(async (req, res, next) => {
  const allCookware = await Cookware.find({}).sort({ title: 1 }).exec();

  res.render('cookware_list', {
    title: 'Cookware Types List',
    cookware_list: allCookware,
  });
});

// Display detail page for a specific Cookware
exports.cookware_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Cookware detail: ${req.params.id}`);
});

// Dispaly Cookware create form on GET
exports.cookware_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware create GET');
});

// Handle Cookware create on POST
exports.cookware_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Cookware create POST');
});

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
