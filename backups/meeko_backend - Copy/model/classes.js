var mongoose = require('mongoose');
const { create } = require('./admin');
var classes = new mongoose.Schema({
    educator_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'educator', required: true },
    course_id :{ type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
    class_name: { type: String, required: true },
    description : { type: String, required: true },
    price : { type: Number, required: true },
    is_free : { type: Boolean, default: false },
    is_popular : { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    video_url: { type: String, required: true },
})

module.exports = mongoose.model('classes', classes)