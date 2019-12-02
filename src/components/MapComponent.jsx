/* eslint-disable */
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
	getFeatures,
	getOptimalTreePlacements,
	getSouthernVertices,
	getTreeRows,
} from 'utils/sources';

import TestTreePoly from 'test_data/tree.json'; // This is some test data so there is something to interact with.

import { PrairieArea } from './map_layers/PrairieArea';
import { EditIcons } from './map_layers/EditIcons';
import { FeatureLabels } from './map_layers/FeatureLabels';
import { PrairieOutline } from './map_layers/PrairieOutline';
import { SSURGO } from './map_layers/SSURGO';
import { TreeRows } from './map_layers/TreeRows';
import { Trees } from './map_layers/Trees';

import { SimpleSelect } from './map_modes/SimpleSelect';
import { DrawLineMode, Planting } from './map_modes/Planting';


mapboxgl.accessToken = process.env.mapbox_api_key;

const debug = Debug('MapComponent');

// Export two different MapWrappers to trigger a full component switch when styles change, for a clean refresh of the map.
// This can be optimized in the future, but requires a lot of tweaking of lifecycle logic, because a style change means all sources and layers are wiped...
export const MapWrapperDefault = (props) => (
	<MapConsumer>
		{(mapCtx) => {
			const ctx = { ...mapCtx.state, ...mapCtx.actions };
			return <MapComponent {...ctx} {...props} styleURL={process.env.mapbox_outdoor_url} />;
		}}
	</MapConsumer>
);

export const MapWrapperSatellite = (props) => (
	<MapConsumer>
		{(mapCtx) => {
			const ctx = { ...mapCtx.state, ...mapCtx.actions };
			return <MapComponent {...ctx} {...props} styleURL={process.env.mapbox_satellite_url} />;
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
			cleanup: false, // Is the map cleaning up? (unmounting)
		};
		this.mapElement = React.createRef();
		debug('Props:', props);
	}

	componentDidMount() {
		// On mount, we init the map in the container, then load in the things we need.
		const { styleURL } = this.props;
		this.map = new mapboxgl.Map({
			container: this.mapElement.current,
			style: styleURL,
			center: [-93.241935, 41.224619],
			zoom: 13,
			minZoom: 12,
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
				{
					alt: 'Edit Polygon',
					src: '/assets/edit_feature.svg',
				},
				{
					alt: 'Tree Placement',
					src: '/assets/plant_tree_option.svg',
				},
			]);
			// this.loadSomeTestData(); // Load some test data.

			// Add the draw controller.
			this.draw = new MapboxDraw({
				modes: {
					draw_line: DrawLineMode,
					...MapboxDraw.modes,
				},
			});
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

	componentWillUnmount() {
		this.setState({ cleanup: true }, () => this.map.remove());
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
			// Update the source, only if geojson. (Not sure what the method is to update a vector url.)
			if (type === 'geojson') {
				const source = this.map.getSource(name);
				source.setData(data);
			}
		} else {
			// Add the source.
			const sourceData = {
				type,
			};
			if (type === 'geojson') {
				sourceData.data = data;
			} else if (type === 'vector') {
				sourceData.url = data;
			}
			this.map.addSource(name, sourceData);
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

		// These are the polygons for the prairies.
		this.addSource('feature_data_prairie', 'geojson', {
			type: 'FeatureCollection',
			features: getFeatures(data)
				.filter(ea => ea.properties.type === 'prairie'),
		});

		// These are the tree rows.
		this.addSource('feature_data_tree_rows', 'geojson', {
			type: 'FeatureCollection',
			features: getFeatures(data)
				.filter(ea => ea.properties.type === 'tree')
				.reduce((features, line) => {
					const rows = getTreeRows(line);
					return features.concat(rows);
				}, []),
		});

		// These are the tree placements.
		this.addSource('feature_data_trees', 'geojson', {
			type: 'FeatureCollection',
			features: getFeatures(data)
				.filter(ea => ea.properties.type === 'tree')
				.reduce((features, line) => {
					const trees = getOptimalTreePlacements(line);
					return features.concat(trees);
				}, []),
		});

		// These are the edit icons and labels.
		this.addSource('feature_data_southern_vertices', 'geojson', {
			type: 'FeatureCollection',
			features: getSouthernVertices(data),
		});

		// This is SSURGO.
		process.env.mapbox_ssurgo_tileset_id && this.addSource('ssurgo', 'vector', `mapbox://${process.env.mapbox_ssurgo_tileset_id}`);

		!sourcesAdded && this.setState({ sourcesAdded: true });
	}

	loadImages(images) {
		const addImg = ea => new Promise(resolve => {
			const img = document.createElement('img');
			img.src = ea.src;
			img.alt = ea.alt || ea.src;
			img.onload = () => {
				resolve(ea.src);
				this.map.addImage(ea.src, img);
			};
			img.onerror = () => {
				resolve(ea.src);
			};
		});

		return Promise.all(images.map(addImg));
	}

	render() {
		const {
			deleteFeature,
			draw,
			map,
			nextStep,
			props: {
				data,
				layers,
				router: {
					location: {
						pathname,
					},
				},
			},
			setEditingFeature,
			saveFeature,
			state: {
				cleanup,
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
					{!cleanup && drawInit
						&& (
							<Switch>
								<Route path="/plant/tree/:step?" render={router => <Planting router={router} type="tree" steps={['rows', 'species', 'spacing']} {...mapModeProps} />} />
								<Route path="/plant/prairie/:step?" render={router => <Planting router={router} type="prairie" steps={['seed', 'mgmt_1', 'mgmt_2']} {...mapModeProps} />} />
								<Route path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
								<Redirect to="/" />
							</Switch>
						)}

					{/* Load layers. These self-contain their event listeners. */}
					{!cleanup && sourcesAdded
						&& (
							<>
								{layers.ssurgo && <SSURGO map={map} />}
								<PrairieArea map={map} />
								<PrairieOutline map={map} />
								<TreeRows map={map} />
								<Trees map={map} />
								{!/^\/plant/.test(pathname) && <EditIcons map={map} data={data} setEditingFeature={setEditingFeature} nextStep={nextStep} />}
								<FeatureLabels map={map} />
							</>
						)}
				</div>
			</>
		);
	}
}
