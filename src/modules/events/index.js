const express = require('express');
const router = express.Router();
const eventController = require('./event.controller'); 
const {validateAddEventRequest,validateUpdateEventRequest}= require ('../../middleware/validation/events')
const { authenticate } = require('../../middleware/authenticate');
const upload = require('../../middleware/upload');
const { requireAdmin } = require('../../middleware/permissions/role-middleware');

router.get('/get-event', eventController.getAllEvents);
router.post('/create-event', upload.single('image'), [authenticate, validateAddEventRequest, requireAdmin], eventController.createEvent);
router.patch('/update-event/:id',upload.single('image'),[authenticate,validateUpdateEventRequest,requireAdmin], eventController.updateEvent);
router.delete('/delete-event/:id', eventController.deleteEvent);
router.patch('/event/update-interest', authenticate, eventController.updateInterest);

module.exports = router;
