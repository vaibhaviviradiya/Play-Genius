var mongoose = require('mongoose')
var parents = require('../model/parent')
var bcrypt = require('bcrypt')

exports.parent_register = async (req, res) => {
    try {
        if (req.file) {
            req.body.child_image = req.file.originalname;
        }

        var password = await bcrypt.hash(req.body.password, 10)
        req.body.password = password
        var child_password = await bcrypt.hash(req.body.child_password, 10)
        req.body.child_password = child_password
        var data = await parents.create(req.body)
        console.log(data);
        if (data) {
            console.log("parents data add");
            res.status(200).json({
                status: true,
                message: "parents Data add",
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

exports.parent_login = async (req, res) => {
    try {
        var { username, email, password } = req.body
        var data = await parents.findOne({
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
                message: "Parent Login successfully",
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