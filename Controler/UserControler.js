const User = require("../Schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("../Middleware/Validator");
const { generateJWt } = require("../Middleware/Authentication");
const { validateMobile, validateEmail } = require("../Middleware/Validator");
const { SendFail } = require("../Middleware/Response");
const { default: mongoose } = require("mongoose");

// /****************************************************************Get User Data********************************************/

const getUserDetails = async function (req, res) {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    let readyToTravel = false;
    let travelTo = "";
    let findUserDetails = [];
    console.log(req.query);
    if (req.query.readyToTravel) readyToTravel = req.query.readyToTravel;
    if (req.query.travelTo) travelTo = req.query.travelTo;
    if (req.query.lat && req.query.long) {
      console.log(req.query);
      let location = [parseFloat(req.query.long), parseFloat(req.query.lat)];
      findUserDetails = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: location },
            distanceField: "dist.calculated",
            includeLocs: "dist.location",
            spherical: true,
            key: "location",
            //  maxDistance: 1000,
          },
        },
        {
          $match: {
            readyToTravel: readyToTravel == "true" ? true : false,
            //     // travelTo: travelTo,
          },
        },
      ]);
    } else {
      findUserDetails = await User.find(req.query);
    }
    if (!findUserDetails) {
      return res
        .status(404)
        .send({ status: false, message: "User Not Found!!" });
    }

    if (findUserDetails.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Data not found",
        // data: findUserDetails,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Profile Fetched Successfully!!",
      data: findUserDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};
const findNearBy = async function (req, res) {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    let readyToTravel = false;
    let travelTo = "";
    let findUserDetails = [];
    // if (!req.query?.nearByUsers)
    //   return SendFail(res, "nearbyUsers is required");
    console.log(req.query);
    if (req.query.readyToTravel) readyToTravel = req.query.readyToTravel;
    if (req.query.travelTo) travelTo = req.query.travelTo;
    let nearByUsers = req.query.nearByUsers;
    if (req.query.lat && req.query.long) {
      console.log(req.query);
      let location = [parseFloat(req.query.long), parseFloat(req.query.lat)];
      let destination = [
        parseFloat(req.query.d_long),
        parseFloat(req.query.d_lat),
      ];
      findUserDetails = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: location },
            distanceField: "dist.calculated",
            includeLocs: "dist.location",
            spherical: true,
            key: "location",
            //  maxDistance: 1000,
          },
        },

        {
          $match: {
            readyToTravel: true,
            // _id: { $in: arrayOfIds },
            //     // travelTo: travelTo,
          },
        },
      ]);
    } else {
      findUserDetails = await User.find(req.query);
    }
    if (!findUserDetails) {
      return res
        .status(404)
        .send({ status: false, message: "User Not Found!!" });
    }

    if (findUserDetails.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Data not found",
        // data: findUserDetails,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Profile Fetched Successfully!!",
      data: findUserDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};
const findAutoMate = async function (req, res) {
  try {
    const userId = req.params.userId;
    const userIdFromToken = req.userId;
    let readyToTravel = false;
    let travelTo = "";
    let findUserDetails = [];
    console.log(req.query.nearByUsers, "<<<<thisisnearbyusers");
    if (!req.query?.nearByUsers)
      return SendFail(res, "nearbyUsers is required");

    let convertNearByToObject = JSON.parse(req.query.nearByUsers).map((item) =>
      mongoose.Types.ObjectId(item)
    );

    console.log(req.query);
    if (req.query.readyToTravel) readyToTravel = req.query.readyToTravel;
    if (req.query.travelTo) travelTo = req.query.travelTo;

    if (req.query.d_lat && req.query.d_long) {
      console.log(req.query);
      // let location = [parseFloat(req.query.long), parseFloat(req.query.lat)];d
      let destination = [
        parseFloat(req.query.d_long),
        parseFloat(req.query.d_lat),
      ];
      findUserDetails = await User.aggregate([
        {
          $geoNear: {
            near: { type: "Point", coordinates: destination },
            distanceField: "dist.calculated",
            includeLocs: "dist.location",
            spherical: true,
            key: "destination",
            //  maxDistance: 1000,
          },
        },

        {
          $match: {
            readyToTravel: true,
            _id: {
              $in: convertNearByToObject,
            },
            // fullName: {
            //   $in: ["aadarsh", "shubham"],
            // },
            //     // travelTo: travelTo,
          },
        },
      ]);
    } else {
      findUserDetails = await User.find(req.query);
    }
    if (!findUserDetails) {
      return SendFail(res, "Data not found", findUserDetails);
    }

    if (findUserDetails.length == 0) {
      return res.status(200).send({
        status: false,
        message: "Data not found",
        // data: findUserDetails,
      });
    }

    return res.status(200).send({
      status: true,
      message: "Profile Fetched Successfully!!",
      data: findUserDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

// /************************************************************Update User Details*********************************************/

const updateUserDetails = async function (req, res) {
  try {
    let userDetails = req.body;
    let userId = req.params.id;
    // const uploadedFile = req.files.avatar[0];

    if (!validator.isValidObjectId(userId)) {
      return res.status(400).send({ status: false, message: "Invalid UserId" });
    }
    // console.log(req.files.avatar);

    if (userDetails?.password) {
      delete userDetails.password;
    }
    if (userDetails._id) {
      delete userDetails._id;
    }

    if (userDetails.emailId) {
      const checkUserEmail = await User.find({
        emailId: userDetails.emailId,
      });
      console.log(checkUserEmail);
      if (checkUserEmail.length) {
        res.status(400).send({
          message: "User already exist with this email.",
          status: false,
        });
        return null;
      }
    }

    if (req.files.avatar) {
      userDetails.avatar = req.files.avatar[0].filename;
    }
    if (req.body.lat && req.body.long) {
      userDetails.location = {
        type: "Point",
        coordinates: [parseFloat(req.body.long), parseFloat(req.body.lat)],
      };
    }
    if (req.body.d_lat && req.body.d_long) {
      userDetails.destination = {
        type: "Point",
        coordinates: [parseFloat(req.body.d_long), parseFloat(req.body.d_lat)],
      };
    }
    console.log(userDetails, "<<<this is userDetais");
    let updateProfileDetails = await User.findOneAndUpdate(
      { _id: userId },
      userDetails,
      { new: true }
    );

    return res.status(200).send({
      status: true,
      msg: "User Update Successful!!",
      data: updateProfileDetails,
    });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  if (!validator.isValidObjectId(userId)) {
    return res.status(400).send({ status: false, message: "Invalid UserId" });
  }
  const deleteIt = await User.findByIdAndDelete(userId);
  return res.status(200).send({ message: "User successfully deleted" });
};

const forgetPass = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    res.status(200).send({
      success: true,
      body: { ...req.body },
      mesage: "Passowrd changes",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ success: false, message: e.message });
  }
};

module.exports = {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  findAutoMate,
  forgetPass,
  findNearBy,
};

// module.exports = { createUser, userLogin, getUserDetails, updateUserDetails }
