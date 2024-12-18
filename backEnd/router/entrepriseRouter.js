// routes/enterpriseRouter.js
const express = require('express');
const router = express.Router();
const enterpriseController = require('../controller/entrepriseController');


router.post('/', enterpriseController.createEnterprise);
router.get('/', enterpriseController.getAllEnterprises);
router.get('/:id', enterpriseController.getEnterpriseById);
router.put('/:id', enterpriseController.updateEnterprise);
router.delete('/:id', enterpriseController.deleteEnterprise);

module.exports = router;
