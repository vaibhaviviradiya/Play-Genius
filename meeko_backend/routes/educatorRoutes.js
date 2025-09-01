var express = require('express');

var multer = require('multer');

const { get } = require('mongoose');
const { create_class,create_batch,create_session,getClassDetails} = require('../controller/master_classController');
const livesession = require('../model/livesession');
const { createLiveSession } = require('../controller/livesessionCotroller');
var router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image')) {
      cb(null, './public/images');
    } else if (file.mimetype.startsWith('video')) {
      cb(null, './public/videos');
    } else if (file.mimetype === 'application/pdf') {
      cb(null, './public/documents'); // or wherever you want PDFs
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage, limits: { fileSize: 200 * 1024 * 1024 } }) //200mb

// router.post('/parentsregister',upload.single('child_image'),parent_register)
router.post('/createclass', upload.fields([
  { name: 'class_images', maxCount: 5 },
  { name: 'class_documents', maxCount: 5 },
  { name: 'class_videos', maxCount: 3 },
  { name: 'class_certificate', maxCount: 1 }
]), create_class)

router.post('/createbatch', upload.fields([{ name: 'documents', maxCount: 3 }]), create_batch);

router.post('/createsession', upload.none(), create_session);

router.get('/getclass/:id', getClassDetails);

router.post('/createlivesession', createLiveSession)
module.exports = router;
