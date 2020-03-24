import React from 'react';
import { Layer } from './Layer';

export const GeolocationPosition = props => {
	const {
		map,
	} = props;

	const labelLayer = {
		id: 'geolocation_position_label',
		type: 'symbol',
		source: 'geolocation_position',
		layout: {
			'text-field': 'You are here',
			'text-anchor': 'bottom',
			'text-offset': [0, 2],
			'text-allow-overlap': true,
			'text-justify': 'auto',
		},
		paint: {
			'text-color': map.labelTextColor || 'white',
		},
	};

	const circleLayer = {
		id: 'geolocation_position_circle',
		type: 'circle',
		source: 'geolocation_position',
		paint: {
			'circle-radius': 5,
			'circle-color': 'blue',
			'circle-stroke-width': 3,
			'circle-stroke-color': 'white',
		},
	};

	return (
		<>
			<Layer map={map} layer={labelLayer} />
			<Layer map={map} layer={circleLayer} />
		</>
	);
};
