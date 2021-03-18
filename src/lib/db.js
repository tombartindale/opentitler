import firebase from 'firebase/app'
import "firebase/auth";
import 'firebase/database';
import 'firebase/functions';

const config = {
  appId:'',
  apiKey: 'AIzaSyDGEMPLVKAGGx1U_1GGvWGRvHRh8qzZm8A',
  authDomain: 'obstally.firebaseapp.com',
  databaseURL: 'https://opentally-titles.firebaseio.com',
  projectId: '611932210483',
  storageBucket: 'obstally.appspot.com'
};

export const db = firebase
  .initializeApp(config)
  .database();

// const config2 = {
//   name:'zoom',
//   apiKey: 'AIzaSyAzlJsBb_xz0p9bd9caHr_79tagYnFU77A',
//   authDomain: 'zoombot.firebaseapp.com',
//   databaseURL: 'https://zoombot.firebaseio.com',
//   projectId: 'zoombot',
//   appId: "1:578675125264:web:27a74a7ee45f0ca7b6ee95"
// };



// let zsff = firebase.initializeApp(config2,"zoomsense");

// export const zs = zsff.database();
// export const auth = zsff.auth();
// export const functions = zsff.functions();