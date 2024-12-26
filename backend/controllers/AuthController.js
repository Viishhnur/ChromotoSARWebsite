const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-models/User');

const signup = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        const user = await UserModel.findOne({email});

        if(user){
            return res.status(409).json({message : "User already exists",success : false});
        }

        // create new user if user does not exist
        const userModel = new UserModel({name,email,password});

        // hash the password now 
        userModel.password = await bcrypt.hash(password,10);

        // now save the user
        await userModel.save(); // save the user to the database

        return res.status(201).json({message : "User created successfully",success : true});
    }
    catch(err){
        return res.status(500).json({message : "Internal server error",success : false});
    }
}

const login = async (req,res)=>{
    try{
        const {email,password} = req.body; // get email and password from the request body client side
        // now check in db
        const user = await UserModel.findOne({email});

        if(!user){
            return res.status(403).json({message : "email or password incorrect!",success : false});
        }

        // now compare the password that user entered with the password in the database
        const isPasswdValid = await bcrypt.compare(password,user.password);

        if(!isPasswdValid){
            return res.status(403).json({message : "email or password incorrect!",success : false});
        }

        // now on succesful validation of password we need to create a jwt token which can be used for further api calls
        const jwtToken = jwt.sign(
            // first parameter is payload
            {email : user.email, name : user.name , _id : user._id},
            // second parameter is secret key
            process.env.JWT_SECRET,
            // third parameter is options
            {expiresIn : '1h'}
        )
        console.log(jwtToken);
        // now send this jwt token in response
        res.status(200).json({
            message : "Login successfull",
            success : true,
            token : jwtToken,
            name : user.name,
            email : user.email,
            
        });
    }
    catch(err){
        res.status(500).json({message : "Internal server error",success : false});
    }
}
module.exports = {
    signup,
    login 
}