var express = require('express');
var router = express.Router();

const recipeController = require('../controllers/recipeController');

// GET request for list of all Recipe items
router.get('/', recipeController.recipe_list);

// GET request for creating a Recipe
router.get('/create', recipeController.recipe_create_get);

// POST request for creating a Recipe
router.post('/create', recipeController.recipe_create_post);

// GET request to delete a Recipe
router.get('/:id/delete', recipeController.recipe_delete_get);

// POST request to delete a Recipe
router.post('/:id/delete', recipeController.recipe_delete_post);

// GET request to update a Recipe
router.get('/:id/update', recipeController.recipe_update_get);

// POST request to update a Recipe
router.post('/:id/update', recipeController.recipe_update_post);

// GET request for specific recipe
router.get('/:id/', recipeController.recipe_detail);

module.exports = router;
