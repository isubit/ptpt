import React from 'react';
import { Layer } from './Layer';

export const FeatureLabels = props => {
	const {
		map,
	} = props;

	const layer = {
		id: 'feature_data_labels',
		type: 'symbol',
		source: 'feature_data_southern_vertices',
		layout: {
			'text-field': ['get', 'label'],
			'text-anchor': 'bottom',
			'text-offset': [0, 3],
			'text-allow-overlap': true,
			'text-justify': 'auto',
		},
	};

	return <Layer map={map} layer={layer} />;
};
