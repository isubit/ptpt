import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

import { MapConsumer } from '../contexts/MapState';

export const LocationInputWrapper = (props) => (
	<MapConsumer>
		{ctx => {
			const { state, actions } = ctx;
			return <LocationInput {...state} {...actions} {...props} />;
		}}
	</MapConsumer>
);

export class LocationInput extends React.Component {
	state = {
		mapAPILoaded: false,
	}

	componentDidMount() {
		const locationInputNode = document.getElementsByClassName('LocationInput')[0];
		locationInputNode.addEventListener('scriptinjection', () => {
			this.setState({ mapAPILoaded: true });
		});
	}

	handleOnChange(e) {
		const { setAddressName } = this.props;
		setAddressName(e);
	}

	handleKeyPress(e) {
		const { setAddressLatLng } = this.props;
		if (e.key === 'Enter') {
			setAddressLatLng();
		}
	}

	render() {
		const { mapAPILoaded } = this.state;
		const {
			locationAddress: {
				locationSearchInput,
			},
		} = this.props;
		if (mapAPILoaded) {
			return (
				<PlacesAutocomplete
					value={locationSearchInput}
					onChange={e => this.handleOnChange(e)}
					/* searchOptions={{
						// eslint-disable-next-line no-undef
						location: new google.maps.LatLng(40.711744, -74.013315),
						radius: 20000,
						types: ['address'],
					}} */
				>
					{({ getInputProps }) => (
						<div className="LocationInput">
							<input {...getInputProps({ placeholder: 'Enter a location or address', onKeyUp: e => this.handleKeyPress(e) })} />
						</div>
					)}
				</PlacesAutocomplete>
			);
		}
		return (
			<div className="LocationInput">
				<input placeholder="Enter a location or address" />
			</div>
		);
	}
}
