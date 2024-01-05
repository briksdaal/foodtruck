var express = require('express');
var router = express.Router();

const categoryController = require('../controllers/categoryController');

// GET request for list of all Category items
router.get('/', categoryController.category_list);

// GET request for creating a Category
router.get('/create', categoryController.category_create_get);

// POST request for creating a Category
router.post('/create', categoryController.category_create_post);

// GET request to delete a Category
router.get('/:id/delete', categoryController.category_delete_get);

// POST request to delete a Category
router.post('/:id/delete', categoryController.category_delete_post);

// GET request to update a Category
router.get('/:id/update', categoryController.category_update_get);

// POST request to update a Category
router.post('/:id/update', categoryController.category_update_post);

// GET request for specific Category
router.get('/:id/', categoryController.category_detail);

module.exports = router;
