const mongoose = require("mongoose");

const officeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Ensure the name field is required
  },
  location: {
    type: String,
    required: true, // Ensure the location field is required
  },
});

const Office = mongoose.model("Office", officeSchema);

module.exports = Office;
