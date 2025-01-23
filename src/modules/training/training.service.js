const Training = require('../../model/training');

exports.createTraining = async (data) => {
    const { title, description, durationInDays, sessionDurationInHours, price, trainerNames, startDate, timeSlot } = data;
    const existingSession = await this.checkConflict(trainerNames, startDate, durationInDays, timeSlot);
    if (existingSession) {
        throw new Error('A training session already exists in this time range for these trainers');
    }
    const training = new Training({
        title,
        description,
        durationInDays,
        sessionDurationInHours, 
        price,
        trainerNames,
        startDate,
        timeSlot
    });

    return await training.save();
};

exports.checkConflict = async (trainerNames, startDate, durationInDays, timeSlot, excludeId) => {
    const conflictQuery = {
        trainerNames: { $in: trainerNames },
        startDate,
        durationInDays,
        timeSlot,
    };
    if (excludeId) {
        conflictQuery._id = { $ne: excludeId };  
    }
    return await Training.findOne(conflictQuery);
};

exports.getAllTrainings = async () => {
    return await Training.find();
};

exports.getTrainingById = async (id) => {
    return await Training.findById(id);
};
exports.updateTraining = async (id, data) => {
    const { title, description, durationInDays, sessionDurationInHours, price, trainerNames, startDate, timeSlot,capacity } = data;

    const parsedStartDate = new Date(startDate);
    if (isNaN(parsedStartDate)) {
        throw new Error('Invalid startDate format');
    }

    const parsedDuration = Number(durationInDays);
    if (isNaN(parsedDuration)) {
        throw new Error('Invalid durationInDays format, must be a number');
    }

    let endDate = new Date(parsedStartDate);
    endDate.setDate(endDate.getDate() + parsedDuration - 1);  

    const existingSession = await this.checkConflict(trainerNames, parsedStartDate, parsedDuration, timeSlot, id);
    if (existingSession) {
        throw new Error('A conflicting training session already exists');
    }
    const updatedTraining = await Training.findByIdAndUpdate(
        id,
        { title, description, durationInDays: parsedDuration, sessionDurationInHours, price, trainerNames, startDate: parsedStartDate, timeSlot, endDate,capacity },
        { new: true }
    );

    return updatedTraining;
};

exports.deleteTraining = async (id) => {
    return await Training.findByIdAndDelete(id);
};

// Book a training session for a rider
exports.bookTraining = async (trainingId, rider) => {
    const training = await Training.findById(trainingId);

    if (!training) {
        throw new Error('Training session not found');
    }

    // Check if the rider is already booked for this session
    const isAlreadyBooked = training.bookings.some(
        (booking) => booking.riderId.toString() === rider.riderId
    );
    if (isAlreadyBooked) {
        throw new Error('Rider is already booked for this session');
    }

    // Check if the session is at full capacity
    if (training.bookings.length >= training.capacity) {
        throw new Error('Training session is fully booked');
    }

    // Add the rider to the bookings
    training.bookings.push(rider);
    return await training.save();
};
