import React from 'react';
import { Link } from 'react-router-dom';

export const WelcomeModal = () => (
	<div className="WelcomeModal grid-row">
		<div className="grid-wrap">
			<Link to="/"><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="Close Welcome Modal" /></Link>
			<h2 className="modal-header">Welcome to the Prairie & Tree Planting Tool</h2>
			<p className="modal-text">
				{/* eslint-disable-next-line max-len */}
				To get started, you can use your current location, add a location or address in the bar above. You can also pan to an area on the map. Once you have your location on the map, use the planting tools in the upper right side to plant your trees and prairies. If you need additional help, you can read the
				<Link to="/help">help documentation</Link>
				.
			</p>
			<div>
				<span className="modal-link">Dismiss helper popups</span>
				<div className="button-wrap">
					<div className="Button">
						<span>Let&apos;s Get Started</span>
					</div>
					{/* <span>Or <Link to="#">Upload a saved file</Link></span> */}
				</div>
			</div>
		</div>
	</div>
);
