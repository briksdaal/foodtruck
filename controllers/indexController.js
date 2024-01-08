const PerishableInstance = require('../models/perishableinstance');
const CookwareInstance = require('../models/cookwareinstance');
const Recipes = require('../models/recipe');
const asyncHandler = require('express-async-handler');

const sortByTitle = require('../helpers/sortByTitle');

// Display homepage
exports.index = asyncHandler(async (req, res, next) => {
  const [allPerishableInstances, allCookwareInstances, allRecipes] =
    await Promise.all([
      PerishableInstance.find({}, 'dateLastUse')
        .populate('perishable', 'title')
        .sort({ dateLastUse: 1 })
        .exec(),
      CookwareInstance.find({}).populate('cookware').exec(),
      Recipes.find({}, 'title').sort({ title: 1 }).exec(),
    ]);

  const sortedAllCookwareInstances = allCookwareInstances.sort(
    sortByTitle('cookware', 'title')
  );

  const before_last_date_perishables = allPerishableInstances.filter(
    (p) => p.dateLastUse >= Date.now()
  );

  const after_last_date_perishables = allPerishableInstances.filter(
    (p) => p.dateLastUse < Date.now()
  );

  const usable_cookware = sortedAllCookwareInstances.filter(
    (c) => c.condition === 'Usable'
  );

  const maintenance_cookware = sortedAllCookwareInstances.filter(
    (c) => c.condition === 'Maintenance'
  );

  const not_usable_cookware = sortedAllCookwareInstances.filter(
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
