const PerishableInstance = require('../models/perishableinstance');
const asyncHandler = require('express-async-handler');

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
  res.send('NOT IMPLEMENTED: Perishable Instance create GET');
});

// Handle Perishable Instance create on POST
exports.perishableinstance_create_post = asyncHandler(
  async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Perishable Instance create POST');
  }
);

// Dispaly Perishable Instance delete form on GET
exports.perishableinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable Instance delete GET');
});

// Handle Perishable Instance delete on POST
exports.perishableinstance_delete_post = asyncHandler(
  async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Perishable Instance delete POST');
  }
);

// Dispaly Perishable Instance update form on GET
exports.perishableinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Perishable Instance update GET');
});

// Handle Perishable Instance update on POST
exports.perishableinstance_update_post = asyncHandler(
  async (req, res, next) => {
    res.send('NOT IMPLEMENTED: Perishable Instance update POST');
  }
);
