const mongoose = require("mongoose");

//MongoDB connection URI
const uri = 'mongodb+srv://kallie:Flyingpanda222@logistictest.8whxcpn.mongodb.net/';

//Set uo options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

mongoose.connect(uri, options)
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Error connecting to MongoDB', error));

const newSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  
  // Add shipments field to store an array of references to Shipment documents
  shipments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shipment' // Reference to the Shipment collection
  }]
});

const collection = mongoose.model("collection", newSchema);

module.exports = collection;
