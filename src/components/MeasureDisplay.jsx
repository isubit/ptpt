import React from 'react';
import calcArea from '@turf/area';
import calcLength from '@turf/length';

export class MeasureDisplay extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			distanceUnits: 'ft',
			areaUnits: 'acres',
		};
	}

	setUnits = (type, value) => {
		this.setState({
			[`${type}Units`]: value,
		});
	}

	render() {
		const {
			setUnits,
		} = this;

		const {
			feature,
			onClear,
		} = this.props;

		const {
			distanceUnits,
			areaUnits,
		} = this.state;

		let distance;
		let area;
		if (feature.type === 'LineString') {
			distance = calcLength(feature); // length of linestring in km
			// Convert to target unit.
			switch (distanceUnits) {
				case 'ft':
					distance *= 3280.8399;
					distance = distance.toFixed(0);
					break;
				case 'm':
					distance *= 1000;
					distance = distance.toFixed(0);
					break;
				case 'mi':
					distance *= 0.62137119;
					distance = distance.toFixed(2);
					break;
				default:
					distance = distance.toFixed(2);
					break;
			}
		} else if (feature.type === 'Polygon') {
			area = calcArea(feature); // area of the polygon in sq m
			// Convert to target unit.
			switch (areaUnits) {
				case 'acres':
					area /= 4046.8564224;
					area = area.toFixed(2);
					break;
				case 'sq ft':
					area *= 10.76391041671;
					area = area.toFixed(0);
					break;
				case 'sq mi':
					area /= 2589988.1103;
					area = area.toFixed(2);
					break;
				case 'sq km':
					area /= 1000000;
					area = area.toFixed(2);
					break;
				default:
					area = area.toFixed(0);
					break;
			}
		}

		return (
			<div className="MeasureDisplay">
				<div>
					<span>Distance:</span>
					<span>{distance || '\u2014'}</span>
					<select value={distanceUnits} onChange={e => setUnits('distance', e.target.value)}>
						<option>ft</option>
						<option>m</option>
						<option>km</option>
						<option>mi</option>
					</select>
				</div>
				<div>
					<span>Area:</span>
					<span>{area || '\u2014'}</span>
					<select value={areaUnits} onChange={e => setUnits('area', e.target.value)}>
						<option>acres</option>
						<option>sq ft</option>
						<option>sq m</option>
						<option>sq km</option>
						<option>sq mi</option>
					</select>
				</div>
				{area === undefined ? <p className="Hint">Continue clicking to create a shape.</p> : null}
				<span className="modal-link" onClick={onClear} onKeyPress={onClear} role="button" tabIndex={0}>Clear</span>
			</div>
		);
	}
}
