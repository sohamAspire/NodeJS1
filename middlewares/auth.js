const jwt = require('jsonwebtoken');
const Detail = require('../Schema');


const auth = async(req, res , next)=>{
    try {
        const cookieToken = req.cookies.Login;
        const verifyUser = jwt.verify(cookieToken , process.env.SECRET_KEY);
        // console.log(verifyUser); 
        
        const user = await Detail.findOne({_id : verifyUser})
        
        req.user = user
        req.token = cookieToken
        // console.log(user);
        next();     
        
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;