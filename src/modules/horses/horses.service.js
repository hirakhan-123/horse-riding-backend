const Horse = require('../../model/horse');

exports.createHorse = async (horseData) => {
  const existingHorse = await Horse.findOne({ name: horseData.name, breed: horseData.breed });

  if (existingHorse) {
      throw new Error('Horse with the same name and breed already exists');
  }
    const horse = new Horse({
      name: horseData.name,
      breed: horseData.breed,
      slots: horseData.slots, 
      description:horseData.description,
      image: horseData.image,
      isAvailable: true,
      price:horseData.price
    });
    await horse.save();
    return horse;
  };
    exports.getHorseDetails = async () => {
    return await Horse.find();
  };
  
  exports.getHorseDetailsById = async (horseId) => {
    return await Horse.findById(horseId);
};

exports.updateHorse = async (req) => {
  const horseId = req.params.horseId;
  let updateData = req.body;

  if (typeof updateData.slots === "string") {
    updateData.slots = JSON.parse(updateData.slots);
  }
  const horse = await Horse.findById(horseId);
  if (!horse) {
    const error = new Error("Horse not found");
    error.statusCode = 404;
    throw error;
  }

  if (req.file) {
    updateData.image = req.file.filename;
  } else {
    delete updateData.image;
  }
  return await Horse.findByIdAndUpdate(horseId, updateData, { new: true });
};


 exports.subscribeToHorse = async (horseId, packageType, selectedSlots) => {
    const horse = await Horse.findById(horseId);
    if (!horse) {
      throw new Error('Horse not found');
    }
    const unavailableSlots = selectedSlots.filter(slot => 
      !horse.slots.some(horseSlot => 
        horseSlot.time.trim().toLowerCase() === slot.trim().toLowerCase() && horseSlot.available
      )
    );

    if (unavailableSlots.length > 0) {
      throw new Error(`Selected slots are unavailable: ${unavailableSlots.join(', ')}`);
    }

    horse.slots.forEach(slot => {
      if (selectedSlots.includes(slot.time)) {
        slot.available = false;
      }
    });

    await horse.save();

    const subscription = new Subscription({
      userId: user._id,  
      horseId: horseId,
      packageType,
      selectedSlots,
      
    });
    await subscription.save();

    return subscription;
};
exports.deleteHorse = async (horseId) => {
  const horse = await Horse.findByIdAndDelete(horseId);
  if (!horse) {
      const error = new Error("Horse not found");
      error.statusCode = 404;
      throw error;
  }
  return horse;
};
  