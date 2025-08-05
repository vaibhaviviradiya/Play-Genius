var mongoose = require('mongoose')

var course = mongoose.Schema({
    course_name: { type: String, required: true },
    course_image: { type: String },
    course_description: { type: String, required: true },
})

module.exports = mongoose.model('Course', course)
