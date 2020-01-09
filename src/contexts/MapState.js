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
	// Data
	data: new Map(),

	// Google Maps API
	mapAPILoaded: false,

	// Device / Browser Geolocation API
	geolocationSupported: !!(navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition),
	awaitingGeolocation: false,
	geolocationError: null,
	lastGeolocationStatus: null,
	lastGeolocationResult: null,

	// Map State
	defaultLatLng: [-93.624287, 41.587537],
	defaultZoom: 13,
	defaultBearing: 0,
	defaultPitch: 0,
	currentMapDetails: {
		latlng: null,
		zoom: null,
		bearing: null,
		pitch: null,
	},

	// Location Input
	locationAddress: {
		locationSearchInput: '',
		addressName: '',
		latlng: null,
	},

	// Map Layer States
	basemap: 'outdoor',
	layers: {
		ssurgo: false,
		lidar: false,
		contours: false,
	},
};
export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = (that) => {
	const actions = {
		async addData(geojson) {
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
					that.setState(state => ({
						MapState: {
							...state.MapState,
							data,
						},
					}), () => {
						debug('Saved data:', that.state.MapState.data);
					});
				}
			} else {
				debug('Error adding data to context:', errors);
			}
		},
		deleteData(id) {
			// Delete data using id.
			const data = new Map(that.state.MapState.data);
			data.delete(id);

			that.setState(state => ({
				MapState: {
					...state.MapState,
					data,
				},
			}));
		},
		setBasemap(basemapName) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					basemap: basemapName,
				},
			}));
		},
		setMapLayer(layerName) {
			// Set map layer given layer name
			const { layers } = that.state.MapState;
			if (Object.prototype.hasOwnProperty.call(layers, layerName)) {
				layers[layerName] = !layers[layerName];
			}
			that.setState(state => ({
				MapState: {
					...state.MapState,
					layers,
				},
			}));
		},
		setMapAPILoaded() {
			if (!that.state.mapAPILoaded) {
				that.setState(state => ({
					MapState: {
						...state.MapState,
						mapAPILoaded: true,
					},
				}));
			}
		},
		updateCurrentMapDetails(mapDetails) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					currentMapDetails: {
						...mapDetails,
					},
				},
			}));
		},
		setAddressLatLng() {
			const {
				MapState: {
					defaultZoom,
					defaultBearing,
					defaultPitch,
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
					that.setState(state => ({
						MapState: {
							...state.MapState,
							// reset zoom, bearing, and pitch
							currentMapDetails: {
								zoom: defaultZoom,
								bearing: defaultBearing,
								pitch: defaultPitch,
								latlng: [lng, lat],
							},
							locationAddress: {
								...state.MapState.locationAddress,
								addressName,
								latlng: [lng, lat],
							},
						},
					}));
				})
				.catch(error => debug('React places geocode error:', error));
		},
		setLocationSearchInput(locationSearchInput, callbackSetLatLng = false) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					locationAddress: {
						...state.MapState.locationAddress,
						locationSearchInput,
					},
				},
			}), () => {
				if (callbackSetLatLng) {
					actions.setAddressLatLng();
				}
			});
		},
		setMapPreviouslyLoaded() {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					mapPreviouslyLoaded: true,
				},
			}));
		},
		promptCurrentGeolocation() {
			function get() {
				navigator.geolocation.getCurrentPosition(pos => {
					debug('Current geolocation:', pos);
					const {
						latitude,
						longitude,
					} = pos.coords;

					that.setState(state => ({
						MapState: {
							...state.MapState,
							awaitingGeolocation: false,
							currentMapDetails: {
								...state.MapState.currentMapDetails,
								latlng: [longitude, latitude],
							},
							lastGeolocationResult: [longitude, latitude],
						},
					}));
				}, err => {
					debug('Geolocation error:', err);
					that.setState(state => ({
						MapState: {
							...state.MapState,
							awaitingGeolocation: false,
							geolocationError: err.code,
							lastGeolocationResult: null,
						},
					}));
				});
			}

			if (that.state.MapState.geolocationSupported) {
				navigator.permissions.query({ name: 'geolocation' })
					.then(({ state: status }) => {
						that.setState(state => ({
							MapState: {
								...state.MapState,
								lastGeolocationStatus: status,
							},
						}), () => {
							if (status === 'granted') {
								get();
							} else {
								that.setState(state => ({
									MapState: {
										...state.MapState,
										awaitingGeolocation: true,
									},
								}), get);
							}
						});
					});
			} else {
				debug('Geolocation not supported.');
				that.setState(state => ({
					MapState: {
						...state.MapState,
						awaitingGeolocation: false,
						geolocationError: 2,
					},
				}));
			}
		},
	};
	return actions;
};
