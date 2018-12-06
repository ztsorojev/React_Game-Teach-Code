import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/mode/javascript/javascript';
import './Editor.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';


class Editor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userCode: "",
			step: 1,
			description: "",
			instructions: "",
			userOutput: "",
			isWorking: -1	//-1 is the neutral state (user haven't ran code yet), 0 is false and 1 is true
		};
		this.test = "";
		this.stepMax = 5;	//there are 4 steps in this game
	}

	
	componentDidMount() {
		this.getInstructions()
		  .then(res => {
		  	this.setState({ description: res.description, instructions: res.instructions, userCode: res.code });
		  	this.test = res.test;
		  })
		  .catch(err => console.log(err));
	}

	componentDidUpdate(prevProps, prevState) {
		let step = this.state.step; let isWorking = this.state.isWorking;
		if(step !== prevState.step || isWorking !== prevState.isWorking) {
			//console.log("change - step: " + step);
			this.props.parentState(step, isWorking);
		}
		//if we move to next step, get new description, instructions and code for user
		if(step !== prevState.step)	{
			this.getInstructions()
			  .then(res => {
			  	this.setState({ description: res.description, instructions: res.instructions, userCode: res.code });
			  	this.test = res.test;
			  })
			  .catch(err => console.log(err));
		}
	}

	setUserCode = (event) => {
		this.setState({userCode: event.target.value});
	}

	setUserCode2 = (editor, data, value) => {
		this.setState({userCode: value});
	}

	testCode = (event) => {
		event.preventDefault();
		/*let step = this.state.step;
		let url = '/api/challenge/1/actiontest/' + step;
	
		const response = await fetch(url, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({ userCode: this.state.userCode, args: this.props.args }),
	    });
	    const isWorkingStr = await response.text();
	    let isWorking = (isWorkingStr === 'true') ? 1 : 0;

	    if (response.status !== 200) isWorking = 0;*/

	    //let args = this.props.args;
	    let args = [];
		let code = this.state.userCode;

		let isWorking = 0;
		let userOutput = "";
		try {
			let fun = new Function(args, code);
			userOutput = fun();
			//console.log(userOutput)
			isWorking = (userOutput == this.test)? 1 : 0;
		} catch(error) {
			console.log(error);
		}
		//console.log("1 :" + userOutput)
		this.setState({userOutput: userOutput});
	    this.setState({isWorking: isWorking});

	    if(isWorking===1) {
	    	var bg_music = new Audio('./sound/little_robot_sound_factory_Jingle_Win_Synth_05.mp3');
			bg_music.play();
	    }
	   
		this.displayMessage(isWorking);
	}

	getInstructions = async () => {
		let step = this.state.step;
		let url = '/api/challenge/1/action/' + step;
		try {
			const response = await fetch(url);
			const body = await response.json();
			if (response.status !== 200) throw Error(body.message);
			
			//this.setState({instructions: body.instructions});
			return body;
		} catch(error) {
			console.log(error);
		}
		return null;
	}

	displayUserOutput = (userOutput) => {
		//console.log(userOutput);
		//console.log("isWorking: " + this.state.isWorking);
		if(this.state.isWorking === 1){
			return (
				<div className="output-msg">
					<div className="alert alert-success">
						<strong>Correct output:</strong> &nbsp; {userOutput}
					</div>
				</div>
			);
		} else if(this.state.isWorking === 0) {
			if(userOutput === undefined || userOutput === "") userOutput = "You didn't return anything.";
			return (
				<div className="output-msg">
					<div className="alert alert-danger">
						<strong>Wrong output:</strong> &nbsp; {userOutput}
					</div>
				</div>
			);
		} else {
			return (<div></div>);
		}
		
	}

	displayMessage = (isWorking) => {
		let msg;
		if(isWorking===1) {
			msg = 'Good job! Click on "Next" to continue the game!';
			console.log(msg);
		} else {
			msg = 'Oh seems like there is a mistake. Check your code again mate!';
			console.log(msg);
		}
	}

	displayNext = (isWorking) => {
		if(isWorking===1 && this.state.step < this.stepMax) {
			//console.log(isWorking);
			return (<div className="text-right next-wrapper"><button className="btn-main btn-next" onClick={this.setNext} >Next</button></div>);
		}

	}

	setNext = () => {
		let current_step = this.state.step;
		this.setState({
			userCode: "",
			step: current_step + 1,
			description: "",
			instructions: "",
			userOutput: "",
			isWorking: -1
		});
		//this.props.parentState(current_step + 1, -1);
		//console.log(this.state.step);
	}


	render() {
		let options = {
			lineNumbers: true,
			theme: 'material',
			mode: 'javascript'
		};
		return(
			<div className="editor-container">
				{/*<textarea className="code" ref={this.setUserCode}></textarea>
				<button onClick={this.runCode}>Run</button>*/}
				<div className="game-instructions p-4">
					<h3>Castle Conquest: <span className="action-title">Action {this.state.step}</span></h3>
					{this.state.description}
					<hr/>
					{this.state.instructions}
				</div>
				<form onSubmit={this.testCode}>
					{/*<textarea className="code" value={this.state.userCode} onChange={this.setUserCode} />*/}
					<CodeMirror 
						className="code-editor" 
						value={this.state.userCode} 
						onBeforeChange={(editor, data, value) => {
							this.setState({ userCode: value });
						}}
						onChange={this.setUserCode2} 
						options={options} 
						autoFocus={true}
					/>
					<div className="text-right pt-2">
						<a className="p-3 game-link" href="#">  <i className="fas fa-sync"></i> </a>
						<input className="btn-main" type="submit" value="Run" />
					</div>
				</form>
				{this.displayNext(this.state.isWorking)}
				{this.displayUserOutput(this.state.userOutput)}
			</div>
		);
	}
}

export default Editor;