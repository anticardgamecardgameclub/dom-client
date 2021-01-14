const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");

export const firebaseInit = () => {
    // Initialize Cloud Firestore through Firebase
    firebase.initializeApp({
        apiKey: "AIzaSyBfoy7wT3avNhSSQePK4V09cyS-h33cbJ0",
        authDomain: "anticardgamecardgameclub.firebaseapp.com",
        projectId: "anticardgamecardgameclub",
        storageBucket: "anticardgamecardgameclub.appspot.com",
        messagingSenderId: "493065249415",
        appId: "1:493065249415:web:f5849d1ed56dab0e1c8e22",
        measurementId: "G-2H0YRN530Y"
    });

    var servers = {'iceServers': [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'eXf5uqiGDie3QHU','username': 'fujizhang2525@gmail.com'}]};
    
    var db = firebase.firestore();
}


