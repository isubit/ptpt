import React from 'react';
import { Layer } from './Layer';

export const Trees = props => {
	const {
		image,
		map,
	} = props;

	const layer = {
		id: 'feature_data_trees',
		type: 'symbol',
		source: 'feature_data_trees',
		layout: {
			'icon-image': image || '/assets/plant_tree_option.svg',
			'icon-size': 0.5,
			// 'icon-allow-overlap': true,
		},
		minzoom: 18,
	};

	return <Layer map={map} layer={layer} />;
};
