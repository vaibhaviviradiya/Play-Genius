var express = require('express');
const { parent_register, parent_login } = require('../controller/parentsController');
var multer = require('multer');
const { route } = require('.');
const { educator_register , educator_login} = require('../controller/educatorController');
const { create_course, get_courses } = require('../controller/coursesController');
const { get } = require('mongoose');
var router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })

router.post('/parentsregister',upload.single('child_image'),parent_register)
router.post('/parentslogin',parent_login);

router.post('/educatorregister', upload.single('profile_picture'), educator_register);
router.post('/educatorlogin', educator_login);

router.post('/createcourse', upload.single('course_image'),create_course);
router.get('/getcourses',get_courses);
module.exports = router;
