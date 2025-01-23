const Joi = require('joi');

// Validation schema for adding an event
const addEventValidationSchema = Joi.object({
  eventName: Joi.string().required(),
  eventDate: Joi.date().required(),
  eventStartTime: Joi.string().required(), // New field for start time
  eventLocation: Joi.string().required(), // New field for location
  eventDescription: Joi.string().required(),
  image: Joi.allow().optional(), // New field for image placement
});

// Validation schema for updating an event
const updateEventValidationSchema = Joi.object({
  eventName: Joi.string().optional(),
  eventDate: Joi.date().optional(),
  eventStartTime: Joi.string().optional(), // Optional for update
  eventLocation: Joi.string().optional(), // Optional for update
  eventDescription: Joi.string().optional(),
  image: Joi.string().optional(), // Optional for update
});

module.exports = {
  addEventValidationSchema,
  updateEventValidationSchema,
};
