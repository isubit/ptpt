import React from 'react';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import Debug from 'debug';

const debug = Debug('MapComponent');

export const MeasureMode = MapboxDraw.modes.draw_polygon;

const ogClickAnywhere = MapboxDraw.modes.draw_polygon.clickAnywhere;
const ogOnMouseMove = MapboxDraw.modes.draw_polygon.onMouseMove;

// MeasureMode.onSetup = function onSetup(state, e) {
// 	const setup = ogOnSetup.call(this, state, e);
// 	setTimeout(() => {
// 		this.updateUIClasses({ mouse: 'add' }); // eslint-disable-line react/no-this-in-sfc
// 	}, 5000);
// 	return setup;
// };

MeasureMode.clickAnywhere = function clickAnywhere(state, e) {
	// Need to copy this logic but add some logic for preventing self-intersecting polygons.
	ogClickAnywhere.call(this, state, e);

	const vertices = state.polygon.coordinates[0].length - 1;
	// We have at two points so fire creation event for the line.
	if (vertices === 2) {
		// Coerce into a LineString.
		const lineGeoJson = {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: [...state.polygon.coordinates[0]],
			},
		};

		// Delete last added coordinate.
		lineGeoJson.geometry.coordinates.pop();

		this.map.fire('draw.create', {
			features: [lineGeoJson],
		});
	} if (vertices > 2) {
		debug(state.polygon.isValid());
		if (state.polygon.isValid()) {
			const polygonGeoJson = state.polygon.toGeoJSON();

			this.map.fire('draw.create', {
				features: [polygonGeoJson],
			});
		}
	}
};

delete MeasureMode.clickOnVertex;

MeasureMode.onMouseMove = function onMouseMove(state, e) {
	this.updateUIClasses({ mouse: 'add' });
	if (state.currentVertexPosition > 1) {
		return null;
	}
	return ogOnMouseMove.call(this, state, e);
};

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
			setMeasureFeature,
			toggleHelper,
		} = this.props;

		draw.changeMode('measure');

		toggleHelper({
			text: 'Measure a row by clicking where you want the row to start and end. Measure an area by clicking to draw the corners of a shape. The distance or area will be measured as you draw.',
			buttonText: 'Okay! Got it!',
			helperFor: 'measure',
		});

		// Setup a new draw.create listener.
		// This will update the feature with some default properties,
		// then move the router onto the next step and set the feature being edited.
		const onCreate = e => {
			// map.off('draw.create', onCreate);
			const feature = e.features[0];
			debug('Created feature:', feature);
			setMeasureFeature(feature.geometry);
		};
		map.on('draw.create', onCreate);
		this.events.set('draw.create', onCreate);
	}

	componentDidUpdate(prevProps) {
		const {
			draw,
			measureFeature,
			toggleHelper,
		} = this.props;

		// If there is now a feature, and there wasn't before, deactivate the helper.
		if (measureFeature && !prevProps.measureFeature) {
			toggleHelper(null);
		}

		// If there is no longer a feature, and there was one before, delete the feature.
		if (!measureFeature && prevProps.measureFeature) {
			draw && draw.deleteAll();
			// Reset the draw state. Hacky, but seems like it's the most surefire way to reset the draw state.
			draw.changeMode('simple_select');
			setTimeout(() => {
				draw.changeMode('measure');
			});
		}
	}

	componentWillUnmount() {
		const {
			events,
			props: {
				map,
				draw,
				setMeasureFeature,
			},
		} = this;

		// Clean up events.
		events.forEach((value, key) => {
			map && map.off(key, value);
			events.delete(key);
		});

		// Clean up draw and feature state.
		draw && draw.deleteAll();
		setMeasureFeature(null);
	}

	render() {
		return null;
	}
}
