var mongoose = require('mongoose');

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
    price_per_session: { type: Number },
    keyword: { type: [String] }, //easy for searching
    tools_material: { type: [String] }, //pencil,paper
    parential_guidance: { type: String },
    class_certificate: { type: String }, // image
    educator_sign: { type: String }, //image
    class_documents: { type: [String] }, // store uploaded PDF paths
    // batches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }], // array of batch objects ex.. batch 1 , batch 2
    is_free: { type: Boolean, default: false },
    is_popular: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Master_class', classesSchema);



