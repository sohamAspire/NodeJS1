const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const Data = new mongoose.Schema({
    firstname : String,
    lastname : String,
    email : String,
    password : String,
    tokens : [{
        token: {
            type: String,
            required: true
        }
    }]
})

Data.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10)
        console.log(this.password);
    }
    next();
})

Data.methods.generateToken = async function(){
    try {
        const token  = jwt.sign(this._id.toString(),process.env.SECRET_KEY)
        console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const Detail = mongoose.model('Detail', Data)
module.exports = Detail;
