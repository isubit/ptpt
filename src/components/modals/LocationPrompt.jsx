import React from 'react';
import { Link } from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';

export class Component extends React.Component {
	state = {
		done: false,
	}

	componentDidMount() {
		const {
			promptCurrentGeolocation,
		} = this.props;

		promptCurrentGeolocation();
	}

	componentDidUpdate(prevProps) {
		// If no longer waiting on geolocation and there was no error, then redirect back to root.
		if (prevProps.awaitingGeolocation === true && this.props.awaitingGeolocation === false && !this.props.geolocationError) {
			
		}
	}

	render() {
		return (
			<div className="LocationPrompt modal">
				<div className="grid-row">
					<div className="grid-wrap">
						<Link to="/"><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="Close Welcome Modal" /></Link>
						<h3 className="modal-header">Allow the Prairie &amp; Tree Planting application to access your location while using the app?</h3>
						<div className="content">
							<img src="https://via.placeholder.com/150" alt="browser location prompt" />
							<p>
								This will allow the app to pan the map to your current location. We don&apos;t use your location data for any other purposes.
							</p>
						</div>
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
