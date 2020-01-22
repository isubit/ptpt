import React from 'react';
import geojsonhint from '@mapbox/geojsonhint';
import uuid from 'uuid/v4';
import _ from 'lodash';
import Debug from 'debug';

import {
	geocodeByAddress,
	getLatLng,
} from 'react-places-autocomplete';

const debug = Debug('MapState');

export const MapDefaultState = {
	// Data
	data: new Map(),

	// Google Maps API
	mapAPILoaded: false,

	// Device / Browser Geolocation API
	geolocationSupported: !!(navigator && navigator.geolocation && navigator.geolocation.getCurrentPosition),
	awaitingGeolocation: false,
	geolocationError: null,
	lastGeolocationStatus: null,
	lastGeolocationResult: null,

	// Map State
	defaultLatLng: [-93.624287, 41.587537],
	defaultZoom: 13,
	defaultBearing: 0,
	defaultPitch: 0,
	currentMapDetails: {
		latlng: null,
		zoom: null,
		bearing: null,
		pitch: null,
	},

	// Location Input
	locationAddress: {
		locationSearchInput: '',
		addressName: '',
		latlng: null,
	},

	// Map Layer States
	basemap: 'outdoor',
	layers: {
		ssurgo: false,
		lidar: false,
		contours: false,
	},
};

// // Test data...
// MapDefaultState.data.set('4b90624007a667f5bcd420e03ffb4119', {
// 	id: '4b90624007a667f5bcd420e03ffb4119',
// 	type: 'Feature',
// 	properties: {
// 		type: 'tree',
// 		configs: {
// 			pasture_conversion: true,
// 			propagation: 'N',
// 			windbreak: true,
// 			rows: [
// 				{
// 					type: '9EmOC874',
// 					species: 'bCZzj69Cl',
// 				},
// 				{
// 					type: 'lJEh5tsIx',
// 					species: 'bt3x5SyDGi',
// 				},
// 				{
// 					type: '77l_gl54Q',
// 					species: '00SrGSjqwU',
// 				},
// 			],
// 			spacing_rows: {
// 				value: 50,
// 				unit: 'feet',
// 			},
// 			spacing_trees: {
// 				value: 20,
// 				unit: 'feet',
// 			},
// 			stock_size: 'MncAVRtr',
// 			drip_irrigation: false,
// 		},
// 		rows: [
// 			{
// 				type: 'Feature',
// 				geometry: {
// 					type: 'LineString',
// 					coordinates: [
// 						[
// 							-93.26004483106749,
// 							40.85133151022609,
// 						],
// 						[
// 							-93.25516671501643,
// 							40.85137650841315,
// 						],
// 					],
// 				},
// 			},
// 			{
// 				type: 'Feature',
// 				geometry: {
// 					type: 'LineString',
// 					coordinates: [
// 						[
// 							-93.26004609529083,
// 							40.85146856081873,
// 						],
// 						[
// 							-93.25516797923977,
// 							40.851513559005795,
// 						],
// 					],
// 				},
// 			},
// 			{
// 				type: 'Feature',
// 				geometry: {
// 					type: 'LineString',
// 					coordinates: [
// 						[
// 							-93.26004735951419,
// 							40.85160561141137,
// 						],
// 						[
// 							-93.25516924346313,
// 							40.85165060959844,
// 						],
// 					],
// 				},
// 			},
// 		],
// 		rowLength: 410.32382399605575,
// 		acreage: 4.635691093125094,
// 		county: 'Wayne',
// 		rent: 2.48,
// 		ssurgo_intersect_data: [
// 			{
// 				OBJECTID: 28540,
// 				musym: '312C2',
// 				muname: 'Seymour silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 56,
// 				compname: 'Seymour',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 29842,
// 				musym: '222C2',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 28,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 25198,
// 				musym: '231',
// 				muname: 'Edina silt loam, 0 to 2 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 59,
// 				compname: 'Edina',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argialbolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Albolls',
// 				taxgrtgroup: 'Argialbolls',
// 				taxsubgrp: 'Vertic Argialbolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 		],
// 		series: [
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Edina',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 		],
// 		csr: [
// 			56,
// 			28,
// 			59,
// 		],
// 	},
// 	geometry: {
// 		coordinates: [
// 			[
// 				-93.26004483106749,
// 				40.85133151022609,
// 			],
// 			[
// 				-93.25516671501643,
// 				40.85137650841315,
// 			],
// 		],
// 		type: 'LineString',
// 	},
// });

