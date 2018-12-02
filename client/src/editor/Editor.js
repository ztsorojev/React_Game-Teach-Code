import React, { Component } from 'react';
import './Editor.css';

class Editor extends Component {

	constructor(props) {
		super(props);
		this.state = {
			userCode: "",
			step: 1,
			instructions: "",
			isWorking: -1	//-1 is the neutral state (user haven't ran code yet), 0 is false and 1 is true
		};
	}

	
	componentDidMount() {
		this.getInstructions()
		  .then(res => this.setState({ instructions: res.instructions }))
		  .catch(err => console.log(err));
	}

	componentDidUpdate(prevProps, prevState) {
		let step = this.state.step; let isWorking = this.state.isWorking;
		if(step !== prevState.step || isWorking !== prevState.isWorking) {
			console.log("change");
			this.props.parentState(step, isWorking);
		}	
	}

	setUserCode = (event) => {
		this.setState({userCode: event.target.value});
	}

	testCode = async (event) => {
		event.preventDefault();
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
	    let isWorking = (isWorkingStr === 'true') ? 1 : 0;

	    if (response.status !== 200) isWorking = 0;

	    this.setState({isWorking: isWorking});
	   
		this.displayMessage(isWorking);
	}

	getInstructions = async () => {
		let step = this.state.step;
		let url = '/api/challenge/' + step;
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
		if(isWorking===1) {
			console.log(isWorking);
			return (<div className="text-right pr-5 pl-5 pt-3"><button className="btn-main btn-next" onClick={this.setNext} >Next</button></div>);
		}

	}

	setNext = () => {
		let current_step = this.state.step;
		this.setState({
			userCode: "",
			step: current_step + 1,
			instructions: "",
			isWorking: -1
		});
		//this.props.parentState(current_step + 1, -1);
		console.log(this.state.step);
	}


	render() {
		return(
			<div className="editor-container">
				{/*<textarea className="code" ref={this.setUserCode}></textarea>
				<button onClick={this.runCode}>Run</button>*/}
				<div className="game-instructions p-4 pt-5">
					{this.state.instructions}
				</div>
				<form className="p-5" onSubmit={this.testCode}>
					<textarea className="code" value={this.state.userCode} onChange={this.setUserCode} />
					<a className="p-3 game-link" href="#">  <i className="fas fa-sync"></i> </a>
					<input className="btn-main" type="submit" value="Run" />
				</form>
				{this.displayNext(this.state.isWorking)}
			</div>
		);
	}
}

export default Editor;