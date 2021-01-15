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

   const [sum, setSum] = useState<number>(0);
   const [fib, setFib] = useState<number>(0);

   const user = FirebaseRTC.initdatabase()

   async function createBtn() {
      var result = await FirebaseRTC.createRoom();
      setJoinState(`created room ${result}`)
      setRoomId(result);
   }

   async function joinBtn() {
      if (roomId != "") {
      var result:boolean = await FirebaseRTC.joinRoom(roomId);
      setJoinState(`joined room: ${result ? "success": "fail"}`)
      }
   
   }

   useEffect(() => {

      const onbeforeunloadFn = () => {
         FirebaseRTC.onClose(roomId)
      }

      window.addEventListener('beforeunload', onbeforeunloadFn);
      return () => {
         window.removeEventListener('beforeunload', onbeforeunloadFn);
      }
   }, [])

   return (
      // Displaying our sum and fib values that're updated by WASM
      <div className="App" >
         <div>Sum Results: {sum}</div>
         <div>Fib Results: {fib}</div>
         {user}
         <input type="text" placeholder="firstname" name="name" onChange={e =>setRoomId(e.target.value)}/>
         <button onClick={createBtn}>create room</button>
         <button onClick={joinBtn}>join room</button>
         <div>log {joinstate}</div>
      </div>
   );
}
export default App;