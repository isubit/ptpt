/* eslint-disable no-unused-vars */
// import calcCentroid from '@turf/centroid';
import _ from 'lodash';

import {
	dotLine,
	// findBearing,
	// findLineWithBearing,
	findLongestParallel,
	// findPerpendicularLine,
	findMaximaVertices,
	fitLine,
	offsetLine,
} from './geometry';

export function getPolygons(data = new Map()) {
	const features = [...data.values()];
	return features;
}

export function getEditIcons(data = new Map()) {
	const features = [...data.values()].map(ea => {
		const vertex = findMaximaVertices(ea).southern;
		vertex.properties = {
			...vertex.properties,
			for: ea.id,
		};
		return vertex;
	});
	return features;
}

export function getTreeRows(polygon, rowDistance) {
	const parallel = findLongestParallel(polygon);

	const offsets = [
		offsetLine(parallel, rowDistance),
		parallel,
		offsetLine(parallel, 0 - rowDistance),
	];

	const fitted = _.flatten(offsets.map(ea => fitLine(ea, polygon)));

	return fitted;
}

export function getOptimalTreePlacements(polygon, rowDistance = 10, treeDistance = 10) {
	const offsets = getTreeRows(polygon, rowDistance);

	const trees = _.flatten(offsets.map(ea => dotLine(ea, treeDistance, polygon)));

	return trees;
}
