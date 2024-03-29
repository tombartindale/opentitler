import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/functions";

const config = {
  appId: "obstally",
  apiKey: "AIzaSyDGEMPLVKAGGx1U_1GGvWGRvHRh8qzZm8A",
  authDomain: "obstally.firebaseapp.com",
  databaseURL: "https://opentally-titles.firebaseio.com",
  projectId: "obstally",
  storageBucket: "obstally.appspot.com",
};

const fbapp = firebase.initializeApp(config);

const auth = firebase.auth();

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        unsubscribe();
        resolve(user);
      } else resolve(null);
    }, reject);
  });
};

export const db = fbapp.database();
// export {Timestamp} = firebase.firestore;
