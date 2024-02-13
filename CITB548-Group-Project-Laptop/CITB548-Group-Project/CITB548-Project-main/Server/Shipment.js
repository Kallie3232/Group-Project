const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  senderName: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  receiverEmail: {
    type: String,
    required: true,
  },
  packageDescription: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },

  // Add sender field to store reference to User
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // Reference to the User collection
  }
});

// Define a virtual property for the calculated price
shipmentSchema.virtual("price").get(function() {
  // Calculate the price based on the weight
  const price = this.weight > 20 ? 10 + this.weight : 5 + this.weight;
  return `$${price.toFixed(2)}`;
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

module.exports = Shipment;
