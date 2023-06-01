const express = require("express");
const router = express.Router();

const multer = require("multer");
const {
  getUserDetails,
  updateUserDetails,
  deleteUser,
  findAutoMate,
  findNearBy,
} = require("../Controler/UserControler");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

router.get("/get", getUserDetails);
router.get("/automate", findAutoMate);
router.get("/nearBy", findNearBy);
router.put(
  "/update/:id",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  updateUserDetails
);
router.delete("/delete/:id", upload.none(), deleteUser);
// router.post("/sendotp", upload.none(), SendOtp);
// router.post("/verifyotp", upload.none(), verify);
// router.post("/change-pass", upload.none(), forgotPassword);

// app.get("/user/:userId",userAuthentication,getUserDetails)

module.exports = router;
