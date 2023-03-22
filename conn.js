const mongoose = require("mongoose");
const connection = mongoose.connect("mongodb://localhost:27017/Soham");
const db = mongoose.connection;
db.once("open", function () {
  console.log("Connected successfully");
});
