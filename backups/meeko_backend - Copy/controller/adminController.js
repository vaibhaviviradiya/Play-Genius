const admin = require('../model/admin')
var bcrypt = require('bcrypt')
var  jwt = require('jsonwebtoken')
exports.admin = async(req,res)=>{
    try{
        req.body.password = await bcrypt.hash(req.body.password,12) 
        // req.body.password = password
        
        var data = admin.create(req.body)
        if(data)
        {
            console.log("data add");
            res.status(200).json({
                status:true,
                message:"Data add",
                data : data
            })
        }
    }
    catch(error)
    {
        res.status(401).json({
            status: false,
            error: error.message
        })        
    }
}

exports.admin_login = async(req,res)=>{
    try{
        var {username,email,password} = req.body
        var data = await admin.findOne({
            $or : [
                {username : username},
                {email : email}
            ]
        })
        console.log(data);
        if(data)
        {
            var password = await bcrypt.compare(req.body.password,data.password)
            if(!password)
            {
                console.log("Incorrect Password");                
            }
        
                var token = await jwt.sign(data.id,'admintoken')
                res.status(200).json({
                    status : true,
                    message : "Admin Login successfully",
                    token
                })
            
        }   
        else
        {
            console.log("no user found with this username");
            
        }
    }
    catch(error)
    {
        res.status(401).json({
            status: false,
            error: error.message
        })
    }
}