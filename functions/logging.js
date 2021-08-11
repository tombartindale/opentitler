const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.database();
const logref = db.ref("logs");

async function logChange(change, context, type) {
  const event = { ...change.after.val() };
  event.type = type;
  event.timestamp = admin.database.ServerValue.TIMESTAMP;
  await logref
    .child(context.params.uid)
    .child(context.params.displayid)
    .push(event);
}

exports.titleChange = functions.database
  .instance("opentally-titles")
  .ref("/displays/{uid}/{displayid}/title")
  .onWrite(async (change, context) => {
    await logChange(change, context, "title");
  });

exports.controlChange = functions.database
  .instance("opentally-titles")
  .ref("/displays/{uid}/{displayid}/control")
  .onWrite(async (change, context) => {
    await logChange(change, context, "control");
  });

exports.peopleChange = functions.database
  .instance("opentally-titles")
  .ref("/displays/{uid}/{displayid}/people")
  .onWrite(async (change, context) => {
    await logChange(change, context, "people");
  });

exports.tickerChange = functions.database
  .instance("opentally-titles")
  .ref("/displays/{uid}/{displayid}/ticker")
  .onWrite(async (change, context) => {
    await logChange(change, context, "ticker");
  });
