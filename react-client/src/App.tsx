import React , { useState, useEffect } from 'react';
import './App.css';
import * as FirebaseRTC from './firebaseRTC'

function App() {
  import('rust-wasm').then(({ add_two_ints, fib }) => {
      // off-loading computations to WASM
      const sumResult = add_two_ints(10, 20);
      const fibResult = fib(10);
      // updating our sumResult and fibResult values (declared below)
      setSum(sumResult);
      setFib(fibResult);
  });


   const [joinstate, setJoinState] = useState<string>("");
   const [roomId, setRoomId] = useState<string>("");
   const [message, setMessage] = useState<string[]>([]);
  
   const [sum, setSum] = useState<number>(0);
   const [fib, setFib] = useState<number>(0);

   const user = FirebaseRTC.initdatabase()

   async function createBtn() {
      var result = await FirebaseRTC.createRoom(messageOut);
      setJoinState(`created room ${result}`)
      setRoomId(result);
   }

   async function joinBtn() {
      if (roomId != "") {
      var result:boolean = await FirebaseRTC.joinRoom(roomId,messageOut);
      setJoinState(`joined room: ${result ? "success": "fail"}`)
      }
   
   }
   async function leaveBtn() {
      if (roomId != "") {
      FirebaseRTC.onClose(roomId)
      setJoinState(``)
      }
   
   }
   function messageOut(string:string) {
      setMessage([...message, string]);
   }
   useEffect(() => {
         console.log("on room id change")

         const onbeforeunloadFn = () => {
            console.log("ran delete")
            FirebaseRTC.onClose(roomId)
         }
         window.addEventListener('beforeunload', onbeforeunloadFn);

         return () => window.removeEventListener("beforeunload", onbeforeunloadFn);
     
   }, [roomId])

   return (
      // Displaying our sum and fib values that're updated by WASM
      <div className="App" >
         <div>Sum Results: {sum}</div>
         <div>Fib Results: {fib}</div>
         {user}
         <input type="text" placeholder="room code" name="name" onChange={e =>setRoomId(e.target.value)}/>
         <button onClick={createBtn}>create room</button>
         <button onClick={joinBtn}>join room</button>
         <button onClick={leaveBtn}>leave room</button>

         <div>log {joinstate}</div>
         <div>messages:</div>
         {message.map(string => (
            <div>
               {string}
            </div>
         ))}


      </div>
   );
}
export default App;