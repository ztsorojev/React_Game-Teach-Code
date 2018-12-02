import React, { Component } from 'react';
import Editor from './editor/Editor.js';
import Game from './game/Game.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      isWorking: -1
    }
  }

  setStep = (step, isWorking) => {
    this.setState({
      step: step,
      isWorking: isWorking
    });
  }
  
  render() {
    let argsProbl1 = ['a', 'b'];
    return (
      <div className="App">

          <Editor args={argsProbl1} parentState={this.setStep}/>
          <div className="separator"></div>
          <Game step={this.state.step} isWorking={this.state.isWorking}/>

      </div>
    );
  }
}

export default App;
