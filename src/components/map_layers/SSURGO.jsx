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
		'source-layer': 'gSSURGO_IOWA',
		paint: {
			'fill-color': [
				'case',
					['==', ['get', 'component_taxorder'], 'Alfisols'], 'hsl(37, 93%, 49%)',
					['==', ['get', 'component_taxorder'], 'Entisols'], 'hsl(70, 89%, 51%)',
					['==', ['get', 'component_taxorder'], 'Histosols'], 'hsl(108, 88%, 42%)',
					['==', ['get', 'component_taxorder'], 'Inceptisols'], 'hsl(169, 87%, 48%)',
					['==', ['get', 'component_taxorder'], 'Mollisols'], 'hsl(242, 85%, 56%)',
					['==', ['get', 'component_taxorder'], 'Vertisols'], 'hsl(294, 80%, 63%)',
					'rgba(0,0,0,0)',
			],
			'fill-opacity': 0.7,
		},
	};

	return <Layer map={map} layer={layer} />;
};
