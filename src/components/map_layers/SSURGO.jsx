/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import { Layer } from './Layer';

export const SSURGO = props => {
	const {
		map,
	} = props;

	const layer = {
		id: 'ssurgo',
		type: 'fill',
		source: 'ssurgo',
		'source-layer': process.env.mapbox_ssurgo_tileset_layer_name,
		minzoom: 10,
		paint: {
			'fill-color': [
				'interpolate',
				['linear'],
				['to-number', ['get', 'iacornsr']],
				0,
				'#909090',
				50,
				'#888900',
				100,
				'#f8f601',
			],
			'fill-opacity': props.active ? 0.6 : 0,
			'fill-antialias': false,
		},
	};

	const events = new Map([
		['click', e => {
			console.log(e.features.length > 0 ? e.features[0] : null);
		}],
	]);

	return <Layer map={map} layer={layer} events={events} />;
};
