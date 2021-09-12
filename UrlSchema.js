const mongoose = require("mongoose");

const { Schema } = mongoose;

const urlSchema = new Schema({
  originalUrl: { type: String, required: true },
});

module.exports = urlSchema;