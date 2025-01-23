const bookingService = require('./booking.service');

// Controller to create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { horseId, trainingId, amount } = req.body;  // Check if trainingId is provided
    const userId = req.user.id; // Extract the user from a token or request context

    // If the booking is for training, ensure that trainingId is provided
    if (trainingId) {
      const bookingData = {
        user: userId,
        training: trainingId, // Link to training session
        bookingDate: Date.now(),
        amount,
      };

      const booking = await bookingService.createBooking(bookingData, true); // Passing flag for training
      return res.status(201).json({
        message: 'Training booking created successfully',
        booking,
      });
    }

    // If the booking is for a horse, keep the original logic
    const bookingData = {
      user: userId,
      horse: horseId,
      bookingDate: Date.now(),
      amount,
    };

    const booking = await bookingService.createBooking(bookingData, false);
    return res.status(201).json({
      message: 'Horse booking created successfully',
      booking,
    });

  } catch (error) {
    return res.status(400).json({
      message: 'Error creating booking',
      error: error.message || error,
    });
  }
};


// Controller to get all bookings for a user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user.id);  // Assuming user is in request
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching bookings',
      error: error.message || error,
    });
  }
};

// Controller to get all bookings for admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getAllBookings(); // Call service method
    return res.status(200).json(bookings);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching all bookings',
      error: error.message || error,
    });
  }
};

// Controller to update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;
    const updatedBooking = await bookingService.updateBookingStatus(bookingId, status);
    return res.status(200).json({
      message: 'Booking status updated',
      booking: updatedBooking,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error updating booking status',
      error: error.message || error,
    });
  }
};

// Controller to cancel a booking
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const cancelledBooking = await bookingService.cancelBooking(bookingId);
    return res.status(200).json({
      message: 'Booking cancelled',
      booking: cancelledBooking,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Error cancelling booking',
      error: error.message || error,
    });
  }
};
