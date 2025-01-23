const horseService = require('./horses.service');


exports.createHorse = async (req, res) => {
  try {
    let horseData = req.body;

    if (typeof horseData.slots === "string") {
        horseData.slots = JSON.parse(horseData.slots);
    }

    if (req.file) {
      console.log(req.file.path)
      horseData.image = `/uploads/horses/${req.file.filename}`;
    }

    const createdHorse = await horseService.createHorse(horseData);
    res.status(201).json({ message: "Horse created successfully", horse: createdHorse });
} catch (error) {
    res.status(500).json({ error: "Error creating horse", details: error.message });
}
};
  
  exports.getHorseDetails = async (req, res) => {
    try {
      const horse = await horseService.getHorseDetails(req.params.horseId);
      if (!horse) {
        return res.status(404).json({ message: 'Horse not found' });
      }
      res.status(200).json({ horse });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching horse details', details: error.message });
    }
  };

  exports.getHorseDetailsById = async (req, res) => {
    try {
        const horseId = req.params.horseId;
        const horse = await horseService.getHorseDetailsById(horseId);

        if (!horse) {
            return res.status(404).json({ message: 'Horse not found' });
        }

        res.status(200).json({ horse });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching horse details', details: error.message });
    }
};

exports.updateHorse = async (req, res) => {
  try {
      const updatedHorse = await horseService.updateHorse(req);
      res.status(200).json({ message: "Horse updated successfully", horse: updatedHorse });
  } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  }
};

  
exports.subscribeToHorse = async (req, res) => {
  try {
    const { horseId } = req.params;
    const { packageType, selectedSlots } = req.body;

    const slots = Array.isArray(selectedSlots) ? selectedSlots : [selectedSlots];
        console.log('Selected Slots:', slots);

    const subscription = await horseService.subscribeToHorse(horseId, packageType, slots, req.user);
    res.status(200).json({ message: 'Subscription successful', subscription });
  } catch (error) {
    res.status(500).json({ error: 'Error subscribing to horse', details: error.message });
  }
};

exports.deleteHorse = async (req, res) => {
  try {
      const { horseId } = req.params;

      const deletedHorse = await horseService.deleteHorse(horseId);

      res.status(200).json({ message: "Horse deleted successfully", deletedHorse });
  } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
  }
};
