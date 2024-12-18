// routes/jobOfferRoutes.js
const express = require('express');
const router = express.Router();
const jobOfferController = require('../controller/jobOfferController');


router.post('/',  jobOfferController.createJobOffer);
router.get('/', jobOfferController.getAllJobOffers);
router.get('/:id', jobOfferController.getJobOfferById);
router.put('/:id',  jobOfferController.updateJobOffer);
router.delete('/:id',  jobOfferController.deleteJobOffer);


module.exports = router;
