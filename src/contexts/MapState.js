import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import uuid from 'uuid/v4';
import _ from 'lodash';
import Debug from 'debug';

import {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

const debug = Debug('MapState');

export const MapDefaultState = {
	data: new Map(),
	defaultMapCenter: [-93.624287, 41.587537],
	currentLatLng: [-93.624287, 41.587537],
	locationAddress: {
		locationSearchInput: '',
		addressName: '',
		latlng: null,
	},
};
export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = (that) => ({
	addData(geojson) {
		// Add geojson feature data.
		const errors = geojsonhint.hint(geojson);
		if (!errors || errors.length === 0 || (errors.length === 1 && errors[0].message.includes('right-hand rule'))) {
			if (geojson.type === 'FeatureCollection') {
				geojson.features.forEach(ea => this.addData(ea));
			} else {
				// Create new map.
				const data = new Map(that.state.MapState.data);

				// Clone the geojson.
				const feature = _.cloneDeep(geojson);

				// If feature doesn't have an id, give it one first.
				if (!feature.id) {
					feature.id = uuid();
				}

				data.set(feature.id, feature);

				// Rebuild a new state object with new data.
				const updateState = {
					MapState: {
						...that.state.MapState,
						data,
					},
				};
				that.setState(updateState);
			}
		} else {
			debug('Error adding data to context:', errors);
		}
	},
	deleteData(id) {
		// Delete data using id.
		const data = new Map(that.state.MapState.data);
		data.delete(id);

		const updateState = {
			MapState: {
				...that.state.MapState,
				data,
			},
		};
		that.setState(updateState);
	},

	setCurrentLatLng(latlng) {
		that.setState({
			MapState: {
				...that.state.MapState,
				currentLatLng: latlng,
			},
		});
	},

	setAddressLatLng() {
		const {
			MapState: {
				locationAddress: {
					locationSearchInput,
				},
			},
		} = that.state;

		return geocodeByAddress(locationSearchInput)
			.then(results => Promise.all([results, getLatLng(results[0])]))
			.then((results) => {
				let address = results[0];
				const { lat, lng } = results[1];
				if (!address || address.length === 0) {
					throw new Error('No results found.');
				} else {
					[address] = address;
				}
				const addressName = `${address.address_components[0].long_name}, ${address.address_components[1].long_name}`;
				const updateLocationAddress = {
					latlng: [lng, lat],
					locationSearchInput,
					addressName,
				};
				that.setState({
					MapState: {
						...that.state.MapState,
						currentLatLng: [lng, lat],
						locationAddress: updateLocationAddress,
					},
				}, () => console.log(that.state));
			})
			.catch(error => console.log(error));
	},

	setLocationSearchInput(locationSearchInput) {
		const updateLocationAddress = {
			latlng: that.state.latlng,
			locationSearchInput,
		};
		that.setState({
			MapState: {
				...that.state.MapState,
				locationAddress: updateLocationAddress,
			},
		});
	},
});
