const Event = require('../../model/events');  // Import the Event model
const User = require('../../model/user'); 


// Service to create a new event
exports.createEvent = async (eventData) => {
  try {
    const event = new Event(eventData);
    await event.save();
    return event;
  } catch (error) {
    throw new Error('Error creating event: ' + error.message);
  }
};

// Service to get all events
exports.getAllEvents = async () => {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error('Error fetching events: ' + error.message);
  }
};
// Service to delete an event
exports.deleteEvent = async (eventId) => {
  try {
    // Find and delete the event by ID
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    // Return the deleted event (or null if not found)
    return deletedEvent;
  } catch (error) {
    throw new Error('Error deleting event: ' + error.message);
  }
};
// Service to update an event
exports.updateEvent = async (eventId, updateData) => {
  try {
    // Find the event by ID and update with new data
    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation
    });

    // Return the updated event (or null if not found)
    return updatedEvent;
  } catch (error) {
    throw new Error('Error updating event: ' + error.message);
  }
};


// Periodically delete past events
exports.deletePastEvents = async () => {
  try {
    await Event.deletePastEvents();
    console.log('Past events deleted successfully.');
  } catch (error) {
    throw new Error('Error deleting past events: ' + error.message);
  }
};

exports.updateEventInterest = async (eventId, userId, interest) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  const username = user.username; // Get username from User model

  if (interest === 'interested') {
    // Remove user from `notInterestedUsers`
    event.notInterestedUsers = event.notInterestedUsers.filter(user => user.userId.toString() !== userId);

    // Add user to `interestedUsers` only if not already added
    if (!event.interestedUsers.some(user => user.userId.toString() === userId)) {
      event.interestedUsers.push({ userId, username });
    }
  } else if (interest === 'notInterested') {
    // Remove user from `interestedUsers`
    event.interestedUsers = event.interestedUsers.filter(user => user.userId.toString() !== userId);

    // Add user to `notInterestedUsers` only if not already added
    if (!event.notInterestedUsers.some(user => user.userId.toString() === userId)) {
      event.notInterestedUsers.push({ userId, username });
    }
  }

  await event.save();
  return event;
};
