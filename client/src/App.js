import React, { Component } from 'react';
import Editor from './editor/Editor.js';
import Game from './game/Game.js';
import './App.css';

class App extends Component {
  
  render() {
    let argsProbl1 = ['a', 'b'];
    return (
      <div className="App">

          <Editor args={argsProbl1}/>
          <div className="separator"></div>
          <Game />

      </div>
    );
  }
}

export default App;
