import calcArea from '@turf/area';
import _ from 'lodash';
import Debug from 'debug';

import csrRent from 'references/csr_rent.json';
import soilSeriesClassification from 'references/soil_series_classification.json';

import {
	getPolygonCounty,
	linesToPolygon,
} from './geometry';

import { getTreeRows } from './sources';

// eslint-disable-next-line
import Worker from './ssurgo.worker.js';

const debug = Debug('Enrichment');

async function findSSURGOIntersects(feature, mapunits) {
	const worker = new Worker();

	return new Promise(resolve => {
		worker.postMessage({
			feature,
			mapunits: mapunits.map(ea => ({
				id: ea.properties.OBJECTID || null,
				type: 'Feature',
				geometry: ea.geometry,
			})),
		});

		worker.onmessage = (event) => {
			if (event.data.intersects) {
				resolve(event.data.intersects);
			}
		};
	});
}

export async function enrichment(feature, map) {
	debug('Enriching:', feature);
	const clone = _.cloneDeep(feature);

	clone.properties = clone.properties || {};

	let boundingPolygon;
	if (clone.properties.type === 'tree') {
		boundingPolygon = linesToPolygon(getTreeRows({
			...clone,
			properties: {
				...clone.properties,
				configs: {
					...(clone.properties.configs || {}),
					rows: [{}, {}, {}],
					spacing_rows: {
						value: 3,
						unit: 'feet',
					},
					propagation: 'N', // Placeholder, because it doesn't really matter, the width of the number of rows isn't large enough to span multiple ssurgo areas.
				},
			},
		}));
	}

	// Acreage
	clone.properties.acreage = (boundingPolygon ? calcArea(boundingPolygon) : calcArea(clone)) * 0.000247105;

	// County and CSR Rent
	try {
		const county = await getPolygonCounty(clone);

		if (!county) {
			throw new Error('No country returned.');
		}

		if (!csrRent[county]) {
			throw new Error(`Couldn't find CSR rent for county: ${county}`);
		}

		clone.properties = {
			...clone.properties,
			county,
			rent: csrRent[county],
		};
	} catch (e) {
		clone.properties = {
			...clone.properties,
			county: null,
			rent: null,
		};
	}

	// Soils
	// For whatever reason, queryRenderedFeatures is inaccurate and only returns one polygon that doesn't even intersect the bbox.
	// const bbox = calcBbox(boundingPolygon || clone);
	// console.log(bbox);
	// const ssurgo = map.queryRenderedFeatures([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
	// 	layers: ['ssurgo'],
	// });
	const ssurgo = map.querySourceFeatures('ssurgo', {
		sourceLayer: 'default',
	});
		// .filter(ea => calcIntersect(ea, boundingPolygon || clone));

	// async function stagger() {
	// 	return new Promise(resolve => {
	// 		const results = [];
	// 		const slices = [];
	// 		const chunk = 50;
	// 		const delay = 0;

	// 		for (let i = 0, ii = ssurgo.length; i < ii; i += chunk) {
	// 			const slice = ssurgo.slice(i, i + chunk);
	// 			slices.push(slice);
	// 		}

	// 		async function run() {
	// 			if (slices.length === 0) {
	// 				resolve(results);
	// 				return;
	// 			}
	// 			const slice = slices.shift();
	// 			const result = await findSSURGOIntersects(boundingPolygon || clone, slice);
	// 			results.push(result);
	// 			setTimeout(run, delay);
	// 		}

	// 		run();
	// 	});
	// }
	// const intersects = await stagger();

	const intersects = await findSSURGOIntersects(boundingPolygon || clone, ssurgo);
	const ssurgoIntersects = intersects.map(ea => ssurgo.find(mapunit => mapunit.properties.OBJECTID === ea));

	if (ssurgo && ssurgo.length > 0) {
		clone.properties = {
			...clone.properties,
			ssurgo_intersect_data: ssurgoIntersects.map(ea => ea.properties),
			// eslint-disable-next-line no-confusing-arrow
			series: ssurgoIntersects.map(ea => soilSeriesClassification[ea.properties.compname] ? [ea.properties.compname, soilSeriesClassification[ea.properties.compname]] : null).filter(ea => !!ea),
			csr: ssurgoIntersects.map(ea => ea.properties.iacornsr).filter(ea => !!ea),
		};
	}

	return clone;
}
