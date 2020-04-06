/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const Contours = props => {
	const {
		active,
		color,
        map,
        width,
	} = props;

	const contourLayer = {
		id: 'contours',
		type: 'line',
		source: 'contours',
		'source-layer': process.env.mapbox_contour_tileset_layer_name,
		minzoom: 10,
		paint: {
			'line-color': color || 'yellow',
			'line-width': width || 0.5,
			'line-opacity': active ? 1 : 0,
		},
	};

	const labelLayer = {
		id: 'contour-labels',
		type: 'symbol',
		source: 'contours',
		'source-layer': process.env.mapbox_contour_tileset_layer_name,
		minzoom: 10,
		layout: {
			visibility: active ? 'visible' : 'none',
			'symbol-placement': 'line',
			'text-field': '{CONTOUR} ft',
			'text-letter-spacing': 0,
			'text-line-height': 1.6,
			'text-max-angle': 10,
			'text-rotation-alignment': 'map',
			'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
			'text-size': 12,
		},
		paint: {
			'icon-color': 'black',
			'icon-halo-width': 1,
			'text-color': map.labelTextColor || 'black',
			'text-halo-width': 1,
		},
		// layout: {
		// 	'symbol-placement': 'line',
		// 	'text-field': '{ele} ft',
		// 	'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],

		// },
		// 'paint.contours': {
		// 	'text-opacity': 1,
		// 	'text-halo-blur': 0,
		// 	'text-size': 12,
		// 	'text-halo-width': 1,
		// 	'text-halo-color': '#333',
		// 	'text-color': '#00fcdc',
		// },
	};

	return (
		<>
			<Layer map={map} layer={contourLayer} />
			<Layer map={map} layer={labelLayer} />
		</>
	);
};
