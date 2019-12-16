/* eslint-disable no-undef */
import along from '@turf/along';
import calcBbox from '@turf/bbox';
import calcBearing from '@turf/bearing';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import calcCentroid from '@turf/centroid';
import calcDistance from '@turf/distance';
import lineArc from '@turf/line-arc';
import lineOffset from '@turf/line-offset';
import lineSplit from '@turf/line-split';
import {
	point as pointFeature,
	lineString as lineFeature,
	multiLineString as multiLineStringFeature,
} from '@turf/helpers';
import polygonToLine from '@turf/polygon-to-line';
import _ from 'lodash';

// A few methodologies for finding the longest lines that can fit within a polygon:

// Two-Vertices Method:
// To find the longest lines, we find the longest line between two vertices on a polygon. The vertices cannot be neighbors. This means the polygon must at least be a quadrilateral.
// There's probably a smarter way to do this, but we'll brute force it: Iterate through every combination of vertices and measure their distance.
// Once we've found the two furthest vertices, sort them by longitude (x-coordinate), draw a line through them, and find the slope of this line.
// Find the center of the line, and find the perpendicular slope (negative reciprocal). Draw an anchoring line using this slope, through the center point.
// Draw perpendicular lines with desired distance along this anchoring line.
// Truncate the lines so they fit inside the polygon.
// The problem with this method is that while it does produces the longest lines usually, they usually don't run in the "direction" of the polygon, which is usually a rectangle.
// Additionally, the lines aren't oriented around the centroid of the polygon either, making it hard to generate other lines using bearing degree.

// So, we'll use this method, Longest-Parallels Method:
// Generally, long rows should run parallel to the longest side of the polygon.
// Use the centroid of the polygon, and the slope of the longest side, to find the line that runs parallel to the longest side near the center of the polygon. This is the first row.
// Find the anchoring line that runs perpendicular to this first row. Save the bearing degrees for later, as we'll need it to regenerate the anchoring line.
// Extend the line on both sides of the center, and truncate it so it fits inside the polygon.
// Draw perpendicular lines with desired distance along this anchoring line for additional rows.
// Truncate the lines so they fit inside the polygon.


// Functions:

// fitLine
// Fit the given line within the boundaries of the given polygon.
// args:
// <LineString>
// <Polygon>
// returns:
// Array<LineString>
// Protocol:
// Find the lineSplits of the given line and polygon.
// Determine the lines that are within the polygon.
// Refer to https://bl.ocks.org/rveciana/e0565ca3bfcebedb12bbc2d4edb9b6b3 for complexities (i.e. concave shapes).
export function fitLine(line, polygon) {
	const lines = [];

	let multiLine = line;
	if (line.geometry.type === 'LineString') {
		multiLine = multiLineStringFeature([line.geometry.coordinates]);
	}

	multiLine.geometry.coordinates.forEach(part => {
		const split = lineSplit(lineFeature(part), polygon);
		// console.log(part, split.features.map(ea => ea.geometry.coordinates));

		// lineSplit unfortunately doesn't guarantee the order of the line segments... so we have to find the first point and "connect the dots".
		// This "sweep algorithm" sorts the line segments by longitude (x-axis), then runs a sweep to determine if there are any matches between end and start points.
		// const sorted = split.features.sort((a, b) => a.geometry.coordinates[0][0] - b.geometry.coordinates[0][0]);
		// console.log(sorted);
		// const reordered = [];
		// const firstPoint = split.features.find(ea => _.isEqual(ea.geometry.coordinates[0], part[0]));
		// const newList = split.features.reduce((arr, feature, index) => {

		// }, reordered);

		// lineSplit returns an array of lines that alternate "in" / "out" of the polygon.
		// As long as we can determine if the starting point of the first line is "in" or "out", we can determine what the other lines are.
		let oddPair;
		const inPoly = booleanPointInPolygon(pointFeature(part[0]), polygon);
		if (inPoly) {
			oddPair = 0;
		} else {
			oddPair = 1;
		}
		split.features.forEach((splitedPart, i) => {
			if ((i + oddPair) % 2 === 0) {
				lines.push(splitedPart);
			}
		});
	});

	return lines;
}

