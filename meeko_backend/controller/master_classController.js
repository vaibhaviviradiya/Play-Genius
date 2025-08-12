const jwt = require('jsonwebtoken');
const classesSchema = require('../model/classes');

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
            if (req.files['document']) {
                req.body.class_documents = req.files['document'].map(file => file.originalname);
            }
        }

               // Parse batches JSON
        if (req.body.batches) {
            try {
                req.body.batches = JSON.parse(req.body.batches);

                // Attach documents to batches if provided
                if (req.files['document']) {
                    req.body.batches.forEach((batch, index) => {
                        if (req.files['document'][index]) {
                            batch.document = req.files['document'][index].originalname;
                        }
                    });
                }

            } catch (err) {
                console.error("Error parsing batches:", err);
                return res.status(400).json({ message: 'Invalid batches format' });
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
