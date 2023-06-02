// const firebase = require("firebase");

const { SendError } = require("./Response");
const { validateField } = require("./Validator");

// const admin = require("firebase-admin");
const firebaseConfig = {
  apiKey: "AIzaSyDnqxSfogkJRmOQVCEyFL76mkOhEJ71ZQQ",
  authDomain: "ink-cer.firebaseapp.com",
  projectId: "ink-cer",

  storageBucket: "ink-cer.appspot.com",
  messagingSenderId: "500843891832",
  appId: "1:500843891832:web:c57f51ff40f20709f2b18d",
  measurementId: "G-PKXYGL8JQK",
};

const client = require("twilio")(
  "ACa9bdd24b9b17d08383ccb4e69f2bb353",
  "25b4d91cf8b591a56a8ea75a04d98fc7"
);

const mobile = "+917415206625";

const SendOtp = async (req, res) => {
  try {
    let { mobile, otp } = req.body;
    let fields = { mobile, otp };
    if (!validateField(fields, res)) return null;
    client.messages
      .create({
        body: "Your Otp for Verification is: " + otp,
        to: "+91" + mobile, // Text your number
        from: "+13613104527", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (error) {
    SendError(res, error);
  }
};

module.exports = { SendOtp };
