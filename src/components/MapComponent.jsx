import React from 'react';
import {
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Debug from 'debug';

import areaLayer from 'map_layers/area.json';
import outlineLayer from 'map_layers/outline.json';

import TestTreePoly from 'test_data/tree.json';

import { MapConsumer } from 'contexts/MapState';
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
			sources: [],
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

			this.addDraw(); // Add the draw controller.
			this.loadSources(); // Load the data sources.
			this.loadLayers(); // Load the layer styles.
			this.loadSomeTestData(); // Load some test data.
			this.setState({
				setup: true,
			});
			debug('Map loaded:', this.map);

			return true;
		});
	}

	componentDidUpdate() {
		if (this.state.setup) {
			// Only the sources need to be updated, because they contain the state data.
			this.loadSources();
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

	loadSomeTestData() {
		const {
			addData,
		} = this.props;

		addData(TestTreePoly);
	}

	nextStep = step => {
		// This simply pushes a desired step into the router.
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
		// This sets the feature that is currently being edited to state.
		this.setState({
			editingFeature: feature,
		});
	}

	saveFeature = () => {
		// This saves the feature to context.
		const {
			state: {
				editingFeature,
			},
			props: {
				router: {
					history,
				},
				addData,
			},
		} = this;

		debug('Saving feature:', editingFeature);
		addData(editingFeature);
		history.push('/');
	}

	addDraw() {
		// This adds the draw controller.
		this.draw = new MapboxDraw();
		this.map.addControl(this.draw, 'top-right');
	}

	addSource(name, type, data) {
		// This adds the data source to the map, or updates it if it exists.
		if (this.state.sources.includes(name)) {
			// Update the source.
			const source = this.map.getSource(name);
			source.setData(data);
		} else {
			// Add the source.
			this.map.addSource(name, {
				type,
				data,
			});
			this.setState(prevState => ({
				sources: prevState.sources.concat(name),
			}));
		}
	}

	loadSources() {
		// This passes the data from context to source.
		const {
			data = new Map(),
		} = this.props;

		let features = [];
		data.forEach(ea => {
			if (ea.type === 'Feature') {
				features.push(ea);
			} else if (ea.type === 'FeatureCollection') {
				features = features.concat(ea.features);
			}
		});

		// Add each feature to the mapbox-gl-draw source.
		// features.forEach((ea) => this.draw.add(ea));

		this.addSource('feature_data', 'geojson', {
			type: 'FeatureCollection',
			features,
		});
	}

	loadLayers() {
		// This just adds the layer styles.
		this.map.addLayer(areaLayer);
		this.map.addLayer(outlineLayer);
	}

	render() {
		const {
			setEditingFeature,
			saveFeature,
			nextStep,
			map,
			draw,
			state: {
				setup,
				editingFeature,
			},
		} = this;

		const mapModeProps = {
			setEditingFeature,
			saveFeature,
			nextStep,
			map,
			draw,
			editingFeature,
		};

		return (
			<>
				<div className="Map" ref={this.mapElement}>
					{/* If the map is setup, we can render the drawing modes. They self-contain their config forms. */}
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
