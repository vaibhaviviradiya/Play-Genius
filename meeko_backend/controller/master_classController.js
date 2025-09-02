const jwt = require('jsonwebtoken');
const classesSchema = require('../model/classes');
const batch = require('../model/batch')
const session = require('../model/sessions')
const mongoose = require('mongoose')

exports.create_class = async (req, res) => {
    try {
        //     const token = req.headers.authorization?.startsWith('Bearer ')
        // ? req.headers.authorization.split(' ')[1]
        // : req.headers.authorization;

        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // educator ni id
        if (req.files) {
            if (req.files['class_images']) {
                req.body.class_images = req.files['class_images'][0].originalname;
            }
            if (req.files['class_videos']) {
                req.body.class_videos = req.files['class_videos'][0].originalname;
            }
            if (req.files['class_certificate']) {
                req.body.class_certificate = req.files['class_certificate'][0].originalname;
            }
            if (req.files['class_documents']) {
                req.body.class_documents = req.files['class_documents'].map(file => file.originalname);
            }
        }

        const class_details = {
            ...req.body,
            educator_id: decoded.educator_id,
            educator_name: decoded.educator_name
        };

        const new_class = await classesSchema.create(class_details);

        res.status(201).json({
            success: true,
            data: new_class
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.create_batch = async (req, res) => {
    try {
        var data = req.body;
        var document_file = null;
        if (req.files || req.files["documents"]) {
            documentFile = req.files["documents"][0].originalname;
        }

        const batch_data = await batch.create({
            ...data,
            document: document_file
        })

        res.status(201).json({ success: true, data: batch_data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.create_session = async (req, res) => {
    try {
        const data = req.body;

        const sessionData = await session.create({ ...data });

        res.status(201).json({ success: true, data: sessionData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getClassDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const classData = await mongoose.model("Master_class").findById(id).lean();
        if (!classData) return res.status(404).json({ message: "Class not found" });

        const batches = await mongoose.model("Batch").find({ class_id: id }).lean();

        for (let batch of batches) {
            batch.sessions = await mongoose.model("Session").find({ batch: batch._id }).lean();
        }

        classData.batches = batches;

        res.json({ success: true, data: classData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getClassesByEducator = async (req, res) => {
    try {
        const token = req.headers.authorization

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const educator_id = decoded.educator_id;
        console.log("educator_id >>> ", educator_id);

        const classes = await mongoose.model("Master_class").find({ educator_id }).lean();
        // loop through classes and add batches + sessions
        for (let classObj of classes) {
            const batches = await mongoose.model("Batch").find({ class_id: classObj._id }).lean();

            for (let batch of batches) {
                batch.sessions = await mongoose.model("Session").find({ batch: batch._id }).lean();
            }

            classObj.batches = batches;
        }

        res.json({ success: true, data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllClasses = async (req, res) => {
    try {
        const classes = await mongoose.model("Master_class").find().lean();
        res.json({ success: true, data: classes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
