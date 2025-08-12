    var mongoose = require('mongoose');

    var batchSchema = new mongoose.Schema({
        batch_name: { type: String, required: true }, // e.g., "Batch 1"
        document: { type: String },   // PDF file name or path from class_documents
        sessions: [
            {
                session_name: { type: String, required: true }, // e.g., "Morning Session"
                description: { type: String, required: true },
                start_time: { type: String, required: true },   // "09:00 AM"
                end_time: { type: String, required: true },     // "11:00 AM"
                date: { type: Date, required: true },
                is_active: { type: Boolean, default: false }
            }
        ]
    });

    var classesSchema = new mongoose.Schema({
        educator_id: { type: mongoose.Schema.Types.ObjectId, ref: 'educator', required: true },
        educator_name: { type: String },
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
        course_name: { type: String },
        class_name: { type: String, required: true },
        description: { type: String, required: true },
        class_language: { type: String }, //english , gujarati , hindi
        class_images: { type: String }, //for ui
        class_videos: { type: String }, // for ui
        class_size: { type: Number }, //total limit of students enroll in class
        price_per_session: { type: Number},
        keyword: { type: [String] }, //easy for searching
        tools_material: { type: [String] }, //pencil,paper
        parential_guidance: { type: String },
        class_certificate: { type: String }, // image
        educator_sign: { type: String }, //image
        class_documents: { type: [String] }, // store uploaded PDF paths
        batches: [batchSchema], // array of batch objects ex.. batch 1 , batch 2
        is_free: { type: Boolean, default: false },
        is_popular: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now }
    });

    module.exports = mongoose.model('Master_class', classesSchema);
