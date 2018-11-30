import React, { Component } from 'react';
import './Editor.css';

class Editor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userCode: "",
			step: 1,
			instructions: ""
		};
	}

	componentDidMount() {
		this.callApi()
		  .then(res => this.setState({ instructions: res.instructions }))
		  .catch(err => console.log(err));
	}
	
	callApi = async () => {
		let url = '/api/challenge/' + this.state.step;
		const response = await fetch(url);
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};

	setUserCode = (event) => {
		this.setState({userCode: event.target.value});

	}

	runCode = (event) => {
		event.preventDefault();
		let args = this.props.args;
		let code = this.state.userCode;
		
		let fun = new Function(args, code);

		console.log(fun(1,2));
		this.testCode();
	}

	testCode = async () => {
	
		let step = this.state.step;
		let url = '/api/test/' + step;
		
		const response = await fetch(url, {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json',
	      },
	      body: JSON.stringify({ userCode: this.state.userCode, args: this.props.args }),
	    });
	    const isWorkingStr = await response.text();
	    let isWorking = (isWorkingStr == 'true');	//convert it into a boolean

	    if (response.status !== 200) isWorking = false;

		this.displayMessage(isWorking);
	}

	displayInstructions = () => {
		/*
			let step = this.state.step;
			this.gameService.getInstructions(step);
		*/
	}

	displayMessage = (isWorking) => {
		let msg;
		if(isWorking) {
			msg = 'Good job! Click on "Next" to continue the game!';
			console.log(msg);
		} else {
			msg = 'Oh seems like there is a mistake. Check your code again mate!';
			console.log(msg);
		}
	}


	render() {
		return(
			<div className="editor-container">
				{/*<textarea className="code" ref={this.setUserCode}></textarea>
				<button onClick={this.runCode}>Run</button>*/}
				<div className="game-instructions p-4 pt-5">
					{this.state.instructions}
				</div>
				<form onSubmit={this.runCode}>
					<textarea className="code" value={this.state.userCode} onChange={this.setUserCode} />
					<a className="p-3 game-link" href="#">  <i className="fas fa-sync"></i> </a>
					<input className="btn-main" type="submit" value="Run" />
				</form>
			</div>
		);
	}
}

export default Editor;