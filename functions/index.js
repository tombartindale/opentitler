const admin = require("firebase-admin");
admin.initializeApp({
  databaseURL: "https://opentally-titles.firebaseio.com",
});

const anonymous = require("./anonymous");

exports.decryptToken = anonymous.decryptToken;
exports.generateLink = anonymous.generateLink;
