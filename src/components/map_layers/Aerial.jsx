/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const Aerial = props => {
	const {
		active,
		aerialYear,
		map,
	} = props;

	const layer = {
		id: 'aerial',
		type: 'raster',
		source: `aerial-${aerialYear || '2019'}`,
		minzoom: 12,
        paint: {
            'raster-opacity': active ? 1 : 0,
        },
	};

	return <Layer map={map} layer={layer} />;
};
