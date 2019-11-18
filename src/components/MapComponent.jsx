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

import {
	getPolygons,
	getEditIcons,
} from 'utils/sources';

import TestTreePoly from 'test_data/tree.json'; // This is some test data so there is something to interact with.

import { Area } from './map_layers/Area';
import { EditIcons } from './map_layers/EditIcons';
import { Outline } from './map_layers/Outline';

import { SimpleSelect } from './map_modes/SimpleSelect';
import { Planting } from './map_modes/Planting';


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
			// init: false, // Is the map init? Access via this.map
			// loaded: false, // Is the map loaded?
			drawInit: false, // Is the draw controller init?
			sourcesAdded: false, // Are the sources added?
			editingFeature: null, // The current feature being edited.
			sources: [], // The current sources loaded.
		};
		this.mapElement = React.createRef();
		debug('Props:', props);
	}

	componentDidMount() {
		// On mount, we init the map in the container, then load in the things we need.
		this.map = new mapboxgl.Map({
			container: this.mapElement.current,
			style: 'mapbox://styles/mapbox/outdoors-v11',
			center: [-93.624287, 41.587537],
			zoom: 13,
		});

		// this.setState({ init: true });

		this.map.on('load', () => {
			// this.setState({ loaded: true });
			debug('Map loaded:', this.map);

			if (this.state.setup) {
				return false;
			}

			this.loadSources(); // Load the data sources.
			this.loadImages([ // Load the images to be used in the map.
				'/assets/edit_feature.svg',
			]);
			this.loadSomeTestData(); // Load some test data.

			// Add the draw controller.
			this.draw = new MapboxDraw();
			this.map.addControl(this.draw, 'top-right');

			this.setState({
				drawInit: true,
			});

			return true;
		});
	}

	componentDidUpdate() {
		if (this.state.sourcesAdded) {
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
		// This is just so we have a polygon to work with on the map.
		const {
			addData,
		} = this.props;

		addData(TestTreePoly);
	}

	nextStep = step => {
		// This simply pushes a desired URL into the router.
		const {
			router: {
				history,
				// location: {
				// 	pathname,
				// },
			},
		} = this.props;

		history.push(step);
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
				addData,
				router: {
					history,
				},
			},
		} = this;

		debug('Saving feature:', editingFeature);
		addData(editingFeature);
		history.push('/');
	}

	deleteFeature = id => {
		const {
			props: {
				deleteData,
				router: {
					history,
				},
			},
		} = this;

		deleteData(id);
		history.push('/');
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
			state: {
				sourcesAdded,
			},
			props: {
				data = new Map(),
			},
		} = this;

		// These are the polygons.
		this.addSource('feature_data', 'geojson', {
			type: 'FeatureCollection',
			features: getPolygons(data),
		});

		// These are the edit icons.
		this.addSource('feature_data_edit_icons', 'geojson', {
			type: 'FeatureCollection',
			features: getEditIcons(data),
		});

		!sourcesAdded && this.setState({ sourcesAdded: true });
	}

	loadImages(srcs) {
		const addImg = src => new Promise(resolve => {
			const img = document.createElement('img');
			img.src = src;
			img.alt = 'Edit Polygon';
			img.onload = () => {
				resolve(src);
				this.map.addImage(src, img);
			};
			img.onerror = () => {
				resolve(src);
			};
		});

		return Promise.all(srcs.map(addImg));
	}

	render() {
		const {
			deleteFeature,
			draw,
			map,
			nextStep,
			props: {
				data,
			},
			setEditingFeature,
			saveFeature,
			state: {
				drawInit,
				sourcesAdded,
				editingFeature,
			},
		} = this;

		const mapModeProps = {
			data,
			deleteFeature,
			draw,
			editingFeature,
			map,
			nextStep,
			setEditingFeature,
			saveFeature,
		};

		return (
			<>
				<div className="Map" ref={this.mapElement}>
					{/* When the draw controller is init, we can render the drawing modes. They self-contain their event listeners and config forms. */}
					{drawInit
						&& (
							<Switch>
								<Route path="/plant/trees/:step?" render={router => <Planting router={router} type="tree" steps={['rows', 'species', 'spacing']} {...mapModeProps} />} />
								<Route path="/plant/prairie/:step?" render={router => <Planting router={router} type="prairie" steps={['seed', 'mgmt_1', 'mgmt_2']} {...mapModeProps} />} />
								<Route path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
								<Redirect to="/" />
							</Switch>
						)}

					{/* Load layers. These self-contain their event listeners. */}
					{sourcesAdded
						&& (
							<>
								<Area map={map} />
								<Outline map={map} />
								<EditIcons map={map} data={data} setEditingFeature={setEditingFeature} nextStep={nextStep} />
							</>
						)}
				</div>
			</>
		);
	}
}
