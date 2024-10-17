const express = require('express')
const videoCallRouter = express.Router();
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')


const { videoBasics, checkMeeting, joinButton, hasMeeting, meetingFeedback } = require('../Controller/videoCallController.js');



videoCallRouter.route("/initiate").post(validateToken, videoBasics);

// check if there is meeting or not [returns there is meeting or not]
videoCallRouter.route("/checkMeeting").get(validateToken, checkMeeting);

videoCallRouter.route("/join").post(validateToken, joinButton);

videoCallRouter.route("/TenMin").get(hasMeeting);

videoCallRouter.route("/feedback").post(validateToken, meetingFeedback);

module.exports = videoCallRouter;