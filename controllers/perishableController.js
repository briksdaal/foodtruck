const Perishable = require('../models/perishable');
const asyncHandler = require('express-async-handler');

// Display list of all Perishables
exports.perishable_list = asyncHandler(async (req, res, next) => {
  const allPerishables = await Perishable.find({}).sort({ title: 1 }).exec();

  res.render('perishable_list', {
    title: 'Perishable Types List',
    perishable_list: allPerishables,
  });
});

// Display detail page for a specific Perishable
exports.perishable_detail = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Perishable detail: ${req.params.id}`);
});

// Dispaly Perishable create form on GET
exports.perishable_create_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable create GET');
});

// Handle Perishable create on POST
exports.perishable_create_post = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable create POST');
});

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
