import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import uuid from 'uuid/v4';
import _ from 'lodash';
import Debug from 'debug';

const debug = Debug('MapState');

export const MapDefaultState = {
	data: new Map(),
	basemaps: {
		outdoor: {
			on: true,
			url: 'mapbox://styles/mapbox/outdoors-v11',
		},
		satellite: {
			on: false,
			url: 'mapbox://styles/mapbox/satellite-v9',
		},
	},
	layers: {
		ssurgo: false,
		lidar: false,
		contours: false,
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
	setBasemap(basemapName) {
		// Set map style given basemap name
		const { basemaps } = that.state.MapState;
		// the default view must toggle opposite of satellite
		if (basemapName === 'satellite') {
			basemaps.outdoor.on = !basemaps.outdoor.on;
		}
		if (basemaps[basemapName]) {
			basemaps[basemapName].on = !basemaps[basemapName].on;
		}
		const updateState = {
			MapState: {
				...that.state.MapState,
				basemaps,
			},
		};

		that.setState(updateState);
	},
	setMapLayer(layerName) {
		// Set map layer given layer name
		const { layers } = that.state.MapState;
		if (Object.prototype.hasOwnProperty.call(layers, layerName)) {
			layers[layerName] = !layers[layerName];
		}
		console.log(layers);
		const updateState = {
			MapState: {
				...that.state.MapState,
				layers,
			},
		};
		that.setState(updateState);
	},
});
