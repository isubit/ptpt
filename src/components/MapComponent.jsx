import React from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

import { MapConsumer } from 'contexts/MapState';
import areaLayer from 'map_layers/area.json';

mapboxgl.accessToken = process.env.mapbox_api_key;

export const MapWrapper = (props) => (
	<MapConsumer>
		{(mapCtx) => {
			const ctx = { ...mapCtx.state, ...mapCtx.actions };
			return <MapComponent {...ctx} {...props} />;
		}}
	</MapConsumer>
);


export class MapComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			setup: false,
			// geojsonInput: '',
			// sources: [],
		};
		this.mapElement = React.createRef();
		console.log(props);
	}

	componentDidMount() {
		console.log('mounted');
		this.map = new mapboxgl.Map({
			container: this.mapElement.current,
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: [-93.624287, 41.587537],
			zoom: 13,
		});

		this.map.on('load', () => {
			if (this.state.setup) {
				return false;
			}

			this.addDraw();
			this.loadSources();
			this.setDrawMode();
			// this.loadLayers();
			this.setState({
				setup: true,
			});
			console.log('Map loaded:', this.map);

			return true;
		});
	}

	componentDidUpdate() {
		if (this.state.setup) {
			this.loadSources();
			this.setDrawMode();
		}
	}

	get params() {
		const {
			router: {
				match: {
					params,
				},
			},
		} = this.props;
		return params;
	}

	setDrawMode() {
		const { action, type, step } = this.params;
		console.log(action, type, step);
		if (action === 'plant' && !step) {
			if (type === 'tree_single') {
				// Enter draw_point mode.
				this.draw.changeMode('draw_multiple_points');
			} else if (type === 'tree_row') {
				// Enter draw_line_string mode.
				this.draw.changeMode('draw_line_string');
			} else if (type === 'tree_area') {
				// Enter draw_polygon mode.
				this.draw.changeMode('draw_tree_area');
			} else {
				// Redirect to root / because invalid param
			}
		}
	}

	addDraw() {
		const {
			configs: {
				custom_modes: {
					draw_multiple_points,
				},
			},
		} = this.props;
		this.draw = new MapboxDraw({
			modes: { draw_multiple_points, ...MapboxDraw.modes },
		});
		this.map.addControl(this.draw, 'top-right');
	}

	// addSource(name, type, data) {
	//     if (this.state.sources.includes(name)) {
	//         // Update the source.
	//         const source = this.map.getSource(name);
	//         source.setData(data);
	//     } else {
	//         // Add the source.
	//         this.map.addSource(name, {
	//             type,
	//             data
	//         });
	//         this.setState({
	//             sources: this.state.sources.concat(name)
	//         });
	//     }
	// }

	loadSources() {
		const { data = [] } = this.props;
		let features = [];
		data.forEach(ea => {
			if (ea.type === 'Feature') {
				features.push(ea);
			} else if (ea.type === 'FeatureCollection') {
				features = features.concat(ea.features);
			}
		});

		// Add each feature to the mapbox-gl-draw source.
		features.forEach((ea) => this.draw.add(ea));

		// this.addSource('feature_data', 'geojson', {
		//     type: 'FeatureCollection',
		//     features
		// });
	}

	loadLayers() {
		this.map.addLayer(areaLayer);
	}

	render() {
		return (
			<div className="Map" ref={this.mapElement} />
		);
	}
}
