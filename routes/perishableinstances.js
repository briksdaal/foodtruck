var express = require('express');
var router = express.Router();

const perishableInstanceController = require('../controllers/perishableinstanceController');

// GET request for list of all Perishable Instance items
router.get('/', perishableInstanceController.perishableinstance_list);

// GET request for creating a Perishable Instance
router.get(
  '/create',
  perishableInstanceController.perishableinstance_create_get
);

// POST request for creating a Perishable Instance
router.post(
  '/create',
  perishableInstanceController.perishableinstance_create_post
);

// GET request to delete a Perishable Instance
router.get(
  '/:id/delete',
  perishableInstanceController.perishableinstance_delete_get
);

// POST request to delete a Perishable Instance
router.post(
  '/:id/delete',
  perishableInstanceController.perishableinstance_delete_post
);

// GET request to update a Perishable Instance
router.get(
  '/:id/update',
  perishableInstanceController.perishableinstance_update_get
);

// POST request to update a Perishable Instance
router.post(
  '/:id/update',
  perishableInstanceController.perishableinstance_update_post
);

// GET request for specific perishable
router.get('/:id/', perishableInstanceController.perishableinstance_detail);

module.exports = router;