// MapDefaultState.data.set('7e1429253027d76f17b70c62496ec9da', {
// 	id: '7e1429253027d76f17b70c62496ec9da',
// 	type: 'Feature',
// 	properties: {
// 		type: 'prairie',
// 		acreage: 48.18297132338516,
// 		buffer: {
// 			type: 'Feature',
// 			properties: {},
// 			geometry: {
// 				type: 'Polygon',
// 				coordinates: [
// 					[
// 						[
// 							-93.26005997155397,
// 							40.84664693113468,
// 						],
// 						[
// 							-93.26005735581374,
// 							40.84666707868583,
// 						],
// 						[
// 							-93.26004960854827,
// 							40.84668645633331,
// 						],
// 						[
// 							-93.26003702580365,
// 							40.84670432360052,
// 						],
// 						[
// 							-93.26002008840398,
// 							40.846719997727476,
// 						],
// 						[
// 							-93.25999944357771,
// 							40.8467328797609,
// 						],
// 						[
// 							-93.25997588022511,
// 							40.846742477441666,
// 						],
// 						[
// 							-93.25995029877204,
// 							40.84674842401535,
// 						],
// 						[
// 							-93.2599236767619,
// 							40.846750492246656,
// 						],
// 						[
// 							-93.25010037488737,
// 							40.846783518687744,
// 						],
// 						[
// 							-93.25007471826483,
// 							40.84678177157147,
// 						],
// 						[
// 							-93.2500499484972,
// 							40.84677641963544,
// 						],
// 						[
// 							-93.2500269425824,
// 							40.84676765236934,
// 						],
// 						[
// 							-93.25000651506731,
// 							40.84675578018553,
// 						],
// 						[
// 							-93.24998938920811,
// 							40.84674122342876,
// 						],
// 						[
// 							-93.24997617136258,
// 							40.84672449749364,
// 						],
// 						[
// 							-93.24996732952145,
// 							40.84670619457688,
// 						],
// 						[
// 							-93.24996317673882,
// 							40.84668696271013,
// 						],
// 						[
// 							-93.24978854026088,
// 							40.84473837168456,
// 						],
// 						[
// 							-93.24978941161905,
// 							40.84471777004043,
// 						],
// 						[
// 							-93.24979565897218,
// 							40.844697706960964,
// 						],
// 						[
// 							-93.2498070348538,
// 							40.84467897717387,
// 						],
// 						[
// 							-93.24982308864918,
// 							40.844662322593926,
// 						],
// 						[
// 							-93.24984318444479,
// 							40.84464840293431,
// 						],
// 						[
// 							-93.24986652621783,
// 							40.844637769574284,
// 						],
// 						[
// 							-93.24989218936774,
// 							40.844630843717916,
// 						],
// 						[
// 							-93.24991915734083,
// 							40.84462789970933,
// 						],
// 						[
// 							-93.2599170956933,
// 							40.844297623814626,
// 						],
// 						[
// 							-93.25994463133415,
// 							40.84429881790982,
// 						],
// 						[
// 							-93.25997129179503,
// 							40.84430416297365,
// 						],
// 						[
// 							-93.25999599500594,
// 							40.84431344206467,
// 						],
// 						[
// 							-93.26001773833596,
// 							40.84432627857023,
// 						],
// 						[
// 							-93.26003563928705,
// 							40.84434215149231,
// 						],
// 						[
// 							-93.2600489713121,
// 							40.844360416593574,
// 						],
// 						[
// 							-93.26005719330323,
// 							40.84438033254547,
// 						],
// 						[
// 							-93.26005997155397,
// 							40.844401091016756,
// 						],
// 						[
// 							-93.26005997155397,
// 							40.84664693113468,
// 						],
// 					],
// 				],
// 			},
// 		},
// 		bufferAcreage: 6.191482200806469,
// 		county: 'Wayne',
// 		rent: 2.48,
// 		ssurgo_intersect_data: [
// 			{
// 				OBJECTID: 25137,
// 				musym: '312C2',
// 				muname: 'Seymour silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 56,
// 				compname: 'Seymour',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 33109,
// 				musym: '312C',
// 				muname: 'Seymour silt loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 58,
// 				compname: 'Seymour',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Aquertic Argiudolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 27016,
// 				musym: '24E',
// 				muname: 'Shelby loam, 14 to 18 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 32,
// 				compname: 'Shelby',
// 				compkind: 'Series',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Typic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Typic Argiudolls',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 25739,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 31767,
// 				musym: '222C2',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 28,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 35264,
// 				musym: '13B',
// 				muname: 'Zook-Olmitz-Vesser complex, 0 to 5 percent slopes',
// 				mukind: 'Complex',
// 				iacornsr: 68,
// 				compname: 'Zook',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Cumulic Vertic Endoaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Endoaquolls',
// 				taxsubgrp: 'Cumulic Vertic Endoaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 32411,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 33109,
// 				musym: '312C',
// 				muname: 'Seymour silt loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 58,
// 				compname: 'Seymour',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Aquertic Argiudolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 35514,
// 				musym: '93D2',
// 				muname: 'Shelby-Adair complex, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Complex',
// 				iacornsr: 32,
// 				compname: 'Shelby',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Mollic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Mollic Hapludalfs',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 34650,
// 				musym: '192C2',
// 				muname: 'Adair clay loam, heavy till, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 29,
// 				compname: 'Adair',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Aquertic Hapludalfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 35803,
// 				musym: '192D2',
// 				muname: 'Adair clay loam, heavy till, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 9,
// 				compname: 'Adair',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Aquertic Hapludalfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 28428,
// 				musym: '451D3',
// 				muname: 'Caleb clay loam, 9 to 14 percent slopes, severely eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 36,
// 				compname: 'Caleb',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Typic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Typic Hapludalfs',
// 				taxpartsize: 'fine-loamy',
// 			},
// 			{
// 				OBJECTID: 33287,
// 				musym: '222C2',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 28,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 35780,
// 				musym: '13B',
// 				muname: 'Zook-Olmitz-Vesser complex, 0 to 5 percent slopes',
// 				mukind: 'Complex',
// 				iacornsr: 68,
// 				compname: 'Zook',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Cumulic Vertic Endoaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Endoaquolls',
// 				taxsubgrp: 'Cumulic Vertic Endoaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 35000,
// 				musym: '24D2',
// 				muname: 'Shelby clay loam, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 51,
// 				compname: 'Shelby',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Mollic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Mollic Hapludalfs',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 34810,
// 				musym: '222D2',
// 				muname: 'Clarinda silty clay loam, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 8,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 34610,
// 				musym: '24D2',
// 				muname: 'Shelby clay loam, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 51,
// 				compname: 'Shelby',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Mollic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Mollic Hapludalfs',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 34972,
// 				musym: '312C',
// 				muname: 'Seymour silt loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 58,
// 				compname: 'Seymour',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Aquertic Argiudolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 25739,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 31767,
// 				musym: '222C2',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 28,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 33109,
// 				musym: '312C',
// 				muname: 'Seymour silt loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 58,
// 				compname: 'Seymour',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Aquertic Argiudolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 27016,
// 				musym: '24E',
// 				muname: 'Shelby loam, 14 to 18 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 32,
// 				compname: 'Shelby',
// 				compkind: 'Series',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Typic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Typic Argiudolls',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 25739,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 32411,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 33109,
// 				musym: '312C',
// 				muname: 'Seymour silt loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 58,
// 				compname: 'Seymour',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Argiudolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Udolls',
// 				taxgrtgroup: 'Argiudolls',
// 				taxsubgrp: 'Aquertic Argiudolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Udic',
// 			},
// 			{
// 				OBJECTID: 35803,
// 				musym: '192D2',
// 				muname: 'Adair clay loam, heavy till, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 9,
// 				compname: 'Adair',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Aquertic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Aquertic Hapludalfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 33287,
// 				musym: '222C2',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 28,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 			{
// 				OBJECTID: 35780,
// 				musym: '13B',
// 				muname: 'Zook-Olmitz-Vesser complex, 0 to 5 percent slopes',
// 				mukind: 'Complex',
// 				iacornsr: 68,
// 				compname: 'Zook',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Cumulic Vertic Endoaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Endoaquolls',
// 				taxsubgrp: 'Cumulic Vertic Endoaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 35000,
// 				musym: '24D2',
// 				muname: 'Shelby clay loam, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 51,
// 				compname: 'Shelby',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine-loamy, mixed, superactive, mesic Mollic Hapludalfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Udalfs',
// 				taxgrtgroup: 'Hapludalfs',
// 				taxsubgrp: 'Mollic Hapludalfs',
// 				taxpartsize: 'fine-loamy',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 34810,
// 				musym: '222D2',
// 				muname: 'Clarinda silty clay loam, 9 to 14 percent slopes, moderately eroded',
// 				mukind: 'Consociation',
// 				iacornsr: 8,
// 				compname: 'Clarinda',
// 				compkind: 'Taxadjunct',
// 				taxclname: 'Fine, smectitic, mesic Vertic Epiaqualfs',
// 				taxorder: 'Alfisols',
// 				taxsuborder: 'Aqualfs',
// 				taxgrtgroup: 'Epiaqualfs',
// 				taxsubgrp: 'Vertic Epiaqualfs',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Typic',
// 			},
// 			{
// 				OBJECTID: 25739,
// 				musym: '222C',
// 				muname: 'Clarinda silty clay loam, 5 to 9 percent slopes',
// 				mukind: 'Consociation',
// 				iacornsr: 31,
// 				compname: 'Clarinda',
// 				compkind: 'Series',
// 				taxclname: 'Fine, smectitic, mesic Vertic Argiaquolls',
// 				taxorder: 'Mollisols',
// 				taxsuborder: 'Aquolls',
// 				taxgrtgroup: 'Argiaquolls',
// 				taxsubgrp: 'Vertic Argiaquolls',
// 				taxpartsize: 'fine',
// 				taxmoistscl: 'Aquic',
// 			},
// 		],
// 		series: [
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Zook',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Adair',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Adair',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Caleb',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Zook',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Seymour',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Adair',
// 				{
// 					moisture: 'wet-mesic',
// 					csg: '1',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Zook',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Shelby',
// 				{
// 					moisture: 'mesic',
// 					csg: '3',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 			[
// 				'Clarinda',
// 				{
// 					moisture: 'hydric',
// 					csg: '2',
// 				},
// 			],
// 		],
// 		csr: [
// 			56,
// 			58,
// 			32,
// 			31,
// 			28,
// 			68,
// 			31,
// 			58,
// 			32,
// 			29,
// 			9,
// 			36,
// 			28,
// 			68,
// 			51,
// 			8,
// 			51,
// 			58,
// 			31,
// 			28,
// 			58,
// 			32,
// 			31,
// 			31,
// 			58,
// 			9,
// 			28,
// 			68,
// 			51,
// 			8,
// 			31,
// 		],
// 		configs: {
// 			seed: 'ffDsyk50A',
// 			seed_price: 88.33,
// 			management: {
// 				id: 'J8wEfx7P',
// 				display: 'mow',
// 			},
// 			cropping_system: {
// 				id: 1,
// 				display: 'Corn Rotation',
// 			},
// 			pest_control: {
// 				id: 1,
// 				display: 'Pest Control',
// 			},
// 		},
// 	},
// 	geometry: {
// 		coordinates: [
// 			[
// 				[
// 					-93.25992306830904,
// 					40.84664693113467,
// 				],
// 				[
// 					-93.25009976643452,
// 					40.84667995762737,
// 				],
// 				[
// 					-93.24992512995658,
// 					40.84473136639585,
// 				],
// 				[
// 					-93.25992306830904,
// 					40.84440109101678,
// 				],
// 				[
// 					-93.25992306830904,
// 					40.84664693113467,
// 				],
// 			],
// 		],
// 		type: 'Polygon',
// 	},
// });

