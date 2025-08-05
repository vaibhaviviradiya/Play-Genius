var mongoose = require('mongoose')

var category= mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
    }
})

module.exports = mongoose.model('category',category)