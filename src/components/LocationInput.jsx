// import Debug from 'debug';
import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';


import { MapConsumer } from '../contexts/MapState';

// const debug = Debug('LocationInput');

export const LocationInputWrapper = (props) => (
	<MapConsumer>
		{ctx => {
			const { state, actions } = ctx;
			return <LocationInput {...state} {...actions} {...props} />;
		}}
	</MapConsumer>
);

const LocationInputSuggestions = (props) => {
	const {
		suggestions,
		getSuggestionItemProps,
	} = props;
	return (
		<div className="LocationInputSuggestions">
			{suggestions.map(suggestion => {
				const className = suggestion.active
					? 'suggestion-item--active'
					: 'suggestion-item';
				return (
					<div
						{...getSuggestionItemProps(suggestion, {
							className,
						})}
					>
						<span>{suggestion.description}</span>
					</div>
				);
			})}
		</div>
	);
};

export class LocationInput extends React.Component {
	handleOnChange(e) {
		const { setLocationSearchInput } = this.props;
		setLocationSearchInput(e);
	}

	handleKeyPress(e) {
		const { setAddressLatLng } = this.props;
		if (e.key === 'Enter') {
			setAddressLatLng();
		}
	}

	handleSelect(e) {
		// binding this to props, so we can access props within setLocationSearchInput
		// this.props.setLocationSearchInput(e, true);
		const { setLocationSearchInput } = this.props;
		setLocationSearchInput(e, true);
	}

	render() {
		const {
			mapAPILoaded,
			currentMapDetails: {
				latlng,
			},
			locationAddress: {
				locationSearchInput,
			},
		} = this.props;

		if (mapAPILoaded) {
			return (
				<PlacesAutocomplete
					value={locationSearchInput}
					onChange={e => this.handleOnChange(e)}
					onSelect={e => {
						this.handleSelect(e);
					}}
					searchOptions={{
						// eslint-disable-next-line no-undef
						location: new google.maps.LatLng(latlng[1], latlng[0]),
						radius: 20000,
						types: ['address'],
					}}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
					}) => (
						<div className="LocationInput">
							<input {...getInputProps({
								placeholder: 'Enter a location or address',
								onKeyUp: e => this.handleKeyPress(e),
							})}
							/>
							<LocationInputSuggestions getSuggestionItemProps={getSuggestionItemProps} suggestions={suggestions} />
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
