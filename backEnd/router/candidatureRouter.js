// routes/candidatureRoutes.js
const express = require('express');
const router = express.Router();
const candidatureController = require('../controller/candidatureController');

router.post('/', candidatureController.createCandidature);
router.get('/', candidatureController.getAllCandidatures);
router.get('/:id', candidatureController.getCandidatureById);
router.put('/:id', candidatureController.updateCandidature);
router.delete('/:id', candidatureController.deleteCandidature);

module.exports = router;
