var mongoose = require('mongoose')
var courses = require('../model/courses')

exports.create_course = async (req, res) => {
    try {
        if (req.file) {
            req.body.course_image = req.file.originalname;
        }

        var data = await courses.create(req.body)
        console.log(data);
        if (data) {
            console.log("Course data added");
            res.status(200).json({
                status: true,
                message: "Course Data added",
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

exports.get_courses = async (req, res) => {
    try {
        var data = await courses.find()
        if (data) {
            res.status(200).json({
                status: true,
                message: "Courses fetched successfully",
                data: data
            })
        } else {
            res.status(404).json({
                status: false,
                message: "No courses found"
            })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error.message
        })
    }
}