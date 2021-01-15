import firebase from 'firebase/app';
import 'firebase/firestore';
import Peer from 'simple-peer';
import * as helper from './helper';

const collectionname: string =  "domRoom"
// firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBfoy7wT3avNhSSQePK4V09cyS-h33cbJ0",
    authDomain: "anticardgamecardgameclub.firebaseapp.com",
    projectId: "anticardgamecardgameclub",
    storageBucket: "anticardgamecardgameclub.appspot.com",
    messagingSenderId: "493065249415",
    appId: "1:493065249415:web:f5849d1ed56dab0e1c8e22",
    measurementId: "G-2H0YRN530Y"
}

//the list of stun/turn servers to use
const serverlist: RTCIceServer[] = [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'eXf5uqiGDie3QHU','username': 'fujizhang2525@gmail.com'}, {'urls': 'turn:192.158.29.39:3478?transport=udp','credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', 'username': '28224511:1379330808'}]

let roomId: string;
let user: string = "";

export function initdatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
      firebase.app(); // if already initialized, use that one
  }
  if (user == "") user = helper.generateUID();
  return user
}


export async function createRoom() {
  const db = firebase.firestore();
  // create room
  const roomRef =  db.collection(collectionname).doc();
  // create and send room
  const roomWithOffer = 
    {[user] :  ` i am: ${roomRef.id} owner ${user}`};
  await roomRef.set(roomWithOffer);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}  `);

  // listen for new connections
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data() as firebase.firestore.DocumentData;
    if (snapshot.exists) {
     console.log(data)
    }
   
  });

  return roomRef.id
}
interface peerConnectionData {
  [user: string] : string
}
export async function joinRoom(getRoomId: string) {
  const db = firebase.firestore();

  const roomRef = await db.collection(collectionname).doc(getRoomId);

  const roomWithOffer: peerConnectionData = {
      [user] :  ` i am: ${roomRef.id} client ${user}`
    
  };
  if (roomRef != null) {
    roomRef.set(roomWithOffer,{ merge: true })
    console.log(`Joined Room ${roomRef.id}`);
    
    // listen for new connections
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data() as firebase.firestore.DocumentData;
      if (snapshot.exists) {
          console.log(data)
        }
      });
    return true
  }
  return false
}

export async function onClose( getRoomId: string) {
  const db = firebase.firestore();

  const roomRef = db.collection(collectionname).doc(getRoomId)
  
  await roomRef.get().then(async function(doc) {
    if (doc.exists) {
      let roomSnapshotData = doc.data() as  firebase.firestore.DocumentData
        delete roomSnapshotData[user]; 
       await roomRef.set(roomSnapshotData);
       console.log(`Left Room ${roomId}`);

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  })


} 


