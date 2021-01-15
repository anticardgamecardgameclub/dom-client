import firebase from 'firebase/app';
import 'firebase/firestore';
import SimplePeer from 'simple-peer';
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


interface peerConnection{
  [user: string] : peerConnectionData
}

interface peerConnectionData {
  name: string,
  signal: {
    [user: string]: string

  }
}
interface PeerList {
  [user: string]: SimplePeer.Instance
}

//the list of stun/turn servers to use
const serverlist: RTCIceServer[] = [{'urls': 'stun:stun.services.mozilla.com'}, {'urls': 'stun:stun.l.google.com:19302'}, {'urls': 'turn:numb.viagenie.ca','credential': 'eXf5uqiGDie3QHU','username': 'fujizhang2525@gmail.com'}, {'urls': 'turn:192.158.29.39:3478?transport=udp','credential': 'JZEOEt2V3Qb0y27GRntt2u2PAYA=', 'username': '28224511:1379330808'}]
let PeerList: PeerList = {};

let roomId: string;

//user id
let user: string = "";

/**
 * 
 */
export function initdatabase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // if already initialized, use that one
  }
  PeerList = {};
  if (user == "") user = helper.generateUID();
  return user
}

/**
 * 
 */
export async function createRoom(messageOut: (n: string)=> void) {
  // create room
  const db = firebase.firestore();

  const roomRef =  db.collection(collectionname).doc();
  // create and send room
  const localPeerData: peerConnection = {
    [user]: {
      name: "bruh",
      signal: {}
    }
  
  }; 
  // add user to room 
  await roomRef.set(localPeerData);
  roomId = roomRef.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRef.id}  `);

  // listen for new connections, and send signal data to each
  roomRef.onSnapshot(async snapshot => {
    const data = snapshot.data() as firebase.firestore.DocumentData;
    if (snapshot.exists) {
      receivePeer(data, roomRef, messageOut)
    }
   
  });

  return roomRef.id
}

/**
 * 
 * @param getRoomId 
 */
export async function joinRoom(getRoomId: string, messageOut: (n: string)=> void) {
  const db = firebase.firestore();

  const roomRef = await db.collection(collectionname).doc(getRoomId);

  const localPeerData: peerConnection = {
      [user]: {
        name: "bruh",
        signal: {}
      }
  };

  if (roomRef != null) {
    
    // add user to room 
    await roomRef.set(localPeerData,{ merge: true })
    console.log(`Joined Room ${roomRef.id}`);
    
    // send connection request to each user in room
    roomRef.get().then(function(snapshot){
      let data = snapshot.data() as firebase.firestore.DocumentData ;
      for (const [key, value] of Object.entries(data)) {
        if (key !== user  && key != user) {
          let peer = new SimplePeer({
            initiator: true,
            config: {
              iceServers: serverlist
            },
          })
  
          peer.on('error', err => {
            console.log(err)
          })
          console.log()
          peer.on('signal', signalData => {
            value.signal[user] = JSON.stringify(signalData);
            console.log(value)

            roomRef.set(data,{ merge: true })
          })
          PeerList[key] = peer;
        }

      }
     
    });
    
    // listen for new connections
    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data() as firebase.firestore.DocumentData;
      if (snapshot.exists) {
       
        receivePeer(data, roomRef, messageOut)
       
        }
      });
    return true
  }
  return false
}

function receivePeer(data: peerConnection, roomRef: firebase.firestore.DocumentReference<firebase.firestore.DocumentData>, messageOut: (n: string)=> void) {
  console.log(data)

  for (const [key, value] of Object.entries(data[user].signal)) {
    if (key != user) {
      if (!(key in PeerList)) {
        PeerList[key] = new SimplePeer({
          initiator: false,
          config: {
            iceServers: serverlist
          },
        })

        PeerList[key].on('error', err => {
          console.log(err)
        })

        PeerList[key].on('signal', signalData => {
          data[key].signal[user] = JSON.stringify(signalData);
          roomRef.set( data,{ merge: true })
        })
         
      }

      PeerList[key].signal(data[user].signal[key])
      PeerList[key].on('connect', () => {
        PeerList[key].send(`hey im ${user}, how is it going?`)
      })
      
      PeerList[key].on('data', data => {
        // got a data channel message
        messageOut(data)
        console.log('got a message from peer1: ' + data)
      })
    }
  }
}
/**
 * 
 * @param getRoomId 
 */
export async function onClose( getRoomId: string) {
  const db = firebase.firestore();

  const roomRef = db.collection(collectionname).doc(getRoomId)
  
  await roomRef.get().then(async function(snapshot) {
    if (snapshot.exists) {
      let roomSnapshotData = snapshot.data() as  firebase.firestore.DocumentData
        delete roomSnapshotData[user]; 
       await roomRef.set(roomSnapshotData);
       console.log(`Left Room ${roomId}`);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
  })


} 


function bindEvents(peer: SimplePeer.Instance,) {
 

}