import React, { Component } from 'react';
import './Game.css';

class Game extends Component {

	constructor(props) {
		super(props);
		this.state = {
			step: 1
		};
		this.stepMax = 5;
	}

	componentDidUpdate(prevProps) {
		if(this.props.step !== prevProps.step) {
			this.setState({
				step: this.props.step
			});
		}
	}

	displayImage() {
		let step = this.state.step;
		let url = './img/' + step + '.jpg'
		let imgElement = <img src={url} alt="Game"/>
		
		/*let url = 'a' + this.state.step;
		let imgElement = <div className={url}></div>*/

		return imgElement;
	}

	displayMessage = () => {
		if(this.props.isWorking===1) {
			return (
				<div className="success-bg msg-wrapper">
					<div className="success-msg-wrapper"><p className="success-msg">Good job! Click on "Next" to continue the game!</p></div>
				</div>
			);
		} else if(this.props.isWorking===0) {
			return (
				<div className="error-bg msg-wrapper">
					<div className="error-msg-wrapper"><p className="error-msg">Seems like there is a mistake. Check your code again mate!</p></div>
				</div>
			);
		}
	}

	handleSubmit = () => {
		console.log("Do something");
	}

	render() {
		return(
			<div className="game-container">
				{this.displayImage()}
				{this.displayMessage()}
			</div>
		);
	}
}

export default Game;