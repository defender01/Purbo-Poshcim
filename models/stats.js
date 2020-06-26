const mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
  visit: {
      type:Number
  }
});

module.exports = mongoose.model("Stats", statsSchema);
