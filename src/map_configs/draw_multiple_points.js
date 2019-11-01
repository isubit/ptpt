export let draw_multiple_points = {
    onSetup: function(opts) {
        let state = {};
        state.count = opts.count || 0;
        return state;
    },
    onClick: function(state, e) {
        let point = this.newFeature({
                type: 'Feature',
                properties: {
                count: state.count
                },
                geometry: {
                type: 'Point',
                coordinates: [e.lngLat.lng, e.lngLat.lat]
            }
        })
        this.addFeature(point); // puts the point on the map
    },
    onKeyUp: function(state, e) {
        if (e.keyCode === 27) return this.changeMode('simple_select');
    },
    toDisplayFeatures: function(state, geojson, display) {
        display(geojson);
    }
}