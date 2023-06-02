const mongoose = require("mongoose");
const userdata = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
      trim: true,
    },

    mobile: {
      type: Number,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      // require: true,
      // unique: true,
      match:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },

    inviteCode: {
      type: String,
      required: true,
    },

    usedInviteCode: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      require: true,
      enum: ["user", "admin"],
    },

    password: {
      type: String,
      // require: true,
    },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE"],
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    readyToTravel: {
      type: Boolean,
      default: false,
    },
    travelTo: {
      type: String,
      default: "",
    },
    location: {
      type: {
        type: String,
        default: "Point",
      },
      // coordinates: { type: [Number] },
      coordinates: [],
    },
    destination: {
      type: {
        type: String,
        default: "Point",
      },
      // coordinates: { type: [Number] },
      coordinates: [],
    },
  },

  { timestamps: true }
);
userdata.index({ location: "2dsphere" });
userdata.index({ destination: "2dsphere" });

// userdata.index({ location_1: "2dsphere" });
module.exports = new mongoose.model("user", userdata);
