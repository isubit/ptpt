import React from 'react';
import { Layer } from './Layer';

export const Outline = props => {
	const {
		color,
		width,
		map,
	} = props;

	const layer = {
		id: 'feature_data_outline',
		type: 'line',
		source: 'feature_data',
		paint: {
			'line-color': color || '#006ba6',
			'line-width': width || 3,
		},
	};

	return <Layer map={map} layer={layer} />;
};
