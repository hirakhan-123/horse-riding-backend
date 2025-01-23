const Joi = require('joi');

exports.createHorse = Joi.object({
    name: Joi.string().required(),
    breed: Joi.string().required(),
    description: Joi.string().required(),
    slots: Joi.array().items(
      Joi.object({
        time: Joi.string().valid('9:00 AM', '12:00 PM', '4:00 PM').required(), // Or you can add other valid times
        available: Joi.boolean().default(true),
      })
    ).length(3).required(),
    image: Joi.string().required(), 
    price: Joi.number().required()
  });
  
  exports.subscribeToHorse = Joi.object({
    packageType: Joi.string().valid('weekly', 'monthly').required(),
    selectedSlots: Joi.array().items(Joi.string().valid('9:00 AM', '12:00 PM', '4:00 PM')).min(1).max(7).required(), // Minimum 1 slot, max 7 for a week
  });

  exports.updateHorse = Joi.object({
    name: Joi.string().optional(),
    breed: Joi.string().optional(),
    description: Joi.string().optional(),
    slots: Joi.array().items(
        Joi.object({
            time: Joi.string().valid('9:00 AM', '12:00 PM', '4:00 PM').required(),
            available: Joi.boolean().default(true),
        })
    ).length(3).optional(),
    image: Joi.string().optional(),  
});
  