// findSlope
// Find the slope of a given line.
// args:
// <LineString>
// returns:
// Int, the slope of the line
// Protocol:
// y = mx + b
// (y2 - y1) / (x2 - x1)
export function findSlope(line) {
	const {
		geometry: {
			coordinates,
		},
	} = line;

	const coordinate1 = coordinates[0];
	const coordinate2 = coordinates[1];

	// (y2 - y1) / (x2 - x1)
	const slope = (coordinate2[1] - coordinate1[1]) / (coordinate2[0] - coordinate1[0]);
	return slope;
}

// castLineToBbox
// Cast a given line from a given point to the ends of a bounding box.
// args:
// Int, slope
// <Point>
// <Bbox>
// returns:
// <LineString>
// Protocol:
// Find the slope of the line.
// Calculate the endpoints of the new line, using the given point as a "starting point" [x,y] for the y = mx + b equation, and the bbox.
export function castLineToBbox(slope, point, bbox) {
	const yIntercept = point.geometry.coordinates[1] - (slope * point.geometry.coordinates[0]); // b = y - mx

	// Determine which axis to use as the range. Not very important, just ensures the line with the least "fat" at the ends past the intersection point of the bbox.
	let useAxis = 'x';
	if (Math.abs(slope) > 1) {
		useAxis = 'y'; // This is because when the absolute value of slope is greater than 1, y axis is changing faster than x axis.
	}

	// x = (y - b) / m
	// southernSegment: [ [?, ymin], [point] ]
	const southernCoord = [(bbox[1] - yIntercept) / slope, bbox[1]];
	// northernSegment: [ [point], [?, ymax] ]
	const northernCoord = [(bbox[3] - yIntercept) / slope, bbox[3]];

	// y = mx + b
	// westernSegment: [ [xmin, ?], [point] ]
	const westernCoord = [bbox[0], (slope * bbox[0]) + yIntercept];
	// easternSegment: [ [point], [xmax, ?] ]
	const easternCoord = [bbox[2], (slope * bbox[2]) + yIntercept];

	if (useAxis === 'y') {
		return lineFeature([southernCoord, northernCoord]);
	}

	return lineFeature([westernCoord, easternCoord]);
}


// findLongestParallel
// Find the line that runs parallel to the longest side of the given polygon, and intersects the centroid.
// args:
// <Polygon>
// returns:
// <LineString>
// Protocol:
// Find the longest side of the given polygon.
// Find the centroid of the given polygon.
// Find the slope of the longest side.
// Create a line that entends from the centroid in either direction, cast it to the ends of the bbox of the polygon.
export function findLongestParallel(polygon) {
	const line = polygonToLine(polygon);

	const {
		geometry: {
			coordinates,
		},
	} = line;

	const longestLine = coordinates.reduce((obj, coord, i) => {
		const {
			distance,
		} = obj;
		const nextCoord = coordinates[i + 1];
		if (!nextCoord) {
			return obj;
		}
		const thisDistance = calcDistance(coord, nextCoord, {
			units: 'meters',
		});
		if (thisDistance > distance) {
			return {
				distance: thisDistance,
				line: lineFeature([coord, nextCoord]),
			};
		}
		return obj;
	}, {
		distance: 0,
		line: null,
	}).line;

	const slope = findSlope(longestLine);
	const centroid = calcCentroid(polygon);
	const bbox = calcBbox(polygon);

	return castLineToBbox(slope, centroid, bbox);
}

// findPerpendicularLine
// Find the line that is perpendicular to the given line, and intersects the given point, and is bound by the given polygon.
// args:
// <LineString>
// <Point>
// <Polygon>
// returns:
// <LineString>
// Protocol:
// Find the slope of the given line.
// Find the perpendicular slope, the negative reciprocol: -1 / m
// Create a line that extends from the given point in either direction, cast it to the ends of the bbox of the polygon.
export function findPerpendicularLine(line, point, polygon) {
	const slope = findSlope(line);
	const negativeReciprocal = -1 / slope;
	const bbox = calcBbox(polygon);
	return castLineToBbox(negativeReciprocal, point, bbox);
}


