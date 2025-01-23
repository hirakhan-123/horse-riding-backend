const express = require('express');
const router = express.Router();
const horseController = require('./horse.controller');
const upload = require('../../middleware/upload');
const { authenticate } = require('../../middleware/authenticate');
const { requireAdmin } = require('../../middleware/permissions/role-middleware');
const { validateAddHorseRequest, validateUpdateHorseRequest,validateSubscribeToHorseRequest } = require('../../middleware/validation/horse/index');

router.get('/horses', horseController.getHorseDetails);
router.get('/horses/:horseId', horseController.getHorseDetailsById);

router.post('/create-horse',upload.single('image'), [authenticate,  validateAddHorseRequest , requireAdmin], horseController.createHorse);
router.post('/:horseId/subscribe', horseController.subscribeToHorse);

router.patch('/update-horse/:horseId', upload.single('image'), [authenticate, validateUpdateHorseRequest, requireAdmin], horseController.updateHorse);
router.post('/subscribe/:horseId', [authenticate,validateSubscribeToHorseRequest], horseController.subscribeToHorse);

router.delete('/delete-horse/:horseId', horseController.deleteHorse);
// router.get('/horses/:id', horseController.getHorseById);
// router.get('/horses/:horseId/slots', horseController.getAvailableSlots);
// router.post('/horses/:id/book-slot', horseController.bookTimeSlot);

module.exports = router;
