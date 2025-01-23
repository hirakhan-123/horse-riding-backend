const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventName: {
    type: String,
    required: true,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  eventStartTime: {
    type: String, // Store time as a string (e.g., '10:00 AM')
    required: true,
  },
  eventLocation: {
    type: String,
    required: true,
    trim: true,
  },
  eventDescription: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // URL or path to the image
    required: true,
  },
  interestedUsers: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
    ref: 'User',
    default: [],
  },
  notInterestedUsers: {
    type: [mongoose.Schema.Types.ObjectId], // Array of user IDs
    ref: 'User',
    default: [],
  },
}, { timestamps: true });

// Auto-delete past events
eventSchema.statics.deletePastEvents = async function () {
  const now = new Date();
  await this.deleteMany({ eventDate: { $lt: now } });
};

module.exports = mongoose.model('Event', eventSchema);