// findBearing
// Find the bearing degree of a line.
// args:
// <LineString>
// returns:
// Int, bearing degree
// Protocol:
// Find the bearing of the given line.
export function findBearing(line) {
	const {
		geometry: {
			coordinates,
		},
	} = line;
	return calcBearing(coordinates[1], coordinates[0]);
}

// findLineWithBearing
// Find the line that intersects the given point, with a given bearing degree, and is bound by the given polygon.
// args:
// <Point>
// Int, bearing degree
// <Polygon>
// returns:
// <LineString>
// Protocol:
// Find the lineArc, using the given point, an arbitrary radius, 0 degrees as bearing1, and the bearing as bearing2.
// Draw a line from the given point to the end point of the lineArc.
// Create a line that extends from the given point in either direction, cast it to the ends of the coordinate system.
export function findLineWithBearing(point, bearing, polygon) {
	const arc = lineArc(point, 1, 0, bearing);
	const {
		geometry: {
			coordinates,
		},
	} = arc;
	const finalPoint = coordinates[coordinates.length - 1];

	const line = lineFeature([point.geometry.coordinates, finalPoint].sort((a, b) => a - b));
	const slope = findSlope(line);
	const centroid = calcCentroid(polygon);
	const bbox = calcBbox(polygon);

	return castLineToBbox(slope, centroid, bbox);
}

// offsetLine
// Find the line that is offset the given line by a given distance.
// args:
// <LineString>
// Int, distance in feet to offset by
// returns:
// <LineString>
// Protocol:
// Find the lineOffset of the given line with the given distance.
export function offsetLine(line, distance) {
	return lineOffset(line, distance * 0.3048, {
		units: 'meters',
	});
}

// dotLine
// Find the points on the given line that are a given distance apart.
// args:
// <LineString>
// Int, distance in feet between each point
// returns:
// Array<Points>
// Protocol:
// Iterate the points along the line.
export function dotLine(line, distance) {
	const {
		geometry: {
			coordinates,
		},
	} = line;

	const length = calcDistance(coordinates[0], coordinates[1], { units: 'meters' });
	const interations = length / (distance * 0.3048);
	const points = [];
	for (let i = 0, ii = Math.min(interations, 10000); i < ii; i += 1) {
		points.push(along(line, distance * 0.3048 * i, { units: 'meters' }));
	}

	return points;
}

// -----------------------------------

// We need to generate the edit icon, in the southern-most vertex of the polygon.

// findMaximaVertices
// Find the vertices of the given polygon that are northern-most, eastern-most, western-most, and southern-most.
// args:
// <Polygon> | <LineString>
// returns:
// <Point>
// Protocol:
// Sort the vertices by latitude. Find the point with the smallest latitude.
export function findMaximaVertices(feature) {
	const clone = _.cloneDeep(feature);
	const {
		geometry: {
			coordinates,
		},
	} = clone;

	const vertices = clone.geometry.type === 'Polygon' ? coordinates[0] : coordinates;
	const northern = pointFeature(vertices.sort((a, b) => b[1] - a[1])[0]);
	const southern = pointFeature(vertices.sort((a, b) => a[1] - b[1])[0]);
	const western = pointFeature(vertices.sort((a, b) => a[0] - b[0])[0]);
	const eastern = pointFeature(vertices.sort((a, b) => b[0] - a[0])[0]);
	return {
		northern,
		southern,
		western,
		eastern,
	};
}

// -----------------------------------

// We need to determine the county that a polygon exists in.

// getPolygonCounty
// Find the county that the centroid of the given polygon exists in.
// args:
// <Polygon>
// returns:
// String, country
// Protocol:
// Find the centroid of the polygon.
// Run the coordinates through Google Places API.
export async function getPolygonCounty(feature) {
	return new Promise((resolve, reject) => {
		const clone = _.cloneDeep(feature);

		const centroid = calcCentroid(clone);
		const {
			geometry: {
				coordinates,
			},
		} = centroid;

		const location = new google.maps.LatLng(coordinates[1], coordinates[0]);
		const geocoder = google.maps.Geocoder();
		geocoder.geocode({
			location,
		}, (res, status) => {
			if (status !== 'OK') {
				reject(new Error(`Geocoder status: ${status}`));
			} else {
				resolve(res);
			}
		});
	});
}
