export const drawLineStringEvents = {
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
		// prevent binding twice
		this.isBound = true;
	},
	// does not work
	unbind() {
		if (this.map) {
			this.map.off('click', this.drawLineString);
			// prevent binding twice -- uncomment below when unbind() works
			// this.isBound = false;
		}
	},
};

// when mode is changed route needs to change
// i.e draw_line_string --> simple_select or draw_line_string --> draw_multiple_points
