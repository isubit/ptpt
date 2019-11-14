export const drawLineStringEvents = {
	lineVertices: 0,
	drawLineString() {
		this.lineVertices += 1;
		console.log(this);
		if (this.lineVertices === 2) {
			this.lineVertices = 0;
			this.draw.changeMode('simple_select');
			this.draw.changeMode('draw_line_string');
		}
	},
	bindTo(mapComponent) {
		this.map = mapComponent.map;
		this.draw = mapComponent.draw;
		// this runs on ANY click... how to test if this method unbinds
		this.map.on('click', this.drawLineString.bind(this));
	},
	unbind() {
		if (this.map) {
			this.map.off('click', this.drawLineString.bind(this));
		}
	},
};

// need to change route and update component when escape is pressed
