import firebase from 'firebase/app'
import 'firebase/database'


const config = {
  apiKey: 'AIzaSyDGEMPLVKAGGx1U_1GGvWGRvHRh8qzZm8A',
  authDomain: 'obstally.firebaseapp.com',
  databaseURL: 'https://opentally-titles.firebaseio.com',
  projectId: '611932210483',
  storageBucket: 'obstally.appspot.com'
};

export const db = firebase
  .initializeApp(config)
  .database();