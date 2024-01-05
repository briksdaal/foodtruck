const Cookware = require('../models/cookware');
const asyncHandler = require('express-async-handler');

// Display homepage
exports.index = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Site home page');
});
