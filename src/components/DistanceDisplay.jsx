import React from 'react';

export class DistanceDisplay extends React.Component {
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
			distance,
			area,
			onClear,
		} = this.props;

		const {
			distanceUnits,
			areaUnits,
		} = this.state;

		//  function convert(type, newUnit) {
		// 	if (type === 'distance') {
		// 		// default unit is feet

		// 	} else if (type === 'area') {
		// 		// default unit is acres
		// 	} else {
		// 		return null
		// 	}
		// }

		return (
			<div className="DistanceDisplay">
				<div>
					<span>Distance:</span>
					<span>{distance}</span>
					<select value={distanceUnits} onChange={e => setUnits('distance', e.target.value)}>
						<option>ft</option>
						<option>m</option>
						<option>km</option>
						<option>mi</option>
					</select>
				</div>
				<div>
					<span>Area:</span>
					<span>{area}</span>
					<select value={areaUnits} onChange={e => setUnits('area', e.target.value)}>
						<option>acres</option>
						<option>sq ft</option>
						<option>sq m</option>
						<option>sq km</option>
						<option>sq mi</option>
					</select>
				</div>
				<span className="modal-link" onClick={onClear} onKeyPress={onClear} role="button" tabIndex={0}>Clear</span>
			</div>
		);
	}
}
