import React from 'react';
import './App.css';
function App() {
   import('rust-wasm').then(module => {
      console.log(module)
   })
   return (
      // I cut out the fluff
      <div className="App" />
   );
}
export default App;
