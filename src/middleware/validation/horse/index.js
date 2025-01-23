const { createHorse, subscribeToHorse,updateHorse } = require('./horse-validation.schema');

exports.validateAddHorseRequest = (req, res, next) => {
    try {
        if (req.body.slots) {
            req.body.slots = JSON.parse(req.body.slots);
        }
        if (req.file) {
            req.body.image = req.file.path;
        }
        const { error } = createHorse.validate(req.body, { abortEarly: false });
        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((detail) => detail.message),
            });
        }
        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid input format", error: err.message });
    }
};

exports.validateUpdateHorseRequest = (req, res, next) => {
    try {
        if (typeof req.body.slots === "string") {
            req.body.slots = JSON.parse(req.body.slots);
        }

        const { error } = updateHorse.validate(req.body, { abortEarly: false });

        if (error) {
            return res.status(400).json({
                message: "Validation error",
                details: error.details.map((detail) => detail.message),
            });
        }

        next();
    } catch (err) {
        return res.status(400).json({ message: "Invalid slots format", details: err.message });
    }
};
exports.validateSubscribeToHorseRequest = (req, res, next) => {
    try {
      if (typeof req.body.selectedSlots === "string") {
        req.body.selectedSlots = JSON.parse(req.body.selectedSlots);
      }
  
      const { error } = subscribeToHorse.validate(req.body, { abortEarly: false });
  
      if (error) {
        return res.status(400).json({
          message: "Validation error",
          details: error.details.map((detail) => detail.message),
        });
      }
  
      next();
    } catch (err) {
      return res.status(400).json({ message: "Invalid input format", details: err.message });
    }
  };
  


