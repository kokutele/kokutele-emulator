import React from 'react';
import SourceCanvas from './features/source-canvas'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div className="container">
          <h1>main</h1>
          <SourceCanvas title="send" width={640} height={480} ></SourceCanvas>
        </div>
      </main>
    </div>
  );
}

export default App;
