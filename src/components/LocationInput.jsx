// import Debug from 'debug';
import React from 'react';
import {
	Link,
} from 'react-router-dom';
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
						key={suggestion.placeId}
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
			defaultLatLng,
			currentMapDetails: {
				latlng,
			},
			location,
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
						location: new google.maps.LatLng(latlng ? latlng[1] : defaultLatLng[1], latlng ? latlng[0] : defaultLatLng[0]),
						radius: 20000,
						// types: ['address'],
						componentRestrictions: { country: 'us' },
					}}
				>
					{({
						getInputProps,
						suggestions,
						getSuggestionItemProps,
					}) => (
						<div className="LocationInput">
							<div className="wrapper">
								<input {...getInputProps({
									placeholder: 'Enter a location or address',
									onKeyUp: e => this.handleKeyPress(e),
								})}
								/>
								<Link className="MyLocation" to={`${location.pathname}#location`} />
							</div>
							<LocationInputSuggestions getSuggestionItemProps={getSuggestionItemProps} suggestions={suggestions} />
						</div>
					)}
				</PlacesAutocomplete>
			);
		}
		return (
			<div className="LocationInput">
				<img src="/assets/my_location.svg" alt="my location" />
				<input placeholder="Enter a location or address" />
			</div>
		);
	}
}
