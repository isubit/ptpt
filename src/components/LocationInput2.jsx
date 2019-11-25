import React from 'react';
import PlacesAutocomplete, {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

export class LocationInput extends React.Component {
	state = {
		address: '',
		mapAPILoaded: false,
	}

	handleChange = address => {
		this.setState({ address });
	};

	handleSelect = address => {
		geocodeByAddress(address)
			.then(results => getLatLng(results[0]))
			.then(latLng => console.log('Success', latLng))
			.catch(error => console.error('Error', error));
	};

	componentDidMount() {
		const locationInputNode = document.getElementsByClassName('LocationInput')[0];
		locationInputNode.addEventListener('scriptinjection', () => {
			this.setState({ mapAPILoaded: true });
		});
	}

	render() {
		const { mapAPILoaded } = this.state;
		return (
			<div className="LocationInput">
				{ mapAPILoaded && (
					<PlacesAutocomplete
						value={this.state.address}
						onChange={this.handleChange}
						onSelect={this.handleSelect}
					>
						{({
							getInputProps,
							suggestions,
							getSuggestionItemProps,
							loading,
						}) => (
							<div>
								<input
									{...getInputProps({
										placeholder: 'Search Places ...',
										className: 'location-search-input',
									})}
								/>
								<div className="autocomplete-dropdown-container">
									{loading && <div>Loading...</div>}
									{suggestions.map(suggestion => {
										const className = suggestion.active
											? 'suggestion-item--active'
											: 'suggestion-item';
										// inline style for demonstration purpose
										const style = suggestion.active
											? { backgroundColor: '#fafafa', cursor: 'pointer' }
											: { backgroundColor: '#ffffff', cursor: 'pointer' };
										return (
											<div
												{...getSuggestionItemProps(suggestion, {
													className,
													style,
												})}
											>
												<span>{suggestion.description}</span>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</PlacesAutocomplete>
				)}
			</div>
		);
	}
}
