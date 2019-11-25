import React from 'react';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

const setLocation = location => {
	this.setState({
		location,
	});
};

const goLocation = async (coordMode, map) => {
	const { location } = this.state;
	return geocodeByAddress(location)
		.then(results => Promise.all([results, getLatLng(results[0])]))
		.then(results => {
			let address = results[0];
			if (!address || address.length === 0) {
				throw new Error('No results found.');
			} else {
				address = address[0];
			}
			const latLng = results[1];
			map.easeTo({ center: latLng, offset: [0, -200] });
			const addressName = [address.address_components[0].long_name, address.address_components[1].long_name];
			const addressNameString = `${addressName[0]} ${addressName[1]}`;
			this.setState({
				locCenter: { ...address, addressName: addressNameString, latLng },
				loading: addressNameString,
			}, () => console.log(this.state));
			this.requestRecords(...addressName)
				.then(res => {
					console.log(res);
					if (res && res.length > 0 && this.state.loading === addressNameString) {
						this.setState({
							loading: false,
							records: res,
						});
					}
				});
		})
		.catch(e => {
			console.error('Error', e);
		});
};

export const LocationInput = props => {
	const {
		map,
		setLocation,
		goLocation,
		location,
	} = props;

	const handleKeyPress = e => {
		if (e.key === 'Enter') {
			e.target.blur();
		}
	};

	return (
		<div className="Searchbar">
			<PlacesAutocomplete
				inputProps={{
					placeholder: 'Address',
					value: location,
					onChange: e => setLocation(e),
					onBlur: () => goLocation(null, map),
					onKeyUp: e => handleKeyPress(e),
				}}
				searchOptions={{
					// eslint-disable-next-line no-undef
					location: new google.maps.LatLng(40.711744, -74.013315),
					radius: 20000,
					types: ['address'],
				}}
			/>
		</div>
	);
};
