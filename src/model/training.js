const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    durationInDays: {
        type: Number,
        required: true
    }, 
    sessionDurationInHours: {
        type: Number,
        required: true
    }, 
    price: {
        type: Number,
        required: true
    },
    trainerNames: [{   
        type: String,
        required: true
    }],
    startDate: {
        type: Date,
        required: true
    }, 
    endDate: {
        type: Date
    }, 
    timeSlot: {
        type: String,
        required: true
    }, 
    bookings: [
        {
            riderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            riderName: {
                type: String,
                required: true
            },
        },
    ],
    capacity: { 
        type: Number, 
        default: 10 
    },
});

trainingSchema.pre('save', function (next) {
    if (this.startDate && this.durationInDays) {
        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.endDate.getDate() + this.durationInDays - 1);
    }
    next();
});

module.exports = mongoose.model('Training', trainingSchema);