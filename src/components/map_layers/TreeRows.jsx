import React from 'react';
import { Layer } from './Layer';

export const TreeRows = props => {
	const {
		color,
		width,
		map,
	} = props;

	const layer = {
		id: 'feature_data_tree_rows',
		type: 'line',
		source: 'feature_data_tree_rows',
		paint: {
			'line-color': color || '#76881D',
			'line-width': width || 2,
		},
		maxzoom: 18,
	};

	return <Layer map={map} layer={layer} />;
};
