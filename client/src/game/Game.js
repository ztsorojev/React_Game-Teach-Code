import React, { Component } from 'react';
import './Game.css';

class Game extends Component {

	constructor(props) {
		super(props);
		this.state = {
			step: 1
		};
	}

	componentDidUpdate(prevProps) {
		if(this.props.step !== prevProps.step) {
			this.setState({
				step: this.props.step
			});
		}
	}

	displayImage() {
		let url = './img/' + this.state.step + '.jpg'
		let imgElement = <img src={url} alt="Game"/>
		/*let url = 'a' + this.state.step;
		let imgElement = <div className={url}></div>*/

		return imgElement;
	}

	render() {
		return(
			<div className="game-container">
				{this.displayImage()}
			</div>
		);
	}
}

export default Game;