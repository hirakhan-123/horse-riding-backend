const eventService = require('./event.service'); // Import the event service

// Controller to create an event
exports.createEvent = async (req, res) => {
  try {
    // Log the uploaded file (for debugging purposes)
    console.log(req.file); 

    const { eventName, eventDate, eventDescription, eventLocation, eventStartTime } = req.body;

    // Prepare event data
    const eventData = {
      eventName,
      eventDate,
      eventDescription,
      eventLocation,
      eventStartTime
    };

    // If an image was uploaded, add the image path to eventData
    if (req.file) {
      console.log(req.file.path);  // Log the file path (for debugging purposes)
      eventData.image = `/uploads/horses/${req.file.filename}`;
    }

    // Create a new event using the event service
    const newEvent = await eventService.createEvent(eventData);

    // Respond with success
    res.status(201).json({
      message: 'Event created successfully',
      event: newEvent
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};



// Controller to get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Controller to delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const eventId = req.params.id; // Get event ID from request parameters

    // Call the service to delete the event
    const deletedEvent = await eventService.deleteEvent(eventId);

    // Check if the event was found and deleted
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Respond with success
    res.status(200).json({
      message: 'Event deleted successfully',
      event: deletedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Controller to update an event
exports.updateEvent = async (req, res) => {
  try {
    const eventId = req.params.id; // Get the event ID from request parameters
    const updateData = req.body; // Get the data to update from the request body

    // Call the service to update the event
    const updatedEvent = await eventService.updateEvent(eventId, updateData);

    // Check if the event was found and updated
    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Respond with success
    res.status(200).json({
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Update user interest
exports.updateInterest = async (req, res) => {
  try {
    const { eventId, userId, interest } = req.body; // interest: 'interested' or 'notInterested'

    const updatedEvent = await eventService.updateEventInterest(eventId, userId, interest);
    res.status(200).json({ message: 'Interest updated successfully', event: updatedEvent });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

