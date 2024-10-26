const express = require('express')
const router = express.Router();
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')

const {userschema,expertschema }= require('../models/userModule')



const { home, signup,expsignup, login, toggle } = require('../Controller/userController');

// Routes -------------------------------------

router.route("/").get(validateToken, home);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);    //needs to change [unique way of varifying]
    }
});
const upload = multer({ storage: storage });

router.route("/signup").post(upload.single('photo'), signup);
// router.route("/signup").put(signup) 
// [] maile signup ko database role milai rathe


router.route("/signup/expert").post(validateToken,upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'proof', maxCount: 5 }, { name: 'library', maxCount: 100 }]), expsignup);

//toggle user and expert
router.route("/toggle").get(validateToken, toggle);


router.route("/login").post(login)


module.exports = router;