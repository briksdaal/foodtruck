var express = require('express');
var router = express.Router();

const cookwareInstanceController = require('../controllers/cookwareinstanceController');

// GET request for list of all Cookware Instance items
router.get('/', cookwareInstanceController.cookwareinstance_list);

// GET request for creating a Cookware Instance
router.get('/create', cookwareInstanceController.cookwareinstance_create_get);

// POST request for creating a Cookware Instance
router.post('/create', cookwareInstanceController.cookwareinstance_create_post);

// GET request to delete a Cookware Instance
router.get(
  '/:id/delete',
  cookwareInstanceController.cookwareinstance_delete_get
);

// POST request to delete a Cookware Instance
router.post(
  '/:id/delete',
  cookwareInstanceController.cookwareinstance_delete_post
);

// GET request to update a Cookware Instance
router.get(
  '/:id/update',
  cookwareInstanceController.cookwareinstance_update_get
);

// POST request to update a Cookware Instance
router.post(
  '/:id/update',
  cookwareInstanceController.cookwareinstance_update_post
);

// GET request for specific Cookware
router.get('/:id/', cookwareInstanceController.cookwareinstance_detail);

module.exports = router;
