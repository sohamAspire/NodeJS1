const mongoose = require("mongoose");
const connection = mongoose.connect(process.env.DB_NAME);
const db = mongoose.connection;
db.once("open", function () {
  console.log("Connected successfully");
});
