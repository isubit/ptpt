/* eslint-disable no-useless-escape */
/* eslint-disable indent */
import React from 'react';
// import Debug from 'debug';

import { Layer } from './Layer';

// const debug = Debug('MapComponent');

export const SSURGO = props => {
	const {
		active,
		map,
		pathname,
		loadSSURGOPopupData,
		settouchStartLocation,
		touchStartLocation,
		SSURGOPopupData,
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

	// prevent click and touchevents if planting
	const events = new Map([
		['click', e => {
			!/^\/plant/.test(pathname) && active && e.features.length > [0] && loadSSURGOPopupData(e.features[0], e.lngLat);
		}],
		['touchstart', e => {
			!/^\/plant/.test(pathname) && active && settouchStartLocation(e.lngLat);
		}],
		['touchend', e => {
			!/^\/plant/.test(pathname) && active && touchStartLocation.lng === e.lngLat.lng && touchStartLocation.lat === e.lngLat.lat && loadSSURGOPopupData(e.features[0], e.lngLat);
		}],
	]);

	const activeSSURGOLayer = {
		id: 'active_ssurgo_feature',
		type: 'line',
		source: 'active_ssurgo_feature',
		paint: {
			'line-color': '#469AFD',
			'line-width': 4,
			'line-opacity': 1,
		},
	};

	return (
		<>
			{ SSURGOPopupData && <Layer map={map} layer={activeSSURGOLayer} /> }
			<Layer map={map} layer={SSURGOLayer} events={events} />
		</>
	);
};
