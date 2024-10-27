const { doubtSchema } = require("../models/formModules");
const { expertschema, userschema } = require("../models/userModule");
const asyncHandler = require("express-async-handler");
const session = require("express-session");

// @desc doubt submition for expert       -------------------------------- Doubt submition ------------------------------
// @route http://localhost:8080/user/doubt
// @access private
const userdoubt = asyncHandler(async (req, res) => {
  let { doubt, doubtDescription, field, minMoney, maxMoney, duration } =
    req.body;
  console.log("duration :", duration);
  // Handle optional doubt pictures
  let doubtPictures = [];
  if (req.files && req.files["doubtPictures"]) {
    doubtPictures = req.files["doubtPictures"].map((file) => file.filename);
  }

  // Ensure required fields are present
  if (!doubt || !doubtDescription || !field) {
    res.status(400);
    throw new Error("[E] Please fill in all required fields in the form");
  }

  try {
    // Decode user info
    const { username } = req.user.decoded.user;

    // Ensure 'field' is an array and standardize the field names
    const fieldArray = Array.isArray(field) ? field : JSON.parse(field);
    const fields = fieldArray.map((f) => f.toLowerCase());

    // Create a new doubt entry
    const store = await doubtSchema.create({
      username,
      doubt,
      doubtDescription, // Fixed typo from 'doubtDescription' to 'doubtDescription'
      field: fields,
      doubtPictures,
      money: { min: minMoney, max: maxMoney },
      time: duration,
      status: "Doubt submitted",
    });

    console.log("Store is ", store);

    // Update user's meetings with new doubt reference
    const user = await userschema.findOne({ username });
    user.meetings.push({ role: "learner", doubtId: store._id });
    await user.save();
    console.log("User is ", user);

    // Find experts with matching expertise fields
    const skilledExperts = await expertschema.find({
      expertise: { $in: fields },
    });
    console.log("Skilled Experts are ", skilledExperts);

    let money = { min: minMoney, max: maxMoney };
    // Prepare notification message for experts
    const notificationMessage = JSON.stringify({
      message: "There is a doubt for you!",
      user: username,
      doubtId: store._id,
      doubt,
      doubtDescription,
      doubtPictures,
      money,
      postday: new Date().toISOString().split("T")[0], // day you posted the doubt
      duration,
      read: false,
    });
    const notification = {
      message: notificationMessage,
      read: false,
    };
    // Send notifications to matching experts
    await Promise.all(
      skilledExperts.map((expert) =>
        expertschema.updateOne(
          { username: expert.username },
          { $push: { notifications: notification } }
        )
      )
    );

    // Respond with success
    res.status(201).json({
      message: "Doubt submitted successfully",
      // data: store._id,
    });
  } catch (error) {
    console.log("error is ", error);
    res.status(500).json({
      message: `[E] There was an error in submitting the doubt: ${error.message}`,
    });
  }
});

// @desc request for notifications --------------------------- Get UNREAD notifications NUMBERS for bell icon  ----------------------------
// it is for expert to get notification on home page
// @route get : http://localhost:8080/user/notifications
// @access private
const notifications = asyncHandler(async (req, res) => {
  try {
    const decodedInfo = req.user.decoded;
    username = decodedInfo.user.username; // if there is username undefined, its coz you didnot proceed with login and stuff correctly
    ifExpert = decodedInfo.user.ifExpert;
    console.log(username);

    if (!ifExpert) {
      const user = await userschema.findOne({ username });
      if (user) {
        const unreadNotifications = user.notifications.filter(
          (notification) => !notification.read
        );
        if (unreadNotifications.length > 0) {
          console.log(unreadNotifications);
          res.status(202).send(unreadNotifications);
        } else {
          res.send("Sorry, no notifications");
        }
      } else res.send("username is invalid");
    } else {
      const expert = await expertschema.findOne({ username });
      if (expert) {
        const unreadNotifications = expert.notifications.filter(
          (notification) => !notification.read
        );
        if (unreadNotifications.length > 0) {
          console.log(unreadNotifications);
          res.status(202).send(unreadNotifications);
        } else {
          res.send("Sorry, no notifications");
        }
      } else res.send("expertname is invalid");
    }
  } catch (e) {
    console.log("[E] Error while fatching unread notifications", e);
    res.status(500).send("An error occurred while fetching notifications");
  }
});

