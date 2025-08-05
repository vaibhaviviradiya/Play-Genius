var mongoose = require('mongoose')

var parent = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique: true
    },
    email:{
        type : String,
        required : true,
        unique: true
    },
    contact: {
        type: String,      
        required: true
    },
    password : {
          type : String,
        required : true
    },  
    child_name: {
        type: String,
        required: true
    },
    child_username : {  
        type: String,
        required: true
    },
    child_age: {
        type: Number,
        required: true      
    },
    child_password: {
        type: String,
        required: true
    },
    child_image: {
        type: String
    },
    date_of_birth: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('parent',parent)