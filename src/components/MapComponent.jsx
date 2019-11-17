import React from 'react';
import {
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Debug from 'debug';

import { MapConsumer } from 'contexts/MapState';
import areaLayer from 'map_layers/area.json';
import { SimpleSelect } from './map_modes/SimpleSelect';
import { PlantTrees } from './map_modes/PlantTrees';

mapboxgl.accessToken = process.env.mapbox_api_key;

const debug = Debug('MapComponent');

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
			editingFeature: null,
		};
		this.mapElement = React.createRef();
		debug('Props:', props);
	}

	componentDidMount() {
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
			// this.setDrawMode();
			// this.loadLayers();
			this.setState({
				setup: true,
			});
			debug('Map loaded:', this.map);

			return true;
		});
	}

	componentDidUpdate() {
		if (this.state.setup) {
			this.loadSources();
			// this.setDrawMode();
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

	nextStep = step => {
		const {
			router: {
				history,
				location: {
					pathname,
				},
			},
		} = this.props;

		history.push(`${pathname}/${step}`);
	}

	setEditingFeature = feature => {
		this.setState({
			editingFeature: feature,
		});
	}

	// clearDraw = () => {
	// 	this.draw.deleteAll();
	// }

	// enableDrawMode = (config = {}) => {
	// 	// This cleanly switches draw modes. Clears the draw and editingFeature data.
	// 	const {
	// 		mode,
	// 		opts,
	// 		cb,
	// 	} = config;

	// 	if (!mode) {
	// 		throw new Error('Expected a draw mode to be passed to enableDrawMode');
	// 	}

	// 	const {
	// 		clearDraw,
	// 		draw,
	// 	} = this;

	// 	if (draw.getMode() === mode) {
	// 		debug('Already on mode:', mode);
	// 		return false;
	// 	}

	// 	debug('Changing mode:', mode, opts, cb);

	// 	clearDraw(); // First clear any draw data.
	// 	this.draw.changeMode(mode, opts); // Change mode.
	// 	this.setState({
	// 		editingFeature: null,
	// 	}, () => {
	// 		cb && cb(); // Callback after changeMode, this can be used to setup some map event listeners.
	// 	});
	// 	return true;
	// }

	addDraw() {
		this.draw = new MapboxDraw();
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
		const {
			setEditingFeature,
			// enableDrawMode,
			nextStep,
			// clearDraw,
			map,
			draw,
			state: {
				setup,
				editingFeature,
			},
		} = this;

		const mapModeProps = {
			setEditingFeature,
			// enableDrawMode,
			nextStep,
			// clearDraw,
			map,
			draw,
			editingFeature,
		};

		return (
			<>
				<div className="Map" ref={this.mapElement}>
					{setup
						&& (
							<Switch>
								<Route path="/plant/trees/:step?" render={router => <PlantTrees router={router} type="tree" {...mapModeProps} />} />
								{/* <Route path="/plant/prairie/:step?" render={router => <PlantPrairie router={router} type="prairie" {...mapModeProps} />} /> */}
								<Route path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
								<Redirect to="/" />
							</Switch>
						)}
				</div>
			</>
		);
	}
}
