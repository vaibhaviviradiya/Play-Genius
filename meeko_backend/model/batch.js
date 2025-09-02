var mongoose = require('mongoose');

var batchSchema = new mongoose.Schema({
    class_id : { type: mongoose.Schema.Types.ObjectId, ref: "Master_class", required: true },
    batch_name: { type: String, required: true }, // e.g., "Batch 1"
    documents: { type: String },   // PDF file name or path from class_documents
});
module.exports = mongoose.model('Batch', batchSchema);