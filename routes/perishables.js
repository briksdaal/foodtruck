var express = require('express');
var router = express.Router();

const perishableController = require('../controllers/perishableController');

// GET request for list of all Perishable items
router.get('/', perishableController.perishable_list);

// GET request for creating a Perishable
router.get('/create', perishableController.perishable_create_get);

// POST request for creating a Perishable
router.post('/create', perishableController.perishable_create_post);

// GET request to delete a Perishable
router.get('/:id/delete', perishableController.perishable_delete_get);

// POST request to delete a Perishable
router.post('/:id/delete', perishableController.perishable_delete_post);

// GET request to update a Perishable
router.get('/:id/update', perishableController.perishable_update_get);

// POST request to update a Perishable
router.post('/:id/update', perishableController.perishable_update_post);

// GET request for specific perishable
router.get('/:id/', perishableController.perishable_detail);

module.exports = router;
