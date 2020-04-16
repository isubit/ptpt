import React from 'react';
import mapboxgl from 'mapbox-gl';

// import calcCenter from '@turf/center';
import calcCentroid from '@turf/center';
// this is will update depending on the 'active_ssurgo_feature' that is stored in context
// on exit delete the 'active_ssurgo_feature' stored in context
// this will be a popup -- new mapboxgl.Popup()

// create a new popup and populate it with the data from the active SSURGO feature that was set in the map component

export class SSURGOModal extends React.Component {
	componentDidMount() {
		const {
			map,
			activeSSURGOFeature,
		} = this.props;
		const feature = {
			type: activeSSURGOFeature.type,
			geometry: activeSSURGOFeature.geometry,
		};
		// extract SSURGO feature data
		const center = calcCentroid(feature);
		const lnglat = center.geometry.coordinates;
		this.popup = new mapboxgl.Popup().setLngLat(lnglat).setHTML('<h1>test</h1>').addTo(map);
	}

	render() {
		return null;
	}
}
