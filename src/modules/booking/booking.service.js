const Booking = require('../../model/booking');  
const Training = require('../../model/training');
const Horse = require('../../model/horse')

// Service to create a booking
exports.createBooking = async (bookingData, isTraining) => {
  try {
    // Check if the booking is for a training session
    if (isTraining) {
      // Check if training session exists
      const training = await Training.findById(bookingData.training);
      if (!training) {
        throw new Error('Training session not found');
      }

      // Prevent double booking for the same time slot
      const isAlreadyBooked = training.bookings.some(
        (booking) => booking.riderId.toString() === bookingData.user.toString()
      );
      if (isAlreadyBooked) {
        throw new Error('Rider is already booked for this training session');
      }

      // Ensure training session has available spots (example: using a max capacity value)
      if (training.bookings.length >= training.capacity) {
        throw new Error('Training session is fully booked');
      }

      // Add the booking to the training session
      // training.bookings.push({
      //   riderId: bookingData.user,
      //   riderName: bookingData.riderName,
      // });

      await training.save();

      // Create the booking entry
      const booking = new Booking(bookingData);
      await booking.save();

      return booking;
    } else {
      // This is the original logic for horse bookings
      const booking = new Booking(bookingData);
      await booking.save();
      return booking;
    }
  } catch (error) {
    throw new Error('Error creating booking: ' + error.message);
  }
};

// Service to get all bookings for a user
exports.getUserBookings = async (userId) => {
  try {
    const bookings = await Booking.find({ user: userId }).populate('horse training');
    return bookings;
  } catch (error) {
    throw new Error('Error fetching bookings: ' + error.message);
  }
};

// Service to get all bookings for an admin (could filter by status, etc.)
exports.getAllBookings = async () => {
  try {
    const bookings = await Booking.find()
      .populate('user')   // Populate the User data
      .populate('horse')  // Populate the Horse data
      .populate('training')  // Populate the Training data
      .exec();
    return bookings;
  } catch (error) {
    throw new Error('Error fetching bookings: ' + error.message);
  }
};

// Service to update booking status
exports.updateBookingStatus = async (bookingId, status) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    return updatedBooking;
  } catch (error) {
    throw new Error('Error updating booking status: ' + error.message);
  }
};

// Service to cancel a booking
exports.cancelBooking = async (bookingId) => {
  try {
    const cancelledBooking = await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' }, { new: true });
    return cancelledBooking;
  } catch (error) {
    throw new Error('Error cancelling booking: ' + error.message);
  }
};
