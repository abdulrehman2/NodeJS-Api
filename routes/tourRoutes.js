const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

//router.param('id', tourController.checkId);
//tourController.checkBody

router.route('/top-cheap-tours').get(tourController.getTopCheapTours, tourController.getAllTours);
router.route('/tour-stats').get(tourController.getTourStats);
router.route('/top-months/:year').get(tourController.getBusiestMonths);

router.route('/').post(tourController.addTours).get(tourController.getAllTours);
//tourController.checkBody,
router
  .route('/:id')
  .get(tourController.getSpecificTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
