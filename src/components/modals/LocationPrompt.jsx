import React from 'react';
import { Link } from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';

export class Component extends React.Component {
	componentDidMount() {
		const {
			promptCurrentGeolocation,
		} = this.props;

		promptCurrentGeolocation();
	}

	componentDidUpdate(prevProps) {
		const {
			awaitingGeolocation,
			geolocationError,
			lastGeolocationStatus,
			router: {
				location,
				history,
			},
		} = this.props;

		// If no longer waiting on geolocation and there was no error, then replace location with current path without hash, i.e. exits out of modal.
		if ((prevProps.awaitingGeolocation === true && awaitingGeolocation === false && !geolocationError) || lastGeolocationStatus === 'granted') {
			history.replace(location.pathname);
		}
	}

	render() {
		const {
			geolocationError,
			lastGeolocationStatus,
			router: {
				location,
			},
		} = this.props;

		// If geolocationError code > 1, that means there was an issue retrieving the location data.
		let errorMsg;
		if (geolocationError > 1) {
			errorMsg = 'Your device was unable to provide us with location information.';
		} else if (geolocationError === 1) {
			errorMsg = 'You\'re currently blocking this app from using your location information. To use this feature, unblock this app in your browser permission settings.';
		}

		// If geolocation status is granted, don't show the modal.
		if (lastGeolocationStatus === 'granted') {
			return null;
		}

		return (
			<div className="LocationPrompt modal">
				<div className="grid-row">
					<div className="grid-wrap">
						<Link className="CloseButton" to={location.pathname} replace><img src="../../assets/close_dropdown.svg" alt="close location prompt" /></Link>
						<h3 className="modal-header">Allow the Prairie &amp; Tree Planting application to access your location while using the app?</h3>
						<div className="content modal-text">
							<div className="distribute">
								<img className="spacer-right-2" src="https://via.placeholder.com/250x150" alt="browser location prompt" />
								<p className="spacer-left-2">
									{
										errorMsg && geolocationError === 1
											? errorMsg
											: 'Select \'Allow\' to pan the map to your current location. We don\'t use your location information for any other purposes. Blocking this feature will still allow you to use all other functionality in the app.'
									}
								</p>
							</div>
							{errorMsg && geolocationError > 1 && <p className="warning spacer-top-2">{errorMsg} Click the link below or close this popup to continue without this feature.</p>}
						</div>
						{errorMsg && (
							<div className="modal-footer">
								<Link className="modal-link block" to={location.pathname}>Continue without my location</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export const LocationPrompt = props => (
	<MapConsumer>
		{ctx => {
			const { state, actions } = ctx;
			return <Component {...state} {...actions} {...props} />;
		}}
	</MapConsumer>
);
