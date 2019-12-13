import React from 'react';
import { Link } from 'react-router-dom';

export class WelcomeModal extends React.Component {
	constructor(props) {
		super(props);

		this.fileInput = React.createRef();
	}

	clickFileInput = () => {
		this.fileInput.current.click();
	}

	render() {
		const {
			clickFileInput,
			fileInput,
		} = this;

		return (
			<div className="WelcomeModal modal">
				<div className="grid-row">
					<div className="grid-wrap">
						<Link to="/"><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="Close Welcome Modal" /></Link>
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
								<div className="Button">
									<span>Let&apos;s Get Started</span>
								</div>
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
