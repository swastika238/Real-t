import mongoose from "mongoose";  
import bcrypt from "bcrypt";  
import JWT from "jsonwebtoken";
const userschema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        minLength:[5,"Email must be at least 5 characters long"],
        maxLength:[50,"Email must be at most 50 characters long"]
    },
    password:{
        type:String,
        required:true,
        select:false
    }
    })       
    userschema.statics.hashPassword=async function(password){
        return await bcrypt.hash(password,10);
    }
    userschema.methods.isValidPassword=async function(password){
        return await bcrypt.compare(password,this.password);
    }
    userschema.methods.generateJWT=function(){
        return JWT.sign({id:this._id,email:this.email},process.env.JWT_SECRET,{expiresIn:"24h"});
    }


    const User=mongoose.model('user',userschema);
    export default User;