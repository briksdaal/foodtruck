// get mongodb uri from arguments
const mongoDB = process.argv.slice(2)[0];

// import models
const Category = require('./models/category');
const Perishable = require('./models/perishable');
const PerishableInstance = require('./models/perishableinstance');
const Cookware = require('./models/cookware');
const CookwareInstance = require('./models/cookwareinstance');
const Recipe = require('./models/recipe');

const categories = [];
const perishables = [];
const cookwares = [];
const perishableinstances = [];
const cookwareinstances = [];
const recipes = [];

// set up mongoose connection
const mongoose = require('mongoose');
var debug = require('debug')('foodtruck:populate');
require('dotenv').config();
mongoose.set('strictQuery', false);

main().catch((err) => debug(err));

async function main() {
  await mongoose.connect(mongoDB);
  debug('connected');

  await clearDb();
  await createCategories();
  await createPerishables();
  await createCookware();
  await createPerishableInstances();
  await createCookwareInstances();
  await createRecipes();

  debug('closing connection');
  await mongoose.connection.close();
  debug('connection closed');
}

async function clearDb() {
  const connection = mongoose.connection;
  const db = connection.db;

  // drop all collections to clear db for fresh population
  const collections = await db.listCollections().toArray();

  await Promise.all(
    collections.map((c) =>
      (async () => {
        await connection.dropCollection(c.name);
        debug(`${c.name} collections dropped`);
      })()
    )
  );
}

async function categoryCreate(index, title) {
  const category = new Category({ title });
  await category.save();
  categories[index] = category;
  debug(`Added Category: ${title}`);
}

async function createCategories() {
  debug('Adding Categories');
  await Promise.all([
    categoryCreate(0, 'Fruits'),
    categoryCreate(1, 'Vegetables'),
    categoryCreate(2, 'Meat'),
    categoryCreate(3, 'Dairy'),
    categoryCreate(4, 'Seasonigs'),
    categoryCreate(5, 'Baked Goods'),
  ]);
}

async function perishableCreate(
  index,
  title,
  category,
  measureType,
  description
) {
  const perishableDetail = {
    title,
    measureType,
  };

  if (category != false) perishableDetail.category = category;
  if (description != false) perishableDetail.description = description;

  const perishable = new Perishable(perishableDetail);
  await perishable.save();
  perishables[index] = perishable;
  debug(`Added Perishable: ${title}`);
}

async function createPerishables() {
  debug('Adding Perishables');
  await Promise.all([
    perishableCreate(
      0,
      'Tomatoes',
      categories[1],
      'weight',
      'Bright and slightly acidic flavor, around 22 calories per 100 grams.'
    ),
    perishableCreate(
      1,
      'Salt',
      false,
      'weight',
      'Salty flavor, virtually calorie-free as it is a mineral.'
    ),
    perishableCreate(
      2,
      'Beef',
      categories[2],
      'weight',
      'Robust and savory flavor, approximately 250 calories per 100 grams.'
    ),
    perishableCreate(
      3,
      'Celery',
      categories[1],
      'weight',
      'Crisp and mildly peppery, very low-calorie at about 16 calories per 100 grams.'
    ),
    perishableCreate(
      4,
      'Apples',
      categories[0],
      'weight',
      'Sweet and slightly tart flavor, approximately 52 calories per 100 grams.'
    ),
    perishableCreate(
      5,
      'Bananas',
      categories[0],
      'weight',
      'Sweet and creamy, around 89 calories per 100 grams.'
    ),
    perishableCreate(
      6,
      'Mango',
      categories[0],
      'weight',
      'Sweet and tropical flavor, about 60 calories per 100 grams.'
    ),
    perishableCreate(
      7,
      'Lettuce',
      categories[1],
      'weight',
      'Mild and fresh, extremely low-calorie at about 5 calories per 100 grams.'
    ),
    perishableCreate(
      8,
      'Poultry',
      categories[2],
      'weight',
      'Mild and savory, calories vary but generally range from 150 to 250 per 100 grams.'
    ),
    perishableCreate(9, 'Milk', categories[3], 'volume', false),
    perishableCreate(
      10,
      'Cheddar Cheese',
      categories[3],
      'weight',
      'Sharp and savory flavor, around 400 calories per 100 grams, with a significant amount of fat and protein.'
    ),
    perishableCreate(
      11,
      'Paprika',
      categories[4],
      'weight',
      'Mildly sweet and slightly smoky flavor, negligible in calories as it is primarily used as a seasoning.'
    ),
    perishableCreate(
      12,
      'Black Pepper',
      categories[4],
      'weight',
      'Pungent and mildly spicy flavor, virtually calorie-free in typical usage due to the small amounts used.'
    ),
    perishableCreate(
      13,
      'Sugar',
      categories[4],
      'weight',
      'Sweet flavor, high in calories at approximately 387 calories per 100 grams, serving as a common sweetener in various culinary applications.'
    ),
    perishableCreate(
      14,
      'Hamburger Buns',
      categories[5],
      'units',
      'Mildly sweet, around 250 calories per bun, providing a soft base for sandwiches.'
    ),
  ]);
}

async function cookwareCreate(index, title, description) {
  const cookwareDetail = {
    title,
  };

  if (description != false) cookwareDetail.description = description;

  const cookware = new Cookware(cookwareDetail);
  await cookware.save();
  cookwares[index] = cookware;
  debug(`Added Cookware: ${title}`);
}

