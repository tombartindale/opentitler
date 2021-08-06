const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: "https://opentally-titles.firebaseio.com",
});

const anonymous = require("./anonymous");
const logging = require("./logging");

exports.decryptToken = anonymous.decryptToken;
exports.generateLink = anonymous.generateLink;
exports.logChange = logging.logChange;
