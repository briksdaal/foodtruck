const PerishableInstance = require('../models/perishableinstance');
const CookwareInstance = require('../models/cookwareinstance');
const Recipes = require('../models/recipe');
const asyncHandler = require('express-async-handler');

// Display homepage
exports.index = asyncHandler(async (req, res, next) => {
  const [allPerishableInstances, allCookwareInstances, allRecipes] =
    await Promise.all([
      PerishableInstance.find({}, 'dateLastUse')
        .populate('perishable', 'title')
        .sort({ dateLastUse: 1 })
        .exec(),
      CookwareInstance.aggregate([
        { $match: {} },
        {
          $lookup: {
            from: 'cookwares',
            localField: 'cookware',
            foreignField: '_id',
            as: 'cookware',
          },
        },
        {
          $project: {
            description: 1,
            condition: 1,
            cookware: { $arrayElemAt: ['$cookware', 0] },
          },
        },
        {
          $sort: {
            'cookware.title': 1,
          },
        },
      ]).exec(),
      Recipes.find({}, 'title').sort({ title: 1 }).exec(),
    ]);

  const before_last_date_perishables = allPerishableInstances.filter(
    (p) => p.dateLastUse >= Date.now()
  );

  const after_last_date_perishables = allPerishableInstances.filter(
    (p) => p.dateLastUse < Date.now()
  );

  const usable_cookware = allCookwareInstances.filter(
    (c) => c.condition === 'Usable'
  );

  const maintenance_cookware = allCookwareInstances.filter(
    (c) => c.condition === 'Maintenance'
  );

  const not_usable_cookware = allCookwareInstances.filter(
    (c) => c.condition === 'No Longer Usable'
  );

  res.render('index', {
    title: 'Home page',
    before_last_date_perishables,
    after_last_date_perishables,
    usable_cookware,
    maintenance_cookware,
    not_usable_cookware,
    recipes_list: allRecipes,
  });
});
