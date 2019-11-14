export const drawLineStringEvents = {
	lineVertices: 0,
	drawLineString() {
		// this does not refer to object, it refers to map
		// this.lineVertices += 1;
		console.log(this);
		if (this.lineVertices === 2) {
			this.lineVertices = 0;
			this.map.draw.changeMode('simple_select');
			this.map.draw.changeMode('draw_line_string');
		}
	},
	bindTo(mapComponent) {
		this.map = mapComponent.map;
		this.draw = mapComponent.draw;

		this.map.on('click', this.drawLineString);
	},
	unbind() {
		if (this.map) {
			this.map.off('click', this.drawLineString);
		}
	},
};

// create an object with events pertaining to the draw mode
// if draw_line_string bind all these events to the map/draw
// on change of mode unbind all these events from map
