/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
import Debug from 'debug';

import { Layer } from './Layer';

const debug = Debug('MapComponent');

export const SSURGO = props => {
	const {
		active,
		map,
		setActiveSSURGOFeature,
		activeSSURGOFeature,
	} = props;

	const SSURGOLayer = {
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
				5,
				'#ffebb0',
				10,
				'#e6dda1',
				20,
				'#cccf93',
				30,
				'#b2bf84',
				40,
				'#9cb378',
				50,
				'#86a66a',
				60,
				'#71995f',
				70,
				'#5b8a51',
				80,
				'#488047',
				90,
				'#35733d',
				100,
				'#226633',
			],
			'fill-opacity': active ? 0.75 : 0,
			'fill-antialias': true,
		},
	};

	const events = new Map([
		['click', e => {
			active && debug(e.features.length > 0 ? e.features[0] : null);
			active && e.features.length > [0] && setActiveSSURGOFeature(e.features[0]);
			// take the features geometry and add it to the map sources
			// create a outline layer and add it to the map

			// need to import the function to add feature data to the context
			// something to test: does the data of the 'active_ssurgo_feature' change when another feature gets clicked
		}],
	]);

	if (activeSSURGOFeature) {
		const activeSSURGOLayer = {
			id: 'active_ssurgo_feature',
			type: 'line',
			source: 'active_ssurgo_feature',
			paint: {
				'line-color': '#469AFD',
				'line-width': 4,
			},
		};
		return (
			<>
				<Layer map={map} layer={activeSSURGOLayer} />
				<Layer map={map} layer={SSURGOLayer} events={events} />
			</>
		);
	}

	return <Layer map={map} layer={SSURGOLayer} events={events} />;
};
