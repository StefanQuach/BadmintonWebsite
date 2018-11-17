import firebase from 'firebase/app';
import 'firebase/auth';

const config = {
    apiKey: "AIzaSyDvaCGbxhN2Wxwha63CEmA63awOWKHBXiU",
    authDomain: "badminton-87565.firebaseapp.com",
    databaseURL: "https://badminton-87565.firebaseio.com",
    projectId: "badminton-87565",
    storageBucket: "badminton-87565.appspot.com",
    messagingSenderId: "373787186501"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const auth = firebase.auth();

export {
  auth,
};

export default firebase;
