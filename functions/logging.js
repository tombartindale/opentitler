const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.database();
const logref = db.ref("logs");

exports.logChange = functions.database
  .instance("opentally-titles")
  .ref("/displays/{uid}/{displayid}/title")
  .onWrite(async (change, context) => {
    const event = { ...change.after.val() };
    event.type = "title";
    event.timestamp = firebase.database.ServerValue.TIMESTAMP;
    await logref
      .child(context.params.uid)
      .child(context.params.displayid)
      .set(event);
  });
