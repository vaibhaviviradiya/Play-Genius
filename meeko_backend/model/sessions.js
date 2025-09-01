var mongoose = require('mongoose');

var sessionsSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch",required: true  },
    session_name: { type: String, required: true }, // e.g., "Morning Session"
    description: { type: String, required: true },
    start_time: { type: String, required: true },   // "09:00 AM"
    end_time: { type: String, required: true },     // "11:00 AM"
    date: { type: Date, required: true },
    is_active: { type: Boolean, default: false }
})
module.exports = mongoose.model('Session', sessionsSchema);
