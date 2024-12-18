// routes/responseRouter.js
const express = require('express');
const router = express.Router();
const responseController = require('../controller/responseController');

router.post('/', responseController.createResponse);
router.get('/', responseController.getAllResponses);
router.get('/:id', responseController.getResponseById);
router.put('/:id', responseController.updateResponse);
router.delete('/:id', responseController.deleteResponse);

module.exports = router;
