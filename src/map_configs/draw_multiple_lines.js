/* eslint-disable react/no-this-in-sfc */
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export const draw_multiple_lines = MapboxDraw.modes.draw_line_string;

draw_multiple_lines.clickAnywhere = function clickAnywhere(state, e) {
	const newState = state;

	if (newState.currentVertexPosition === 1) {
		newState.line.addCoordinate(1, e.lngLat.lng, e.lngLat.lat);
		// want to set the line then resume planting more rows
		this.changeMode('simple_select');
		return this.changeMode('draw_multiple_lines');
		// return this.changeMode('simple_select', { featureIds: [newState.line.id] });
	}
	this.updateUIClasses({ mouse: 'add' });
	newState.line.updateCoordinate(newState.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	if (newState.direction === 'forward') {
		newState.currentVertexPosition += 1;
		newState.line.updateCoordinate(newState.currentVertexPosition, e.lngLat.lng, e.lngLat.lat);
	} else {
		newState.line.addCoordinate(0, e.lngLat.lng, e.lngLat.lat);
	}

	return null;
};

/* export const drawLineStringEvents = {
	lineVertices: 0,
	isBound: false,
	drawLineString() {
		this.lineVertices += 1;
		if (this.lineVertices === 2) {
			this.lineVertices = 0;
			// set line onto map
			this.draw.changeMode('simple_select');
			// set mode back to draw_line_string to create multiple rows
			this.draw.changeMode('draw_line_string');
		}
	},
	bindTo(mapComponent) {
		this.map = mapComponent.map;
		this.draw = mapComponent.draw;
		this.map.on('click', () => this.drawLineString());
		this.isBound = true;
	},
	// does not work
	unbind() {
		if (this.map) {
			console.log(this.map);
			this.map.off('click', this.drawLineString);
			// prevent binding twice -- uncomment below when unbind() works
			// this.isBound = false;
		}
	},
}; */

// when mode is changed on keypress (esc) or double click route needs to change
// i.e draw_line_string --> simple_select or draw_line_string --> draw_multiple_points
