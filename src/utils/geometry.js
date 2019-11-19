import { point } from '@turf/helpers';
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
// Refer to https://bl.ocks.org/rveciana/e0565ca3bfcebedb12bbc2d4edb9b6b3 for complexities (i.e. concave shapes).

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
// Create a line that entends from the centroid in either direction, cast it to the ends of the coordinate system.

// findPerpendicularLine
// Find the line that is perpendicular to the given line, and intesects the given point.
// args:
// <LineString>
// <Point>
// returns:
// <LineString>
// Protocol:
// Find the slope of the given line.
// Find the perpendicular slope, the negative reciprocol.
// Create a line that extends from the given point in either direction, cast it to the ends of the coordinate system.

// findBearing
// Find the bearing degree of a line.
// args:
// <LineString>
// returns:
// Int, bearing degree
// Protocol:
// Find the bearing of the given line.

// findLineWithBearing
// Find the line that intersects the given point, with a given bearing degree:
// args:
// <Point>
// Int, bearing degree
// returns:
// <LineString>
// Protocol:
// Find the lineArc, using the given point, an arbitrary radius, 0 degrees as bearing1, and the bearing as bearing2.
// Draw a line from the given point to the end point of the lineArc.
// Create a line that extends from the given point in either direction, cast it to the ends of the coordinate system.

// might not need...
// Find the line that runs perpendicular to the given anchor line, with a given distance away from the given point on a given anchor line.
// args:
// <LineString>, anchor line
// <Point>, point on anchor line
// Int, distance in feet from the given point

// offsetLine
// Find the line that is offset the given line by a given distance.
// args:
// <LineString>
// Int, distance in feet to offset by
// returns:
// <LineString>
// Protocol:
// Find the lineOffset of the given line with the given distance.

// dotLine
// Find the points on the given line that are a given distance apart.
// args:
// <LineString>
// Int, distance in feet between each point
// returns:
// Array<Points>
// Protocol:
// Find the first point on the given line, find the perpendicular line that intersects this point.
// Find the lineOffset of the perpendicular line, offset the given distance.
// Find the intersect of the two lines.
// Repeat until there is no intersect.

// -----------------------------------

// We need to generate the edit icon, in the southern-most vertex of the polygon.

// findSouthernVertex
// Find the southern-most vertex of the given polygon.
// args:
// <Polygon>
// returns:
// <Point>
// Protocol:
// Sort the vertices by latitude. Find the point with the smallest latitude.
export function findSouthernVertex(polygon) {
	const feature = _.cloneDeep(polygon);
	const {
		geometry: {
			coordinates,
		},
	} = feature;
	const vertices = coordinates[0];
	const sorted = vertices.sort((a, b) => a[1] - b[1]);
	const vertex = sorted[0];
	return point(vertex);
}
