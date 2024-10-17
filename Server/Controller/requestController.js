// note: If you are seeing this in github, requestcontroller is just being initiated, its just template, not data


const { doubtSchema } = require('../models/formModules')
const { expertschema, userschema } = require('../models/userModule')
const asyncHandler = require("express-async-handler")
const session = require('express-session');


/* @desc Get the user description -------------------------------- get/put UserProfile ----------------------------*/

// @route /request/userInfo
// request: get
// @access private
const getUserInfo = asyncHandler(async (req, res) => {
    try {
        const decodedInfo = req.user.decoded;
        username = decodedInfo.user.username;  // if there is username undefined, its coz you didnot proceed with login and stuff correctly
        console.log(username);
        const user = await userschema.findOne({ username })
        delete user.notifications;
        if (user) {
            res.send(user)
            console.log(user)
        } else
            res.send("user not valid / user not logged in")
    } catch (e) {
        console.log("[E] Error while fatching user information", e)
        res.status(500).send("An error occurred while fatching user information");
    }
})


// @route /request/userInfo
// request: put
// @access private
const putUserInfo = asyncHandler(async (req, res) => {
    try {
        const decodedInfo = req.user.decoded;
        const username = decodedInfo.user.username;  // if there is username undefined, its coz you didnot proceed with login and stuff correctly

        const user = await userschema.findOne({ username })
        console.log("Request body:", req.body)
        if (user) {
            const x = await userschema.findOneAndUpdate(
                { username },
                { $set: req.body },
                { new: true, runValidators: true }
            );
            console.log(x)
            const updatedUser = await userschema.findOne({ username });
            console.log("Database has been updated,", updatedUser);
            res.status(202).send("Database is been updated")
        } else
            res.status(404).send("user not valid / user not logged in")
    } catch (e) {
        console.log("[E] Error while fetching user information", e)
        res.status(500).send("An error occurred while fetching user information");
    }
})


/* @desc Get the expert description -------------------------------- get/put expert ----------------------------*/
// @route /request/expertInfo
// request: get
// @access private
const getExpertInfo = asyncHandler(async (req, res) => {
    try {
        const decodedInfo = req.user.decoded;
        username = decodedInfo.user.username;
        console.log(username);
        const expert = await expertschema.findOne({ username })
        delete expert.notifications;
        if (expert) {
            res.send(expert)
            console.log(expert)
        } else
            res.send("You have not signed as expert yet")

    } catch (e) {
        console.log("[E] Error while fatching expert's information", e)
        res.status(500).send("An error occurred while fatching expert information");
    }
})


// @route /request/expertInfo
// request: put
// @access private
const putExpertInfo = asyncHandler(async (req, res) => {
    try {
        const decodedInfo = req.user.decoded;
        const username = decodedInfo.user.username;

        const expert = await expertschema.findOne({ username })
        console.log("The expert info ::", expert)
        if (expert) {
            const updatedexpert = await expertschema.findOneAndUpdate(
                { username },
                { $set: req.body },
                { new: true, runValidators: true }
            );
            console.log(updatedexpert)
            console.log("Database has been updated,", updatedexpert);
            res.status(202).send("Database is been updated")
        } else
            res.status(404).send("expert not valid / expert not logged in")
    } catch (e) {
        console.log("[E] Error while fetching expert information", e)
        res.status(500).send("An error occurred while fetching expert information");
    }
})



/* @desc get all the doubts user had done till now --------------------------------Doubt History and change specific doubt ----------------------------*/
// request: get
// @route /request/doubtHistory
// @access private
const getDoubtList = asyncHandler(async (req, res) => { // before this, there should be a request to send all doubts done by user
    try {
        const decodedInfo = req.user.decoded;
        const username = decodedInfo.user.username;

        const doubts = await doubtSchema.find({ username })
        if (!doubts) {
            res.status(404).send("You have not given any doubt")
            console.log("No doubt for this user")
        }
        else {
            console.log("The doubts::", doubts)
            res.status(202).send(doubts)
        }

    } catch (e) {
        console.log("[E] Error while fetching the user's doubt history", e)
        res.status(500).send("An error occurred while fetching user's doubt history");
    }
})



// request: put
// @route /request/changeDoubtInfo
// @access private
const putDoubtInfo = asyncHandler(async (req, res) => { // before this, there should be a request to send all doubts done by user
    try {
        const decodedInfo = req.user.decoded;
        const username = decodedInfo.user.username;
        const doubtId = req.query.doubtId;

        console.log("doubt id: ",doubtId)
        const doubt = await doubtSchema.findOne({ _id:doubtId })
        if (!doubt) {
            res.status(404).send("Doubt Id invalid")
            console.log("Doubt Id invalid")
        }
        else {
            console.log("The doubt::", doubt)
            const updatedDoubt = await doubtSchema.findOneAndUpdate(
                { _id: doubtId },
                { $set: req.body },
                { new: true, runValidators: true }
            );
            console.log(updatedDoubt)
            console.log("Database has been updated,", updatedDoubt);
            res.status(202).send("Database is been updated")
        }

    } catch (e) {
        console.log("[E] Error while changing doubt ", e)
        res.status(500).send("An error occurred while changing Doubt");
    }
})




/* @desc get all previous meetings that happened with expert -------------------------------- previous meetings ----------------------------*/
// request: get
// @route /request/expert/meetingHistory
// @access private
const getExpertMeetings = asyncHandler(async (req, res) => { 
    try {
        const decodedInfo = req.user.decoded;
        const username = decodedInfo.user.username;

        const expert = await expertschema.findOne({ username });
        if (!expert) {
            res.status(404).send("You are not the expert");
            console.log("User is not the expert");
            return; // [Added] Return to exit the function
        }

        const meetings = expert.meetings;
        // for (let i = 0; i < meetings.length; i++) {
        //     const doubtId = meetings[i].doubtId;
        //     const doubt = await doubtSchema.findOne({ _id: doubtId });
        //     if (doubt) { // [Added] Check if doubt exists
        //         console.log("Doubt Found:", doubt);
        //         const status = doubt.status;
        //         console.log("Value of status is:", status);
        //         meetings[i].status = status;
        //         console.log("Meeting after the status is added:", meetings[i]);
        //     } else {
        //         console.log(`Doubt with ID ${doubtId} not found`);
        //     }
        // }

        console.log("Meetings are:", meetings);
        res.status(202).send(meetings);
    } catch (e) {
        console.log("[E] Error while fetching the expert's meeting history", e);
        res.status(500).send("An error occurred while fetching expert's meeting history");
    }
});





//   ------------------------------------- Demand ---------------------

/* @desc get all previous meetings that happened with expert -------------------------------- previous meetings ----------------------------*/
// request: get
// @route /request/userexists
// @access public
const userexists = asyncHandler(async (req, res) => {
    const { username } = req.body;
  
    try {
      const user = await userschema.findOne({ username });
  
      if (user) {
        res.status(200).json(true); // Send true if user exists
      } else {
        res.status(404).json(false); // Send false if user does not exist
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

module.exports = { getUserInfo, putUserInfo, getExpertInfo, putExpertInfo, getDoubtList, putDoubtInfo, getExpertMeetings , userexists}