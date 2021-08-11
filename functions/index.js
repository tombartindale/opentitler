const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: "https://opentally-titles.firebaseio.com",
});

const anonymous = require("./anonymous");
const logging = require("./logging");

exports.decryptToken = anonymous.decryptToken;
exports.generateLink = anonymous.generateLink;
exports.titleChange = logging.titleChange;
exports.controlChange = logging.controlChange;
exports.peopleChange = logging.peopleChange;
exports.tickerChange = logging.tickerChange;
