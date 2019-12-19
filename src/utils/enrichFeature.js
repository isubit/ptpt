import calcArea from '@turf/area';
import calcBbox from '@turf/bbox';
import _ from 'lodash';

import csrRent from 'references/csr_rent.json';
import soilSeriesCSG from 'references/soil_series_csg.json';

import {
	getPolygonCounty,
	linesToPolygon,
} from './geometry';

import { getTreeRows } from './sources';

export async function enrichFeature(feature, map) {
	const clone = _.cloneDeep(feature);

	clone.properties = clone.properties || {};

	let boundingPolygon;
	if (clone.properties.type === 'tree') {
		boundingPolygon = linesToPolygon(getTreeRows(clone));
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
	const bbox = calcBbox(boundingPolygon || clone);
	const ssurgo = map.queryRenderedFeatures([[bbox[0], bbox[1]], [bbox[2], bbox[3]]], {
		layers: ['ssurgo'],
	});

	if (ssurgo && ssurgo.length > 0) {
		const series = ssurgo[0].properties.compname;
		const csg = soilSeriesCSG[series] || null;
		clone.properties = {
			...clone.properties,
			series,
			csg,
		};
	}

	return clone;
}
