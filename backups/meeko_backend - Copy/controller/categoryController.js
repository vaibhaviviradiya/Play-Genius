var category = require('../model/categories')
var admin = require('../model/admin')
var jwt = require('jsonwebtoken')

exports.addcategory = async (req, res) => {
    try {
        var admintoken = await jwt.verify(req.headers.authorization, 'admintoken')
        console.log("admin token", admintoken);
        if (admintoken) {
            var data = await category.create(req.body)
            if (data) {
                res.status(200).json({
                    status: true,
                    data
                })
            }
        }
    }
    catch (error) {
        res.status(401).json({
            status: false,
            error: error.message
        })
    }
}

exports.viewcategory = async(req,res)=>{
    try{
        var data = await category.find()
        if(data)
        {
            res.status(200).json({
                status : true,
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