import {
	findSouthernVertex,
} from './geometry';

export function getPolygons(data = new Map()) {
	const features = [...data.values()];
	return features;
}

export function getEditIcons(data = new Map()) {
	const features = [...data.values()].map(ea => {
		const vertex = findSouthernVertex(ea);
		vertex.properties = {
			...vertex.properties,
			for: ea.id,
		};
		return vertex;
	});
	return features;
}
