const Perishable = require('../models/perishable');
const PerishableInstance = require('../models/perishableinstance');
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
