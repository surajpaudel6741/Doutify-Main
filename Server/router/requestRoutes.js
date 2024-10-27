const express = require("express");
const requestrouter = express.Router();
const validateToken = require("../middleware/tokenValidation");

const {
  getUserInfo,
  putUserInfo,
  getExpertInfo,
  putExpertInfo,
  getDoubtList,
  putDoubtInfo,
  getExpertMeetings,
  userexists,
  expertexists,
  biddedList
} = require("../Controller/requestController");

requestrouter.route("/userInfo").get(validateToken, getUserInfo);
requestrouter.route("/userInfo").put(validateToken, putUserInfo); // remember it is put operation

requestrouter.route("/expertInfo").get(validateToken, getExpertInfo);
requestrouter.route("/expertInfo").put(validateToken, putExpertInfo); // note, the photos and all are not implemented yet

requestrouter.route("/doubtHistory").get(validateToken, getDoubtList); // get Doubt list // doubthistory
requestrouter.route("/doubtInfo").put(validateToken, putDoubtInfo);

requestrouter
  .route("/expert/meetingHistory")
  .get(validateToken, getExpertMeetings); // get Doubt list // doubthistory

requestrouter.route("/userexists").get(userexists); // get Doubt list // doubthistory
requestrouter.route("/expertexists").get(validateToken, expertexists); // get Doubt list // doubthistory

requestrouter.route("/biddedlist").post(validateToken, biddedList); // get Doubt list // doubthistory

module.exports = requestrouter;
