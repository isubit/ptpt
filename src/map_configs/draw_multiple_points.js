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
		return e.keyCode === 27 ? this.changeMode('simple_select') : null;
	},
	toDisplayFeatures(state, geojson, display) {
		display(geojson);
	},
};
