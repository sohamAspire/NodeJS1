const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Data = new mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String
})

Data.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
        console.log(this.password);
    }
    next();
})


const Detail = mongoose.model('Detail', Data)
module.exports = Detail;
