import React from 'react';
import { Layer } from './Layer';

export const Area = props => {
	const {
		color,
		opacity,
		outlineColor,
		map,
	} = props;

	const layer = {
		id: 'feature_data_area',
		type: 'fill',
		source: 'feature_data',
		paint: {
			'fill-color': color || '#7a99ac',
			'fill-opacity': opacity || 0.7,
			'fill-outline-color': outlineColor || '#000e5e',
		},
	};

	return <Layer map={map} layer={layer} />;
};
