const mongoose = require('mongoose');

const HorseSchema = new mongoose.Schema(
  {
    name:
    {
      type: String,
      required: true
    },
    breed:
    {
      type: String,
      required: true
    },
    slots:
      [
        {
          time:
          {
            type: String,
            required: true
          },
          available:
          {
            type: Boolean,
            default: true
          },
        },
      ],
    isAvailable:
    {
      type: Boolean,
      default: true
    },
    description:
    {
      type: String,
    },
    image:
    {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true
  },
  });

module.exports = mongoose.model('horses', HorseSchema);
