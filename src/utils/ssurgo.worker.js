/* eslint-disable */
import calcIntersect from '@turf/intersect';
import calcContains from '@turf/boolean-contains';
import calcWithin from '@turf/boolean-within';
import calcOverlap from '@turf/boolean-overlap';


onmessage = e => {
	const {
		feature,
		mapunits,
	} = e.data;

	const intersects = [];

	function compute() {
		if (mapunits.length === 0) {
			console.timeEnd('intersects');
			postMessage({intersects});
		} else {
			const mapunit = mapunits.shift();
			let intersect;
			try {
				intersect = calcContains(mapunit, feature) || calcWithin(mapunit, feature) || calcOverlap(mapunit, feature);
			} catch(e) {
				intersect = false;
			}
			intersect && intersects.push(mapunit.id);
			setImmediate(compute);
		}
		return true;
	}

	postMessage('Received data.');

	console.time('intersects');
	compute();
};
