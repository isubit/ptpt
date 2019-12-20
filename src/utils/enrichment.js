import calcArea from '@turf/area';
import calcIntersect from '@turf/intersect';
import _ from 'lodash';
import Debug from 'debug';

import csrRent from 'references/csr_rent.json';

import {
	getPolygonCounty,
	linesToPolygon,
} from './geometry';

import { getTreeRows } from './sources';

const debug = Debug('Enrichment');

// export async function enrichment(feature, map) {
// 	const clone = _.cloneDeep(feature);

// 	return {
// 		boundingTreePolygon() {
// 			return clone.properties.type === 'tree' && clone.properties.config ? linesToPolygon(getTreeRows({
// 				...clone,
// 				properties: {
// 					...clone.properties,
// 					config: {
// 						...(clone.properties.config || {}),
// 						propagation: 'N', // Placeholder, because it doesn't really matter, the width of the number of rows isn't large enough to span multiple ssurgo areas.
// 					}
// 				}
// 			})) : null;
// 		},
// 		acreage() {
// 			return calcArea(this.boundingTreePolygon() || clone) * 0.000247105;
// 		},
// 		async countyRent() {
// 			let county = null;
// 			let rent = null;
// 			try {
// 				county = await getPolygonCounty(clone);
// 				rent = county ? csrRent[county] || null : null;
// 			} catch (e) {
// 				debug('There was an issue quering polygon county.');
// 			}
// 			return {
// 				county,
// 				rent,
// 			};
// 		},
// 		ssurgo() {
// 			const bbox = calcBbox(this.boundingTreePolygon() || clone);
// 			const ssurgo = map.queryRenderedFeatures([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
// 				layers: ['ssurgo'],
// 			});
// 			console.log(ssurgo);

// 			let series = [];
// 			let csr = [];
// 			if (ssurgo && ssurgo.length > 0) {
// 				series = ssurgo.map(ea => ea.properties.compname);
// 				csr = ssurgo.map(ea => ea.properties.iacornsr);
// 			}

// 			return {
// 				series,
// 				csr,
// 			};
// 		},
// 	};
// }

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
	})
		.filter(ea => calcIntersect(ea, boundingPolygon || clone));

	if (ssurgo && ssurgo.length > 0) {
		clone.properties = {
			...clone.properties,
			series: ssurgo.map(ea => ea.properties.compname).filter(ea => !!ea),
			csr: ssurgo.map(ea => ea.properties.iacornsr).filter(ea => !!ea),
		};
	}

	return clone;
}
