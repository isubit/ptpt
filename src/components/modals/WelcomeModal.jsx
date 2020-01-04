import React from 'react';
import {
	Link,
	Redirect,
} from 'react-router-dom';

export class WelcomeModal extends React.Component {
	constructor(props) {
		super(props);

		this.fileInput = React.createRef();
	}

	componentDidMount() {
		const {
			toggleSeenWelcome,
		} = this.props;

		toggleSeenWelcome();
	}

	clickFileInput = () => {
		this.fileInput.current.click();
	}

	render() {
		const {
			clickFileInput,
			fileInput,
		} = this;

		const {
			router: {
				location,
			},
		} = this.props;

		if (location.pathname !== '/') return <Redirect to="/#welcome" />;

		return (
			<div className="WelcomeModal modal">
				<div className="grid-row">
					<div className="grid-wrap">
						<Link className="CloseButton" to="/"><img src="../../assets/close_dropdown.svg" alt="close welcome modal" /></Link>
						<h2 className="modal-header">Welcome to the Prairie &amp; Tree Planting Tool</h2>
						<p className="modal-text">
							{/* eslint-disable-next-line max-len */}
							To get started, you can use your current location or enter a coordinate or address in the bar above. You can also pan to an area on the map. Once you have your location on the map, use the planting tools in the upper right side to plant your trees and prairies. If you need additional help, you can read the
							<Link to="/help"> help documentation</Link>
							.
						</p>
						<div className="modal-footer">
							<span className="modal-link">Dismiss helper popups</span>
							<div className="button-wrap">
								<Link to="/#location">
									<button className="Button" type="button">Let&apos;s Get Started</button>
								</Link>
								<div>
									<span>Or </span>
									<span className="link" onClick={clickFileInput} onKeyPress={clickFileInput} role="button" tabIndex="0">
										Upload a saved file
										<input type="file" hidden ref={fileInput} />
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
