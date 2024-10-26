const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    // define role
    fullname: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    username: {
      type: String,
      required: [true, "Please enter your UserName"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your Password"],
    },
    profilePhoto: { type: String },
    
    role: {
      type: [String],
      default: ["user"],
    },
    notifications: [
      {
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    meetings: [
      {
        ongoing: {
          type: Boolean,
          default: true, // It is created to check if the meeting is finished or not
        },
        role: {
          type: String,
          // Learner
          //Expert
        },
        doubtId: {
          type: String,
        },
        rating: {
          type: Number,
          default: 0,
          min: 0,
          max: 7,
        },
        comment: {
          type: String,
          default: "They didnot provided any review :(",
        },
      },
    ],
    lastState: {
      type: String,
      default: "learner",
      //expert
    },
  },
  {
    timestamps: true,
  }
);

const expertSchema = mongoose.Schema(
  {
    username: {
      type: String,
    },
    title: {
      type: String,
      required: [true],
    },
    description: {
      type: String,
      required: [true],
    },
    jobtitle: {
      type: String,
    },
    expertise: {
      //  array
      type: [String],
      required: [true],
    },
    resume: {
      type: String,
    },
    proof: {
      //  array
      type: [String],
      required: [true],
    },
    library: {
      //  array
      type: [String],
    },
    links: [
      {
        urlname: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    notifications: [
      {
        message: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        read: {
          type: Boolean,
          default: false,
        },
      },
    ],
    meetings: [
      {
        ongoing: {
          type: Boolean,
          default: true, // It is created to check if the meeting is finished or not
        },
        role: {
          type: String,
          // learner
          //teacher
        },
        doubtId: {
          type: String,
        },
        rating: {
          type: Number,
          default: 0,
          min: 0,
          max: 7,
        },
        comment: {
          type: String,
          default: "They didnot provided any review :(",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
// export ma kaam garna baki xa
// give valid name to photoes n maybe password hashing using  [pre]

const userschema = mongoose.model("User", userSchema);
const expertschema = mongoose.model("Expert", expertSchema);

module.exports = { userschema, expertschema };
