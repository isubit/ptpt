import _ from 'lodash';
import calcArea from '@turf/area';
import calcLength from '@turf/length';
import calcBuffer from '@turf/buffer';
import Debug from 'debug';

import csrRent from 'references/csr_rent.json';
import soilSeriesMoisture from 'references/soil_series_moisture.json';
import soilSeriesCSG from 'references/soil_series_csg.json';

import { promiseTimeout } from './promiseTimeout';

import {
	getPolygonCounty,
	linesToPolygon,
} from './geometry';

import {
	getTreeRows,
	getOptimalTreePlacements,
} from './sources';

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

	// Get tree rows and bounding polygon.
	let boundingPolygon;
	if (clone.properties.type === 'tree') {
		const rows = getTreeRows({
			...clone,
			properties: {
				...clone.properties,
				configs: {
					rows: [{}, {}, {}],
					spacing_rows: {
						value: 3,
						unit: 'feet',
					},
					propagation: 'N', // Placeholder, because it doesn't really matter, the width of the number of rows isn't large enough to span multiple ssurgo areas.
					...(clone.properties.configs || {}),
				},
			},
		});
		clone.properties.rows = rows.map(ea => ({
			type: ea.type,
			geometry: ea.geometry,
		}));
		boundingPolygon = linesToPolygon(rows);
		clone.properties.rowLength = calcLength(clone) * 1000; // meters
	}

	// For prairies, ensure seed price is a number.
	if (clone.properties.type === 'prairie' && clone.properties.configs) {
		clone.properties.configs.seed_price = Number(clone.properties.configs.seed_price) || 0;
	}

	// Acreage
	if (clone.properties.type === 'prairie') {
		clone.properties.acreage = calcArea(clone) * 0.000247105;
	} else {
		clone.properties.acreage = clone.properties.rowLength && clone.properties.configs && clone.properties.configs.spacing_rows ? (clone.properties.rows.length * clone.properties.rowLength * (clone.properties.configs.spacing_rows.value * 0.3048)) * 0.000247105 : 0;
	}

	if (clone.properties.type === 'prairie') {
		clone.properties.buffer = calcBuffer({
			type: clone.type,
			geometry: clone.geometry,
		}, 50, { units: 'feet' });
		clone.properties.bufferAcreage = (calcArea(clone.properties.buffer) * 0.000247105) - clone.properties.acreage;
	}

	// Tree Qty
	if (clone.properties.type === 'tree') {
		const treesPerRow = getOptimalTreePlacements(clone).length;
		clone.properties.treeQty = treesPerRow * clone.properties.rows.length;
	}

	// County and CSR Rent
	try {
		const county = await promiseTimeout(getPolygonCounty(clone), 10000);

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
		console.log(e);
		clone.properties = {
			...clone.properties,
			county: null,
			rent: 2.72, // Use average CSR rent of all counties.
		};
	}

	// Soils
	// For whatever reason, queryRenderedFeatures is inaccurate and only returns one polygon that doesn't even intersect the bbox.
	let ssurgo = [];
	let intersects = [];
	let ssurgoIntersects = [];
	try {
		ssurgo = map.querySourceFeatures('ssurgo', {
			sourceLayer: 'default',
		});

		intersects = await promiseTimeout(findSSURGOIntersects(boundingPolygon || clone, ssurgo), 10000);
		ssurgoIntersects = intersects.map(ea => ssurgo.find(mapunit => mapunit.properties.OBJECTID === ea));
	} catch (e) {
		debug(e);
	}

	if (ssurgo && ssurgo.length > 0) {
		clone.properties = {
			...clone.properties,
			ssurgo_intersect_data: ssurgoIntersects.map(ea => ea.properties),
			// eslint-disable-next-line no-confusing-arrow
			series: ssurgoIntersects.map(ea => soilSeriesMoisture[ea.properties.compname] ? [ea.properties.compname, {
				moisture: soilSeriesMoisture[ea.properties.compname],
				csg: soilSeriesCSG[ea.properties.compname] ? soilSeriesCSG[ea.properties.compname].toString() : null,
			}] : null).filter(ea => !!ea),
			csr: ssurgoIntersects.map(ea => ea.properties.iacornsr).filter(ea => !!ea),
		};
	}

	debug('Enriched!', clone);
	return clone;
}
