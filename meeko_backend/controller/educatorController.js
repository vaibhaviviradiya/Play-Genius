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

const jwt = require('jsonwebtoken');

exports.educator_login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const data = await educator.findOne({
            $or: [{ username }, { email }]
        });

        if (!data) return res.status(404).json({ message: 'Educator not found' });

        const match = await bcrypt.compare(password, data.password);
        if (!match) return res.status(400).json({ message: 'Incorrect password' });

        const token = jwt.sign(
            { educator_id: data._id, educator_name: data.username , educator_email : data.email},
            process.env.JWT_SECRET           
        );

        res.status(200).json({
            status: true,
            message: "Educator Login successfully",
            token
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
};
