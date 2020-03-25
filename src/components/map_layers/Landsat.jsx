/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const Landsat = props => {
	const {
		active,
		map,
	} = props;

	const layer = {
		id: 'landsat',
		type: 'raster',
		source: 'landsat',
        // minzoom: 7,
        // maxzoom: 13,
        paint: {
            'raster-opacity': active ? 1 : 0,
        },
	};

	return <Layer map={map} layer={layer} />;
};
