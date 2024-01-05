var express = require('express');
var router = express.Router();

const cookwareController = require('../controllers/cookwareController');

// GET request for list of all Cookware items
router.get('/', cookwareController.cookware_list);

// GET request for creating a Cookware
router.get('/create', cookwareController.cookware_create_get);

// POST request for creating a Cookware
router.post('/create', cookwareController.cookware_create_post);

// GET request to delete a Cookware
router.get('/:id/delete', cookwareController.cookware_delete_get);

// POST request to delete a Cookware
router.post('/:id/delete', cookwareController.cookware_delete_post);

// GET request to update a Cookware
router.get('/:id/update', cookwareController.cookware_update_get);

// POST request to update a Cookware
router.post('/:id/update', cookwareController.cookware_update_post);

// GET request for specific Cookware
router.get('/:id/', cookwareController.cookware_detail);

module.exports = router;
