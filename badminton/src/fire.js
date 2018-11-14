import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyDvaCGbxhN2Wxwha63CEmA63awOWKHBXiU",
    authDomain: "badminton-87565.firebaseapp.com",
    databaseURL: "https://badminton-87565.firebaseio.com",
    projectId: "badminton-87565",
    storageBucket: "badminton-87565.appspot.com",
    messagingSenderId: "373787186501"
};
var fire = firebase.initializeApp(config);
export default fire;
