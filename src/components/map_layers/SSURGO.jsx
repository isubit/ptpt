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
				'#F8F8ED',
				10,
				'#F5F5E0',
				20,
				'#E6E5D2',
				30,
				'#E3E1B2',
				40,
				'#C1C9A0',
				50,
				'#AAB991',
				60,
				'#9BAF89',
				70,
				'#8CA47F',
				80,
				'#809C76',
				90,
				'#73926F',
				100,
				'#668867',
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