// @desc Expert asks the doubt discription ----------------------------- Doubt description request ----------------------------
// @route get : http://localhost:8080/user/doubtRequest
// @access private
const doubtRequest = asyncHandler(async (req, res) => {
  try {
    // Access headers correctly
    const userUsername = req.body.username; // it is the username of user with doubt
    const userDoubtId = req.body.doubtId; // same here

    console.log(userUsername, userDoubtId);
    if (!userUsername || !userDoubtId) {
      console.log("Username and DoubtId should be submitted for getting doubt");
      return res.status(400).json({
        error: "Username and DoubtId should be submitted for getting doubt",
      });
    }

    const doubt = await doubtSchema.findOne({
      username: userUsername,
      _id: userDoubtId,
    });
    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }

    // Send the found doubt document
    res.status(200).json(doubt);
    console.log(doubt);
  } catch (e) {
    console.error(
      "[E] Error while fetching doubt notification at formcontroller",
      e
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// its Front-End
// const response = await fetch(`/notification?username=${username}&doubtId=${doubtId}`, {
//     method: 'GET'
// });

// @desc when bell is clicked --------------------------- Get UNREAD notifications NUMBERS for bell icon  ----------------------------
// it is required to make notifications status read when user/expert views the notification
// @route get : http://localhost:8080/user/bellclicked
// @access private
const bellclick = asyncHandler(async (req, res) => {
  try {
    const decodedInfo = req.user.decoded;
    username = decodedInfo.user.username;
    console.log(username);
    if (decodedInfo.user.ifExpert) {
      const expert = await expertschema.findOne({ username });
      if (expert) {
        const unreadNotifications = expert.notifications.filter(
          (notification) => !notification.read
        );
        unreadNotifications.forEach((notification) => {
          notification.read = true;
          expert.save;
        });
      }
      res.status(200).send({ message: `Expert notification updated` });
    } else {
      const user = await userschema.findOne({ username });
      if (user) {
        const unreadNotifications = user.notifications.filter(
          (notification) => !notification.read
        );
        unreadNotifications.forEach((notification) => {
          notification.read = true;
          user.save;
        });
      }
      res.status(200).send({ message: `Learner's notification updated` });
    }
  } catch (e) {
    console.log("[E] Error on bellclicked: ", e);
    res.status(500).send("[E] Error on bellclicked");
  }
});

// @desc Notification by expert to finalize price ----------------------------- final time Expert Dicision ----------------------------
// @route post : http://localhost:8080/user/notification/finalTimenPrice
// @access public
const finalTimenPrice = asyncHandler(async (req, res) => {
  // public route  done by the expert to finalize price
  try {
    // body: JSON.stringify({ doubtId, bidAmount, selectedDateTime })

    const {
      finalTime,
      finalPrice,
      doubtId,
    } = req.body; // username -> The one had a doubt
    // changed my mind and doing via body, we can inserting using post in js easily ...
    if (!finalTime || !finalPrice) {
      return res.status(400).json({
        error:
          "Final time, final price, username, and expert name must be provided",
      });
    }

    const decodedInfo = req.user.decoded;
    const expertname = decodedInfo.user.username;

    const doubt = await doubtSchema.findOne({ _id: doubtId });
    if (!doubt) {
      res.send({ error: "Doubt Id not found" });
      return;
    }
    const username = doubt.username;

    const userWithDoubt = await userschema.findOne({ username: username });
    console.log(userWithDoubt);

    let bidnotification = JSON.stringify({
      expertname,
      doubtId,
      finalTime,
      finalPrice
    });

    userWithDoubt.notifications.push({
      // message: `Expert ${expertname} has agreed to take meeting doubtId:${doubtId} at ${finalTime} for with RS${finalPrice}.`,
      message: bidnotification,
    });
    await userWithDoubt.save();

    if (!doubt) {
      return res.status(404).json({ error: "Doubt not found" });
    }
    if (doubt.status == "Doubt submitted")
      doubt.status = "Expert Options provided";
    await doubt.save();

    res.status(200).send("Request send to the user..");
  } catch (e) {
    console.log("[E] Error in finalNotification", e);
  }
});

// @desc User selects the expert from the bidded list -------------------------------- Expert selection by User ----------------------------
// @route post : http://localhost:8080/expert/notification/selected
// @access private
const selectExpert = asyncHandler(async (req, res) => {
  // public route
  try {
    const { expertname, finalPrice, finalTime, finalDuration, doubtId } =
      req.body;
    // changed my mind and doing via body, we can insert using post in js easily ...
    if (
      !expertname ||
      !finalPrice ||
      !finalTime ||
      !finalDuration ||
      !doubtId
    ) {
      console.log("[E] Data insufficient ... [Expert selection by User]");
      return res.status(404).json({ error: " Data insufficient" });
    }

    const expertPurposing = await expertschema.findOne({
      username: expertname,
    });
    if (!expertPurposing) {
      return res.status(404).json({ error: "Expert not found" });
    }

    const decodedInfo = req.user.decoded;
    const username = decodedInfo.user.username;
    console.log(finalPrice);
    // meeting id generation for zegoCloud
    const roomID =
      `room_${expertname.charAt(0)}` + Math.floor(Math.random() * 1000);

    const doubtDisc = await doubtSchema.findOne({ _id: doubtId }); // saving to DATABASE
    console.log(doubtDisc);
    doubtDisc.finalMoney = finalPrice;
    doubtDisc.finalTime = finalTime;
    await doubtDisc.save();

    expertPurposing.meetings.push({ role: "Expert", doubtId });

    expertPurposing.notifications.push({
      message: `[Conformed] Your meeting for DoubtID: ${doubtId} is conformed at ${finalTime} with Rs${finalPrice} with ${username} for ${finalDuration} hour.Your room ID: ${roomID} Dont be late !!`,
    });
    await expertPurposing.save();

    const user = await userschema.findOne({ username });
    user.meetings.push({ role: "Learner", doubtId });
    // const user=await userschema.findOne({username})
    // user.meetings.push({role:'learner', doubtId})
    //  [Its been done already while sending notification]

    user.notifications.push({
      message: `[Conformed] Your meeting for DoubtID: ${doubtId} is conformed at ${finalTime} with Rs${finalPrice} with ${username} for ${finalDuration} hour.Your room ID: ${roomID} Dont be late !!`,
    });
    await user.save();

    const doubt = await doubtSchema.findOne({ _id: doubtId });
    console.log(doubt);
    console.log(doubt.status);
    if (
      doubt.status == "Doubt submitted" ||
      doubt.status == "Expert Options provided"
    ) {
      doubt.status = `Expert Selected`;
      await doubt.save();
    }

    // res.status(200).json({ message: `For DoubtID: ${doubtId}, The meeting is conformed at ${finalTime} with Rs${finalPrice} for ${finalDuration} hour long with ${expertname} for final` })
    res.status(200).json({
      message: "The meeting has been confirmed.",
      doubtId: doubtId,
      finalTime: finalTime,
      finalPrice: finalPrice,
      finalDuration: finalDuration,
      expertName: expertname,
      roomID,
    });
  } catch (e) {
    console.log("[E] Error in finalNotification", e);
    res.status(500).json({ error: "An error occurred on formController." });
  }
});

module.exports = {
  userdoubt,
  notifications,
  doubtRequest,
  bellclick,
  finalTimenPrice,
  selectExpert,
};
