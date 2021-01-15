import firebase from 'firebase/app';
import 'firebase/firestore';
import Peer from 'simple-peer';


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

let roomId;
let user:string = "";

export function initdatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }else {
      firebase.app(); // if already initialized, use that one
  }
  if (user == "")  user = generateUID();
  return user
}


export async function createRoom() {
  const db = firebase.firestore();
  // create room
  const roomRef =  db.collection('rooms').doc();
  // create and send room
  const roomWithOffer = {peerlist: [ 
    {[user] :  ` i am: ${roomRef.id} owner ${user}`}
  ]};
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



export async function joinRoom(getRoomId: string) {
  const db = firebase.firestore();

  const roomRef = await db.collection('rooms').doc(getRoomId);

  const roomWithOffer = {
      [user] :  ` i am: ${roomRef.id} client ${user}`
    
  };
  if (roomRef != null) {
    await roomRef.get().then(async function(doc) {
      if (doc.exists) {
        console.log("Document data:", doc.data());
         let roomSnapshotData = doc.data() as  firebase.firestore.DocumentData
         roomSnapshotData.peerlist.push(roomWithOffer)
         await roomRef.set(roomSnapshotData);

      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
    })

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

function generateUID() {
  // I generate the UID from two parts here 
  // to ensure the random number provide enough bits.
  var firstPart:any = (Math.random() * 46656) | 0;
  var secondPart:any = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3) ;
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}


export async function onClose( getRoomId: string) {
  const db = firebase.firestore();

  const roomref = db.collection('rooms').doc(getRoomId)
  await roomref.update({
    [user]: firebase.firestore.FieldValue.delete()
  });

  roomref.get().then(function(doc){
    if (doc.exists) {
      console.log("Document data:", doc.data());
      const data = doc.data() as  firebase.firestore.DocumentData
      if (doc.data.length == 0) {
        roomref.delete().then(function() {
          console.log("Document successfully deleted!");
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
      }

  } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
  }
    
  })

} 