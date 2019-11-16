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
			// geojsonInput: '',
			// sources: [],
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

	clearDraw = () => {
		this.draw.deleteAll();
	}

	enableDrawMode = (mode, cb) => {
		if (!mode) {
			throw new Error('Expected a draw mode to be passed to enableDrawMode');
		}

		if (mode !== 'simple_select' && !cb) {
			throw new Error('Expected a callback function to be passed to enableDrawMode if desired mode is not simple_select');
		}

		debug('Changing mode:', mode, cb);

		const {
			nextStep,
			clearDraw,
			draw,
			map,
		} = this;

		// Some props available in callback.
		const callbackProps = {
			nextStep,
			draw,
			map,
		};

		const setupCreationEvent = () => {
			this.onCreate = e => {
				this.map.off('draw.create', this.onCreate);
				cb(e, callbackProps);
				// const feature = e.features[0];
				// feature.properties = {
				// 	...feature.properties,
				// 	type,
				// };
				// this.draw.add(feature);
				// nextStep('rows');
			};
			this.map.on('draw.create', this.onCreate);
		};

		clearDraw(); // First clear any draw data.
		this.draw.changeMode(mode); // Change mode.
		mode !== 'simple_select' && !this.onCreate && setupCreationEvent(); // If is it a draw mode, setup the creation callback.
	}

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
			enableDrawMode,
			map,
			state: {
				setup,
			},
		} = this;

		const mapModeProps = {
			enableDrawMode,
			map,
		};

		return (
			<>
				<div className="Map" ref={this.mapElement} />
				{setup
					&& (
						<Switch>
							<Route path="/plant/trees/:step?" render={router => <PlantTrees router={router} {...mapModeProps} />} />
							{/* <Route path="/plant/prairie/:step?" render={router => <PlantPrairie router={router} {...mapModeProps} />} /> */}
							<Route path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
							<Redirect to="/" />
						</Switch>
					)}
			</>
		);
	}
}
