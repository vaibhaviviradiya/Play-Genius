var mongoose = require('mongoose')
var educator = require('../model/Educator')
var bcrypt = require('bcrypt')

exports.educator_register = async (req, res) => {
    try {
        if (req.file) {
            req.body.profile_picture = req.file.originalname;
        }

        var password = await bcrypt.hash(req.body.password, 10)
        req.body.password = password
        var data = await educator.create(req.body)
        console.log(data);
        if (data) {
            console.log("educator data add");
            res.status(200).json({
                status: true,
                message: "educator Data add",
                data: data
            })
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
}

exports.educator_login = async (req, res) => {
    try {
        var { email, username, password } = req.body
        var data = await educator.findOne({
              $or: [
                { username: username },
                { email: email }
            ]
        })
        console.log(data);
        if (data) {
            var password = await bcrypt.compare(req.body.password, data.password)
            if (!password) {
                console.log("Incorrect Password");
            }
            res.status(200).json({
                status: true,
                message: "Educator Login successfully",
            })
        }
    }
    catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
}