import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import uuid from 'uuid/v4';
import _ from 'lodash';
import Debug from 'debug';

const debug = Debug('MapState');

export const MapDefaultState = {
	data: new Map(),
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
		that.setState({
			MapState: {
				...that.state.MapState,
				basemap: basemapName,
			},
		});
	},
	setMapLayer(layerName) {
		// Set map layer given layer name
		const { layers } = that.state.MapState;
		if (Object.prototype.hasOwnProperty.call(layers, layerName)) {
			layers[layerName] = !layers[layerName];
		}
		const updateState = {
			MapState: {
				...that.state.MapState,
				layers,
			},
		};
		that.setState(updateState);
	},
});
