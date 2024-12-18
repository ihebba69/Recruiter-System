
const express = require('express');
const router = express.Router();
const recommendationController = require('../controller/recommendationController');

router.post('/', recommendationController.createRecommendation);
router.get('/', recommendationController.getAllRecommendations);
router.get('/:id', recommendationController.getRecommendationById);
router.put('/:id', recommendationController.updateRecommendation);
router.delete('/:id', recommendationController.deleteRecommendation);

module.exports = router;
