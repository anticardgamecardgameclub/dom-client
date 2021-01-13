import React , { useState } from 'react';
import './App.css';

function App() {
  import('rust-wasm').then(({ add_two_ints, fib }) => {
      // off-loading computations to WASM
      const sumResult = add_two_ints(10, 20);
      const fibResult = fib(10);
      // updating our sumResult and fibResult values (declared below)
      setSum(sumResult);
      setFib(fibResult);
  });
   const [sum, setSum] = useState<number>(0);
   const [fib, setFib] = useState<number>(0);
   return (
      // I cut out the fluff
      // Displaying our sum and fib values that're updated by WASM
      <div className="App" >
         <div>Sum Results: {sum}</div>
         <div>Fib Results: {fib}</div>
      </div>
   );
}
export default App;