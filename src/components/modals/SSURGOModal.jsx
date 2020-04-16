import React from 'react';
import mapboxgl from 'mapbox-gl';

import calcCenter from '@turf/center';

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
		const center = calcCenter(feature);
		const lnglat = center.geometry.coordinates;
		this.popup = new mapboxgl.Popup().setLngLat(lnglat).setHTML('<h1>test</h1>').addTo(map);
	}

	render() {
		return null;
	}
}
