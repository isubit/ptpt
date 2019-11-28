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
	findSlope,
	offsetLine,
} from './geometry';

export function getFeatures(data = new Map()) {
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

export function getTreeRows(line) {
	const {
		configs: {
			propagation = 'N',
			spacing_rows = {},
			rows = [],
		},
	} = line.properties;

	const rowDistance = spacing_rows.value;
	const quantity = rows.length;

	if (!propagation || !['N', 'S', 'W', 'E'].includes(propagation)) {
		throw new Error('getTreeRows expects a propagation direction of N, S, W, or E.');
	}

	let direction = 1;

	// Assuming a positive slope, northern or western propagation actually entails moving negatively on the x-axis.
	if (propagation === 'N' || propagation === 'W') {
		direction = -1;
	}

	// If slope is actually negative, reverse direction.
	const slope = findSlope(line);
	if (slope < 0) {
		direction = 0 - direction;
	}

	const offsets = [];

	for (let i = 0, ii = quantity; i < ii; i += 1) {
		offsets.push(offsetLine(
			line,
			rowDistance * direction * i,
		));
	}

	return offsets;
}

export function getOptimalTreePlacements(line) {
	const {
		configs: {
			spacing_trees = {},
		},
	} = line.properties;

	const treeDistance = spacing_trees.value;

	const offsets = getTreeRows(line);

	const trees = _.flatten(offsets.map(ea => dotLine(ea, treeDistance)));

	return trees;
}
