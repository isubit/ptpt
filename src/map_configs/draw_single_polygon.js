/* eslint-disable react/no-this-in-sfc */
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const draw_single_polygon = MapboxDraw.modes.draw_polygon;

// const ogSetup = MapboxDraw.modes.draw_polygon.onSetup;

// draw_single_polygon.onSetup = function onSetup(opts = {}) {
// 	// This allows us to pass props to the draw mode from the React component.
// 	const state = ogSetup.call(this);
// 	return {
// 		...state,
// 		...opts,
// 	};
// };

// draw_single_polygon.clickAnywhere = function clickAnywhere(state, e) {
// 	const newState = state;

// 	if (newState.currentVertexPosition === 1) {
// 		newState.line.addCoordinate(1, e.lngLat.lng, e.lngLat.lat);
// 		return state.nextStep('type');
// 	}

// 	this.updateUIClasses({ mouse: 'add' });
// 	newState.line.updateCoordinate(newState.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	if (newState.direction === 'forward') {
// 		newState.currentVertexPosition += 1;
// 		newState.line.updateCoordinate(newState.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
// 	} else {
// 		newState.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
// 	}

// 	return null;
// };
