import React from 'react';
import { Link } from 'react-router-dom';

export class WelcomeModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isDisplayed: true };
		this.toggleWelcomeModal = this.toggleWelcomeModal.bind(this);
	}

	toggleWelcomeModal() {
		const { isDisplayed } = this.state;
		this.setState({ isDisplayed: !isDisplayed });
	}

	render() {
		const { isDisplayed } = this.state;
		return (
			<>
				<div className={isDisplayed ? 'WelcomeModal grid-row active' : 'WelcomeModal grid-row'}>
					<div className="grid-wrap">
						<Link to="/"><img className="CloseButton" onClick={this.toggleWelcomeModal} src="../../assets/close_dropdown.svg" /></Link>
						<h2 className="modal-header">Welcome to the Prairie & Tree Planting Tool</h2>
						<p className="modal-text">
To get started, you can use your current location,
                            add a location or address in the bar above. You
                            can also pan to an area on the map. Once you have
                            your location on the map, use the planting tools in
                            the upper right side to plant your trees and prairies.
                            If you need additional help, you can read the
							<Link to="/help">help documentation</Link>
.
						</p>
						<div>
							<span className="modal-link">Dismiss helper popups</span>
							<div className="button-wrap">
								<div className="Button">
									<span>Let's Get Started</span>
								</div>
								<span>
Or
									<Link to="#">Upload a saved file</Link>
								</span>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}
}
