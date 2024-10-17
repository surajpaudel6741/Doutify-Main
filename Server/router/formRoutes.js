const express = require('express')
const formrouter = express.Router();
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')

const {doubtSchema }= require('../models/formModules')

const { userdoubt, notifications,doubtRequest, bellclick, finalTimenPrice,selectExpert} = require('../Controller/formController');





const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/formuploads');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);   //needs to change [unique way of varifying]
    }
});
const uploadfiles = multer({ storage: storage });

formrouter.route("/doubt").post(validateToken,uploadfiles.fields([{ name: 'doubtPictures', maxCount: 5 }]),userdoubt);



//       /user/notification route              [<--- Confusion can be caused]
formrouter.route("/notifications").get(validateToken,notifications); // for getting users notifications
// I tried using sessions in here

formrouter.route("/doubtRequest").get(validateToken, doubtRequest); // to get the clicked notification details

formrouter.route("/bellclicked").get(validateToken, bellclick);

formrouter.route("/notification/finalTimenPrice").post(validateToken, finalTimenPrice); // just added

formrouter.route("/notification/selectExpert").post(validateToken, selectExpert); // just added    

module.exports = formrouter;