async function createCookware() {
  debug('Adding Cookware');
  await Promise.all([
    cookwareCreate(
      0,
      'Cast Iron Skillet',
      'Versatile for frying, sautéing, and baking, providing even heat distribution.'
    ),
    cookwareCreate(
      1,
      'Chef Knife',
      'A multipurpose knife for chopping, slicing, and dicing ingredients efficiently.'
    ),
    cookwareCreate(2, 'Small Saucepan', false),
    cookwareCreate(
      3,
      'Large Saucepan',
      'Ideal for cooking larger batches of soups, stews, or boiling pasta.'
    ),
  ]);
}

async function perishableInstanceCreate(
  index,
  perishable,
  dateBought,
  dateLastUse,
  amount,
  placeBought
) {
  const perishableInstanceDetail = {
    perishable,
    amount,
  };

  if (dateBought != false) perishableInstanceDetail.dateBought = dateBought;
  if (dateLastUse != false) perishableInstanceDetail.dateLastUse = dateLastUse;
  if (placeBought != false) perishableInstanceDetail.placeBought = placeBought;

  const perishableInstance = new PerishableInstance(perishableInstanceDetail);
  await perishableInstance.save();
  perishableinstances[index] = perishableInstance;
  debug(`Added Perishable Instance: ${amount} of ${perishable.title}`);
}

async function createPerishableInstances() {
  debug('Adding Perishable Instances');
  await Promise.all([
    perishableInstanceCreate(
      0,
      perishables[0],
      new Date(),
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date;
      })(),
      500,
      'Rami Levi The King'
    ),
    perishableInstanceCreate(1, perishables[14], false, false, 10, 'Dabbah'),
    perishableInstanceCreate(
      2,
      perishables[10],
      false,
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 10);
        return date;
      })(),
      200,
      false
    ),
    perishableInstanceCreate(4, perishables[8], false, false, 1500, 'Keshet'),
    perishableInstanceCreate(
      5,
      perishables[7],
      (() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date;
      })(),
      false,
      800,
      "Farmer's Market"
    ),
  ]);
}

async function cookwareInstanceCreate(
  index,
  cookware,
  description,
  dateBought,
  weight,
  condition
) {
  const cookwareInstanceDetail = {
    cookware,
  };

  if (description != false) cookwareInstanceDetail.description = description;
  if (dateBought != false) cookwareInstanceDetail.dateBought = dateBought;
  if (weight != false) cookwareInstanceDetail.weight = weight;
  if (condition != false) cookwareInstanceDetail.condition = condition;

  const cookwareInstance = new CookwareInstance(cookwareInstanceDetail);
  await cookwareInstance.save();
  cookwareinstances[index] = cookwareInstance;
  debug(`Added Cookware Instance: ${cookware.title} - ${description}`);
}

async function createCookwareInstances() {
  debug('Adding Cookware Instances');
  await Promise.all([
    cookwareInstanceCreate(
      0,
      cookwares[0],
      'Inherited from grandma. Will Outlive us all.',
      (() => {
        const date = new Date();
        date.setDate(date.getDate() - 200000);
        return date;
      })(),
      2000,
      'Usable'
    ),
    cookwareInstanceCreate(1, cookwares[0], false, false, 1000, false),
    cookwareInstanceCreate(
      2,
      cookwares[2],
      'About 500ml. Kinda crappy.',
      (() => {
        const date = new Date();
        date.setDate(date.getDate() - 2000);
        return date;
      })(),
      2000,
      'Maintenance'
    ),
    cookwareInstanceCreate(
      3,
      cookwares[1],
      '22" sharp as a... knife.',
      (() => {
        const date = new Date();
        date.setDate(date.getDate() - 1000);
        return date;
      })(),
      300,
      'Usable'
    ),
    cookwareInstanceCreate(
      4,
      cookwares[3],
      'Best for soups. Enamel coating.',
      (() => {
        const date = new Date();
        date.setDate(date.getDate() - 200);
        return date;
      })(),
      2000,
      'Usable'
    ),
    cookwareInstanceCreate(
      5,
      cookwares[3],
      'Can heat in oven',
      false,
      false,
      'No Longer Usable'
    ),
  ]);
}

async function recipeCreate(
  index,
  title,
  description,
  instructions,
  cookware,
  ingredients
) {
  const recipeDetail = {
    title,
    instructions,
    ingredients,
  };

  if (description != false) recipeDetail.description = description;
  if (cookware != false) recipeDetail.cookware = cookware;

  const recipe = new Recipe(recipeDetail);
  await recipe.save();
  recipes[index] = recipe;
  debug(`Added Recipe: ${title}`);
}

async function createRecipes() {
  debug('Adding Recipes');
  await Promise.all([
    recipeCreate(
      0,
      'Salad',
      'Can always be made.',
      'Cut Up Vegetables.\nPlate Nicely.',
      cookwares[1],
      [
        { perishable: perishables[0], amount: 100 },
        { perishable: perishables[7], amount: 100 },
      ]
    ),
    recipeCreate(
      0,
      'Hamburger',
      false,
      'Mince beef and make patty\n.Fry patty.\nToast bun.\nAssemble with lettuce and tomatoes on top.',
      cookwares[0],
      [
        { perishable: perishables[2], amount: 250 },
        { perishable: perishables[14], amount: 1 },
        { perishable: perishables[0], amount: 50 },
        { perishable: perishables[7], amount: 50 },
      ]
    ),
  ]);
}
