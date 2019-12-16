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
		// layout: {
		// 	visibility: props.active ? 'visible' : 'none',
		// },
		paint: {
			'fill-color': [
				'case',
					['==', ['get', 'taxorder'], 'Alfisols'], 'hsl(37, 93%, 49%)',
					['==', ['get', 'taxorder'], 'Entisols'], 'hsl(70, 89%, 51%)',
					['==', ['get', 'taxorder'], 'Histosols'], 'hsl(108, 88%, 42%)',
					['==', ['get', 'taxorder'], 'Inceptisols'], 'hsl(169, 87%, 48%)',
					['==', ['get', 'taxorder'], 'Mollisols'], 'hsl(242, 85%, 56%)',
					['==', ['get', 'taxorder'], 'Vertisols'], 'hsl(294, 80%, 63%)',
					'rgba(0,0,0,0)',
			],
			'fill-opacity': props.active ? 0.3 : 0,
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
