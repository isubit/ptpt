import React from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import Debug from 'debug';

const debug = Debug('MapComponent');

export const MeasureMode = MapboxDraw.modes.draw_polygon;

const ogClickAnywhere = MapboxDraw.modes.draw_polygon.clickAnywhere;

MeasureMode.clickAnywhere = function clickAnywhere(state, e) {
	ogClickAnywhere.call(this, state, e);

	debug(state, e);

	const vertices = state.polygon.coordinates[0].length - 1;
	// We have at two points so fire creation event for the line.
	if (vertices === 2) {
		// Coerce into a LineString.
		const lineGeoJson = {
			type: 'LineString',
			coordinates: state.polygon.coordinates[0],
		};

		this.map.fire('draw.create', {
			features: [lineGeoJson],
		});
	}
};

// MeasureMode.clickAnywhere = function clickAnywhere(state, e) {
// 	debug('Clicked', state, e);
// 	// // This ends the drawing after the user creates a second point, triggering this.onStop
// 	// if (state.currentVertexPosition === 1) {
// 	// 	state.line.updateCoordinate(1, e.lngLat.lng, e.lngLat.lat);
// 	// 	return this.changeMode('simple_select', { featureIds: [state.line.id] }); // eslint-disable-line react/no-this-in-sfc
// 	// }

// 	if (state.currentVertexPosition > 0 && isEventAtCoordinates(e, state.polygon.coordinates[0][state.currentVertexPosition - 1])) {
// 		return this.changeMode(Constants.modes.SIMPLE_SELECT, { featureIds: [state.polygon.id] });
// 	}

// 	this.updateUIClasses({ mouse: 'add' }); // eslint-disable-line react/no-this-in-sfc
// 	state.polygon.updateCoordinate(`0.${state.currentVertexPosition}`, e.lngLat.lng, e.lngLat.lat);
// 	state.currentVertexPosition += 1; // eslint-disable-line no-param-reassign

// 	// state.polygon.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	// debug('Update', state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	// if (state.direction === 'forward') {
// 	// 	debug('Forward', state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	// 	state.currentVertexPosition += 1; // eslint-disable-line no-param-reassign
// 	// 	state.polygon.updateCoordinate(state.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	// } else {
// 	// 	state.polygon.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// 	// }

// 	return null;
// };

MeasureMode.onStop = function onStop(state) {
	// Check to see if we've deleted this feature.
	if (this.getFeature(state.polygon.id) === undefined) return;

	if (state.polygon.isValid()) {
		const polygonGeoJson = state.polygon.toGeoJSON();

		this.map.fire('draw.create', {
			features: [polygonGeoJson],
		});
	} else {
		this.deleteFeature([state.polygon.id], { silent: true });
	}
};

export class Measure extends React.Component {
	events = new Map()

	componentDidMount() {
		const {
			draw,
			map,
			toggleHelper,
		} = this.props;

		draw.changeMode('measure');
		toggleHelper({
			text: 'Measure a row by clicking where you want the row to start and end. Measure an area by clicking to draw the corners of a shape. Click the starting point to finish drawing your shape.',
			buttonText: 'Okay! Got it!',
			helperFor: 'measure',
		});

		// Setup a new draw.create listener.
		// This will update the feature with some default properties,
		// then move the router onto the next step and set the feature being edited.
		const onCreate = e => {
			map.off('draw.create', onCreate);
			const feature = e.features[0];
			debug('Created feature:', feature);
			// setMeasureFeature...
		};
		map.on('draw.create', onCreate);
		this.events.set('draw.create', onCreate);
	}

	componentDidUpdate(prevProps) {
		const {
			editingFeature,
			toggleHelper,
		} = this.props;

		if (editingFeature && !prevProps.editingFeauture) {
			toggleHelper(null);
		}
	}

	componentWillUnmount() {
		const {
			events,
			props: {
				setEditingFeature,
				map,
				draw,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map && map.off(key, value);
			events.delete(key);
		});

		// Clean up draw and feature state.
		draw && draw.deleteAll();
		setEditingFeature(null);
	}

	render() {
		return null;
	}
}
