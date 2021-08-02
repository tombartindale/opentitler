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

export const db = fbapp.database();
