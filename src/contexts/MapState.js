import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import uuid from 'uuid/v4';
import _ from 'lodash';
import Debug from 'debug';

const debug = Debug('MapState');

export const MapDefaultState = {
	data: new Map(),
	style: new Map([['outdoor', { on: true, url: 'mapbox://styles/mapbox/outdoors-v11' }], ['ssurgo', { on: false, url: null }], ['lidar', { on: false, url: null }], ['contours', { on: false, url: null }], ['satellite', { on: false, url: 'mapbox://styles/mapbox/satellite-v9' }]]),
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
	setMapStyle(styleName) {
		// change the set map style state depending on the given styleName
		const { style } = that.state.MapState;
		// the default view must turn off if sattelite is active
		if (styleName === 'satellite') {
			style.get('outdoor').on = !style.get('outdoor').on;
		}
		style.set(styleName, { on: !style.get(styleName).on, url: style.get(styleName).url });
		const updateState = {
			MapState: {
				...that.state.MapState,
				style,
			},
		};

		that.setState(updateState);
	},
});
