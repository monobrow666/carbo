var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      maxlength: 255
    },
    name: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true
    },
    servingSize: {
      type: Number,
      min: 0,
      max: 65535
    },
    servingSizeUnit: {
      type: String,
      maxlength: 31,
      trim: true,
      enum: ['grams', 'ounces', 'cups', 'liters', 'pieces']
    },
    carbs: {
      type: Number,
      min: 0,
      required: true
    },
    notes: {
      type: String,
      maxlength: 65535
    }
  },
  { timestamps: true }
);
var Item = mongoose.model('Item', itemSchema);
module.exports = Item;