export const MapContext = React.createContext(MapDefaultState);
export const MapProvider = MapContext.Provider;
export const MapConsumer = MapContext.Consumer;

export const MapActions = (that) => {
	const actions = {
		async addData(geojson) {
			// Add geojson feature data.
			const errors = geojsonhint.hint(geojson);
			if (!errors || errors.length === 0 || (errors.length === 1 && errors[0].message.includes('right-hand rule'))) {
				if (geojson.type === 'FeatureCollection') {
					geojson.features.forEach(ea => this.addData(ea));
				} else {
					// Create new map.
					const data = new Map(that.state.MapState.data);

					// Clone the geojson.
					const feature = _.cloneDeep(geojson);

					// If feature doesn't have an id, give it one first.
					if (!feature.id) {
						feature.id = uuid();
					}

					data.set(feature.id, feature);

					// Rebuild a new state object with new data.
					that.setState(state => ({
						MapState: {
							...state.MapState,
							data,
						},
					}), () => {
						debug('Saved data:', that.state.MapState.data);
					});
				}
			} else {
				debug('Error adding data to context:', errors);
			}
		},
		deleteData(id) {
			// Delete data using id.
			const data = new Map(that.state.MapState.data);
			data.delete(id);

			that.setState(state => ({
				MapState: {
					...state.MapState,
					data,
				},
			}));
		},
		setBasemap(basemapName) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					basemap: basemapName,
				},
			}));
		},
		setMapLayer(layerName) {
			// Set map layer given layer name
			const { layers } = that.state.MapState;
			if (Object.prototype.hasOwnProperty.call(layers, layerName)) {
				layers[layerName] = !layers[layerName];
			}
			that.setState(state => ({
				MapState: {
					...state.MapState,
					layers,
				},
			}));
		},
		setMapAPILoaded() {
			if (!that.state.mapAPILoaded) {
				that.setState(state => ({
					MapState: {
						...state.MapState,
						mapAPILoaded: true,
					},
				}));
			}
		},
		updateCurrentMapDetails(mapDetails) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					currentMapDetails: {
						...mapDetails,
					},
				},
			}));
		},
		setAddressLatLng() {
			const {
				MapState: {
					defaultZoom,
					defaultBearing,
					defaultPitch,
					locationAddress: {
						locationSearchInput,
					},
				},
			} = that.state;

			return geocodeByAddress(locationSearchInput)
				.then(results => Promise.all([results, getLatLng(results[0])]))
				.then((results) => {
					let address = results[0];
					const { lat, lng } = results[1];
					if (!address || address.length === 0) {
						throw new Error('No results found.');
					} else {
						[address] = address;
					}
					const addressName = `${address.address_components[0].long_name}, ${address.address_components[1].long_name}`;
					that.setState(state => ({
						MapState: {
							...state.MapState,
							// reset zoom, bearing, and pitch
							currentMapDetails: {
								zoom: defaultZoom,
								bearing: defaultBearing,
								pitch: defaultPitch,
								latlng: [lng, lat],
							},
							locationAddress: {
								...state.MapState.locationAddress,
								addressName,
								latlng: [lng, lat],
							},
						},
					}));
				})
				.catch(error => debug('React places geocode error:', error));
		},
		setLocationSearchInput(locationSearchInput, callbackSetLatLng = false) {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					locationAddress: {
						...state.MapState.locationAddress,
						locationSearchInput,
					},
				},
			}), () => {
				if (callbackSetLatLng) {
					actions.setAddressLatLng();
				}
			});
		},
		setMapPreviouslyLoaded() {
			that.setState(state => ({
				MapState: {
					...state.MapState,
					mapPreviouslyLoaded: true,
				},
			}));
		},
		promptCurrentGeolocation() {
			function get() {
				navigator.geolocation.getCurrentPosition(pos => {
					debug('Current geolocation:', pos);
					const {
						latitude,
						longitude,
					} = pos.coords;

					that.setState(state => ({
						MapState: {
							...state.MapState,
							awaitingGeolocation: false,
							currentMapDetails: {
								...state.MapState.currentMapDetails,
								latlng: [longitude, latitude],
							},
							lastGeolocationResult: [longitude, latitude],
						},
					}));
				}, err => {
					debug('Geolocation error:', err);
					that.setState(state => ({
						MapState: {
							...state.MapState,
							awaitingGeolocation: false,
							geolocationError: err.code,
							lastGeolocationResult: null,
						},
					}));
				});
			}

			if (that.state.MapState.geolocationSupported) {
				navigator.permissions.query({ name: 'geolocation' })
					.then(({ state: status }) => {
						that.setState(state => ({
							MapState: {
								...state.MapState,
								lastGeolocationStatus: status,
							},
						}), () => {
							if (status === 'granted') {
								get();
							} else {
								that.setState(state => ({
									MapState: {
										...state.MapState,
										awaitingGeolocation: true,
									},
								}), get);
							}
						});
					});
			} else {
				debug('Geolocation not supported.');
				that.setState(state => ({
					MapState: {
						...state.MapState,
						awaitingGeolocation: false,
						geolocationError: 2,
					},
				}));
			}
		},
	};
	return actions;
};
