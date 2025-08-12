// models/liveSession.js
const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema({
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Master_class', required: true }, //selected class ni id params mathi lese 
    batch_id: { type: mongoose.Schema.Types.ObjectId, required: true }, //selected batch ni from combo box
    session_id: { type: mongoose.Schema.Types.ObjectId, required: true }, //selected session dynamically from combo bx

    meeting_link: { type: String, required: true },
    meeting_code: { type: String },
    provider: { 
        //This tells which platform the live class is being hosted on.  
        type: String, 
        enum: ['google_meet', 'zoom', 'jitsi', 'other'], //this prevents invalid entries like "facebok_live"
        default: 'google_meet' 
    },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    is_live: { type: Boolean, default: false },
    recording_url: { type: String }, 
    //After the live class ends, sometimes a recording is available (Zoom cloud recording, Google Drive link)
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'educator', required: true },
    educator_name: { type: String},

    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiveSession', liveSessionSchema);
