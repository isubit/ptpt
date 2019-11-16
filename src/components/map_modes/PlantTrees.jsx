import React from 'react';
import Debug from 'debug';

const debug = Debug('MapComponent');

export class PlantTrees extends React.Component {
	componentDidMount() {
		const {
			enableDrawMode,
		} = this.props;

		enableDrawMode('draw_polygon', (e, props) => {
			debug('Created feature:', e, props);
		});
	}

	render() {
		// const {
		// 	router: {
		// 		match: {
		// 			params
		// 		}
		// 	}
		// }

		return (
			<div className="PlantTrees">
				Test - Plant Trees Form
			</div>
		);
	}
}
