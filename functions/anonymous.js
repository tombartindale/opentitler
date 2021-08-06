const functions = require("firebase-functions");
const environment = functions.config();
const encryptionKey = environment.anonymous.encryption_key;
const encryptionSecret = environment.anonymous.encryption_secret;
const Cryptr = require("cryptr");
const cryptr = new Cryptr(encryptionSecret);
const admin = require("firebase-admin");
const db = admin.database();
const anonymousTokens = db.ref("anonymous/tokens");

// Generate anonymous signin link with encrypted tokens for co-hosts
exports.generateLink = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );

  const displayid = data.displayid;
  const userid = data.userid;
  if (!displayid || !userid)
    throw new functions.https.HttpsError(
      "invalid-argument",
      'The function must be called with two arguments "displayid" and "userid".'
    );

  const encryptedString = cryptr.encrypt(
    `${encryptionKey}|${displayid}|${userid}`
  );
  await anonymousTokens
    .child(`${userid}/${displayid}`)
    .set({ token: encryptedString });
  return encryptedString;
});

// Decrypt and validate the token
exports.decryptToken = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.uid)
    throw new functions.https.HttpsError(
      "failed-precondition",
      "The function must be called while authenticated."
    );

  if (!data.token)
    throw new functions.https.HttpsError(
      "invalid-argument",
      'The function must be called with one argument "token" containing the anonymous login details.'
    );

  // Get the token passed from the client
  const token = data.token;
  try {
    const decryptedString = cryptr.decrypt(token);
    const decryptedArr = decryptedString.split("|");
    // console.log(decryptedArr);
    if (decryptedArr[0] === encryptionKey) {
      const displayid = decryptedArr[1];
      const userid = decryptedArr[2];
      // console.log(displayid);
      // console.log(userid);
      // console.log(token);
      const tokenSnap = await anonymousTokens
        .child(`${userid}/${displayid}/token`)
        .once("value");
      if (tokenSnap.val() === token)
        return { displayid: displayid, userid: userid };
      else
        throw new functions.https.HttpsError(
          "invalid-token",
          "The token provided has expired."
        );
    } else {
      // console.error("encryption key does not match");
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The token provided is not a valid token containing the anonymous login details."
      );
    }
  } catch (error) {
    // console.error(error);
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The token provided is not a valid token containing the anonymous login details."
    );
  }
});
