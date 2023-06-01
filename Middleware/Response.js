const SendError = (res, e) => {
  res.status(400).send({ success: false, error: e.message });
};

const SendSuccess = (res, message, data) => {
  res.status(200).send({ success: true, message: message, data });
};
const SendFail = (res, message, data) => {
  res.status(200).send({ success: false, message: message, data });
};

module.exports = { SendError, SendSuccess, SendFail };
