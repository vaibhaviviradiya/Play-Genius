var express = require('express');
const { admin, admin_login } = require('../controller/adminController');
const { addcategory, viewcategory } = require('../controller/categoryController');
var router = express.Router();

/* GET users listing. */
router.post('/register',admin)
router.post('/login',admin_login)

router.post('/addcategory',addcategory)
router.get('/viewcategory',viewcategory)
module.exports = router;

//vaibhavi nu token
//"eyJhbGciOiJIUzI1NiJ9.Njg3ZjE1Njc1YjFmYTFmMjc5MzFjNzU4.u5AGsFrSjwS7cvpts52OyJYMqIYmgU4GAu-yZ5kEynw"