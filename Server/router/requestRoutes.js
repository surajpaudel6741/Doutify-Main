const express = require('express')
const requestrouter = express.Router(); 
const path = require('path')
const multer = require('multer')
const validateToken = require('../middleware/tokenValidation')

const { getUserInfo, putUserInfo, getExpertInfo, putExpertInfo, getDoubtList, putDoubtInfo, getExpertMeetings, userexists } = require('../Controller/requestController');






requestrouter.route("/userInfo").get(validateToken, getUserInfo); 
requestrouter.route("/userInfo").put(validateToken, putUserInfo);  // remember it is put operation


requestrouter.route("/expertInfo").get(validateToken, getExpertInfo);
requestrouter.route("/expertInfo").put(validateToken, putExpertInfo); // note, the photoes and all are not implemented yet


requestrouter.route("/doubtHistory").get(validateToken, getDoubtList); // get Doubt list // doubthistory
requestrouter.route("/doubtInfo").put(validateToken, putDoubtInfo); 


requestrouter.route("/expert/meetingHistory").get(validateToken, getExpertMeetings); // get Doubt list // doubthistory




requestrouter.route("/userexists").get( userexists); // get Doubt list // doubthistory



module.exports = requestrouter;