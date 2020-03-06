/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const Lidar = props => {
	const {
		active,
		map,
	} = props;

	const layer = {
		id: 'lidar',
		type: 'raster',
		source: 'lidar',
        // minzoom: 10,
        paint: {
            'raster-opacity': active ? 0.5 : 0,
        },
	};

	return <Layer map={map} layer={layer} />;
};
