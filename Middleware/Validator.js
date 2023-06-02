const mongoose = require("mongoose");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};
const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const isValidRequestBody = function (requestBody) {
  return Object.keys(requestBody).length > 0;
};

const validString = function (value) {
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const validateField = (fields, res) => {
  let valid = true;
  for (const key in fields) {
    if (Object.hasOwnProperty.call(fields, key)) {
      const element = fields[key];
      if (!isValid(element) && valid) {
        SendFail(res, key + " is required");
        valid = false;
      }
    }
  }
  return valid;
};

const validateMobile = (mobile, res) => {
  if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(mobile)) {
    res.status(400).send({
      status: false,
      message: "Phone number must be a valid a number.",
    });
    return false;
  } else {
    return true;
  }
};
const validateEmail = (email, res) => {
  var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
  const isCorrectEmailFormat = emailRegex.test(email);

  if (!isCorrectEmailFormat) {
    res
      .status(400)
      .send({ success: false, message: "Enter correct email address." });
    return false;
  } else {
    return true;
  }
};
const validatePassWord = (pass) => {
  let regex =
    /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).{8,16}$/;
  const matchIt = pass.match(regex);
  console.log(matchIt, "<<<<this is matchit");
  return matchIt;
};

const checkValidationFields = (fieldArray, bodyData, res) => {
  var isError = false;

  for (let index = 0; index < fieldArray.length; index++) {
    if (!isValid(bodyData[fieldArray[index]])) {
      isError = true;
      console.log(fieldArray[index], "<<< this is item");

      res.status(400).send({
        status: false,
        message: fieldArray[index] + " is required",
      });
      break;
    }
  }
  return isError;
  // if (isError) return null;
};

module.exports = {
  isValid,
  isValidObjectId,
  validateEmail,
  checkValidationFields,
  isValidRequestBody,
  validateMobile,
  validString,
  validateField,
  validatePassWord,
};
