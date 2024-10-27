const mongoose = require("mongoose");

const doubt = mongoose.Schema(
  {
    // define role

    username: {
      type: String,
    },
    doubt: {
      type: String,
      required: [true, "Please enter your doubt"],
    },
    doubtDiscription: {
      type: String,
      required: [true, "Please express your doubt in some form"],
    },
    field: {
      type: [String],
      required: [true, "Please enter the field of expert you are seeking for"],
    },
    doubtPictures: {
      type: [String],
    },
    money: {
      min: {
        type: Number,
        min: 0, // Minimum value for min to ensure it's non-negative
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    time: {
      // testing left to be done [I was here]
      date: {
        type: Date,
      },
      ranges: [String],
      duration: {
        type: String,
      },
    },
    status: {
      type: String,
      default: "Doubt submitted",
      //Doubt submitted
      // Selected
      // Meeting Completed
    },
    finalMoney: {
      type: Number,
      default: 0,
    },
    finalTime: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const doubtSchema = mongoose.model("Doubt", doubt);

module.exports = { doubtSchema };
