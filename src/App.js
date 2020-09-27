import React from 'react';
import SourceMedia from './features/source-media'
import DestMedia from './features/dest-media'
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <main>
        <div className="container">
          <h1>main</h1>
          <SourceMedia title="send" width={640} height={480} />
          <DestMedia title="receive" width={640} height={480} />
        </div>
      </main>
    </div>
  );
}

export default App;
