export const draw_multiple_points = {
	onSetup(opts) {
		const state = {};
		state.count = opts.count || 0;
		return state;
	},
	onClick(state, e) {
		const point = this.newFeature({
			type: 'Feature',
			properties: {
				count: state.count,
			},
			geometry: {
				type: 'Point',
				coordinates: [e.lngLat.lng, e.lngLat.lat],
			},
		});
		this.addFeature(point); // puts the point on the map
	},
	onKeyUp(state, e) {
		if (e.keyCode === 27) return this.changeMode('simple_select');
	},
	toDisplayFeatures(state, geojson, display) {
		display(geojson);
	},
};
