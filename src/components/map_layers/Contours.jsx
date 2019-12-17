/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const Contours = props => {
	const {
        color,
        map,
        width,
	} = props;

	const layer = {
		id: 'contours',
		type: 'line',
		source: 'contours',
		'source-layer': process.env.mapbox_contour_tileset_layer_name,
		minzoom: 10,
		paint: {
			'line-color': color || 'black',
			'line-width': width || 2,
		},
	};

	return <Layer map={map} layer={layer} />;
};
