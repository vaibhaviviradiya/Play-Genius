var mongoose = require('mongoose')

var educator = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },  
    password: { type: String, required: true },
    contact : { type: String, required: true },
    profile_picture: { type: String, required: true },
    gender : {type :String, required: true},
})

module.exports = mongoose.model('educator', educator)