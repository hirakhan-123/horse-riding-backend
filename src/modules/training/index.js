const express = require('express');
const router = express.Router();
const trainingController = require('./training.controller');
const { authenticate } = require('../../middleware/authenticate');
const { requireAdmin } = require('../../middleware/permissions/role-middleware');

// Training session routes
router.get('/trainings', trainingController.getAllTrainings);
router.get('/training/:id', trainingController.getTrainingById);
router.post('/create-training', authenticate, requireAdmin, trainingController.createTraining);
router.patch('/update-training/:id', authenticate, requireAdmin, trainingController.updateTraining);
router.delete('/delete-training/:id', authenticate, requireAdmin, trainingController.deleteTraining);
router.post('/training/:id/book', authenticate, trainingController.bookTraining);

module.exports = router;
