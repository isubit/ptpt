/* eslint-disable */
import React from 'react';
import {
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import calcBbox from '@turf/bbox';
import Debug from 'debug';

import { Loader } from 'components/Loader';
import { SSURGOPopup } from 'components/SSURGOPopup';

import { MapConsumer } from 'contexts/MapState';
import { SettingsConsumer } from 'contexts/Settings';

import {
	getFeatures,
	getOptimalTreePlacements,
	getSouthernVertices,
	getTreeRows,
} from 'utils/sources';

import { enrichment } from 'utils/enrichment';

import csrRent from 'references/csr_rent.json';

import { Contours } from './map_layers/Contours';
import { EditIcons } from './map_layers/EditIcons';
import { FeatureLabels } from './map_layers/FeatureLabels';
import { GeolocationPosition } from './map_layers/GeolocationPosition';
import { Aerial } from './map_layers/Aerial';
import { Lidar } from './map_layers/Lidar';
import { PrairieArea } from './map_layers/PrairieArea';
import { PrairieOutline } from './map_layers/PrairieOutline';
import { SSURGO } from './map_layers/SSURGO';
import { TreeRows } from './map_layers/TreeRows';
import { Trees } from './map_layers/Trees';

import { SimpleSelect } from './map_modes/SimpleSelect';
import { DrawLineMode, Planting } from './map_modes/Planting';

mapboxgl.accessToken = process.env.mapbox_public_key;

const debug = Debug('MapComponent');

// Export two different MapWrappers to trigger a full component switch when styles change, for a clean refresh of the map.
// This can be optimized in the future, but requires a lot of tweaking of lifecycle logic, because a style change means all sources and layers are wiped...
export const MapWrapperDefault = (props) => (
	<SettingsConsumer>
		{(settingsCtx) => (
			<MapConsumer>
				{(mapCtx) => {
					const ctx = { ...mapCtx.state, ...mapCtx.actions, ...settingsCtx.state, ...settingsCtx.actions };
					return <MapComponent {...ctx} {...props} styleURL={process.env.mapbox_outdoor_url} />;
				}}
			</MapConsumer>
		)}
	</SettingsConsumer>
);

export const MapWrapperSatellite = (props) => (
	<SettingsConsumer>
		{(settingsCtx) => (
			<MapConsumer>
				{(mapCtx) => {
					const ctx = { ...mapCtx.state, ...mapCtx.actions, ...settingsCtx.state, ...settingsCtx.actions };
					return <MapComponent {...ctx} {...props} styleURL={process.env.mapbox_satellite_url} />;
				}}
			</MapConsumer>
		)}
	</SettingsConsumer>
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
			SSURGOPopupData: null, // The data for the SSURGO layer popup.
			sources: [], // The current sources loaded.
			cleanup: false, // Is the map cleaning up? (unmounting)
			enriching: false, // Is the map currently enriching a feature?
			touchStartLocation: null, // The touchstart lnglat for mobile.
		};
		this.mapElement = React.createRef();
		debug('Props:', props);
	}

	componentDidMount() {
		// On mount, we init the map in the container, then load in the things we need.
		const {
			basemap,
			defaultLatLng,
			defaultZoom,
			defaultPitch,
			defaultBearing,
			layers,
			styleURL,
			updateCurrentMapDetails,
			currentMapDetails: {
				latlng,
				zoom,
				pitch,
				bearing,
			},
		} = this.props;

		const mapConfig = {
			container: this.mapElement.current,
			style: styleURL,
			// minZoom: window.innerWidth * window.innerHeight > 1000000 ? 15 : 12,
			center: latlng || defaultLatLng,
			zoom: zoom || defaultZoom,
			pitch: pitch || defaultPitch,
			bearing: bearing || defaultBearing,
		};

		this.map = new mapboxgl.Map(mapConfig);

		this.map.on('load', () => {
			debug('Map loaded:', this.map);
			if (this.state.setup) {
				return false;
			}

			if (basemap === 'outdoor') {
				// Disable the default 10-ft contour line included in the style.
				this.map.setLayoutProperty('contour-line', 'visibility', 'none');
				this.map.setLayoutProperty('contour-label', 'visibility', 'none');
      }

			// this.moveMapCenter();

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

		this.map.on('moveend', this.updatePosition);
		this.map.on('zoomend', this.updatePosition);
	}

	componentDidUpdate() {
		const {
			props: {
				layers,
			},
			state: {
				SSURGOPopupData,
			},
		} = this;

		this.moveMapCenter();
		if (this.state.sourcesAdded) {
			// Only the sources need to be updated, because they contain the state data.
			this.loadSources();
		}
		!layers.ssurgo && SSURGOPopupData && this.setState(() => ({
			SSURGOPopupData: null,
		}));
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

	updatePosition = () => {
		const {
			updateCurrentMapDetails,
		} = this.props;

		const { lat, lng } = this.map.getCenter();
		const latlng = [lng, lat];
		const zoom = this.map.getZoom();
		const bearing = this.map.getBearing();
		const pitch = this.map.getPitch();
		const details = {
			latlng,
			zoom,
			bearing,
			pitch,
		};
		updateCurrentMapDetails(details);
	}

	nextStep = step => {
		// This simply pushes a desired URL into the router.
		const {
			router: {
				history,
			},
		} = this.props;

		history.push(step)
	}

	setEditingFeature = (feature, cb = () => {}) => {
		// This sets the feature that is currently being edited to state.
		const {
			map,
			props: {
				mapAPILoaded,
			},
			updatePosition,
		} = this;

		const time = new Date().getTime();

		if (feature) {
			let clone = _.cloneDeep(feature);

			const bbox = calcBbox(feature);

			map.fitBounds(bbox, {
				duration: 400,
				padding: 200,
			});
			
			let ran = false;
			const runEnrichment = () => {
				updatePosition();
				!ran && this.setState({ enriching: true }, async () => {
					if (mapAPILoaded) {
						try {
							clone = await enrichment(clone, map);
						} catch(e) {
							debug(e);	
						}
					}
		
					this.setState(() => ({
						enriching: false,
						editingFeature: clone,
					}), cb);
				});
				map.off('zoomend', runEnrichment);
				ran = true;
			};


			setTimeout(runEnrichment, 1000);

			map.once('zoomstart', () => {
				map.once('zoomend', runEnrichment);
			});
		} else {
			this.setState(() => ({ editingFeature: null }), cb);
		}
	}

	moveMapCenter() {
		const {
			defaultLatLng,
			defaultZoom,
			defaultPitch,
			defaultBearing,
			currentMapDetails: {
				latlng,
				pitch,
				bearing,
				zoom,
			},
		} = this.props;
		const { lat, lng } = this.map.getCenter();
		if (latlng) {
			if (latlng[0] !== lng && latlng[1] !== lat) {
				this.map.easeTo({
					center: {
						lat: latlng[1],
						lng: latlng[0],
					},
					pitch: pitch || defaultPitch,
					bearing: bearing || defaultBearing,
					zoom: zoom || defaultZoom,
				});
			}
		}
	}

	saveFeature = (feature, setReportFeature) => {
		// This saves the feature to context.
		const {
			map,
			props: {
				router: {
					history,
				},
				addData,
				mapAPILoaded,
			},
		} = this;
		debug('Saving feature:', feature);

		let clone = _.cloneDeep(feature);

		// Re-enrich.
		this.setState({ enriching: true }, async () => {
			this.nextStep('/')
			if (mapAPILoaded) {
				try {
					clone = await enrichment(clone, map);
					addData(clone);
				} catch(e) {
					addData(clone);
				}
			}

			this.setState(() => ({
				enriching: false,
				editingFeature: null,
			}));

			if (setReportFeature) {
				history.push({
					pathname: '/report',
					state: clone,
				});
			}
		});
	}

	settouchStartLocation = (lngLat) => {
		this.setState(() => ({
			touchStartLocation: lngLat,
		}));
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

		const sure = confirm('Are you sure you want to delete this feature?');
		if (sure) {
			deleteData(id);
			history.push('/');
		}
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
			let sourceData = {
				type,
			};
			if (type === 'geojson') {
				sourceData.data = data;
			} else if (type === 'vector') {
				sourceData.url = data;
			} else {
				sourceData = {
					...sourceData,
					...data,
				};
			}
			this.map.addSource(name, sourceData);
			this.setState(prevState => ({
				sources: prevState.sources.concat(name),
			}));
		}
	}

	loadSSURGOPopupData = (feature, lngLat) => {
		if (feature && lngLat) {
			feature && this.addSource('active_ssurgo_feature', 'geojson', {
				type: 'Feature',
				geometry: feature.geometry,
			});
			const SSURGOPopupData = {
				feature,
				lngLat
			}
			this.setState(() => ({
				SSURGOPopupData,
			}));
		}
		if (!feature) {
			this.setState(() => ({
				SSURGOPopupData: null,
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
				lastGeolocationResult,
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

		// This is lidar hillshade.
		this.addSource('lidar', 'raster', {
			tiles: [
				'https://ortho.gis.iastate.edu/arcgis/rest/services/ortho/lidar_hs/ImageServer/exportImage?f=image&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=256%2C256',
			],
			tileSize: 256,
		});
		
		// This is 2ft contour lines.
		process.env.mapbox_contour_tileset_id && this.addSource('contours', 'vector', `mapbox://${process.env.mapbox_contour_tileset_id}`);

		// This is aerial imagery (high zoom).
		this.addSource('aerial', 'raster', {
			tiles: [
				'https://ortho.gis.iastate.edu/arcgis/rest/services/ortho/naip_2019_nc/ImageServer/exportImage?f=image&bbox={bbox-epsg-3857}&imageSR=102100&bboxSR=102100&size=256%2C256',
			],
			tileSize: 256,
		});

		// This is the Geolocation position.
		lastGeolocationResult && this.addSource('geolocation_position', 'geojson', {
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: lastGeolocationResult
			},
		});

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
				basemap,
				data,
				layers,
				router: {
					history,
					location: {
						pathname,
					},
				},
				toggleHelper,
			},
			setEditingFeature,
			saveFeature,
			loadSSURGOPopupData,
			settouchStartLocation,
			state: {
				cleanup,
				drawInit,
				enriching,
				sourcesAdded,
				editingFeature,
				SSURGOPopupData,
				touchStartLocation,
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
			toggleHelper,
		};

		map && sourcesAdded && (() => {
			const labelTextColor = basemap === 'satellite' ? 'white' : 'black';

			map.labelTextColor = labelTextColor;
	
			map.satelliteEnabled = basemap === 'satellite';
		})();

		return (
			<>
				<div className="Map" ref={this.mapElement}>
					{enriching && (
						<div className="LoaderModal modal">
							<Loader />
						</div>
					)}

					{/* When the draw controller is init, we can render the drawing modes. They self-contain their event listeners and config forms. */}
					{!cleanup && drawInit
						&& (
							<Switch>
								<Route path="/plant/tree/:step?" render={router => <Planting router={router} type="tree" steps={['rows', 'species', 'spacing']} {...mapModeProps} />} />
								<Route path="/plant/prairie/:step?" render={router => <Planting router={router} type="prairie" steps={['seed', 'mgmt_1']} {...mapModeProps} />} />
								<Route exact path="/" render={router => <SimpleSelect router={router} {...mapModeProps} />} />
								{/* <Redirect to="/" /> */}
							</Switch>
						)}

					{/* Load layers. These self-contain their event listeners. */}
					{/* SSURGO is conditionally rendered while contours layer is conditionally loaded because we need to be able to query SSURGO data. */}
					{!cleanup && sourcesAdded
						&& (
							<>
								<FeatureLabels map={map} />
								{!/^\/plant/.test(pathname) && <EditIcons map={map} data={data} setEditingFeature={setEditingFeature} nextStep={nextStep} />}
								{map.getSource('geolocation_position') && <GeolocationPosition map={map} />}
								<PrairieArea map={map} />
								<PrairieOutline map={map} />
								<TreeRows map={map} />
								<Trees map={map} />
								<Contours map={map} active={layers.contours} />
								<SSURGO map={map} active={layers.ssurgo} loadSSURGOPopupData={loadSSURGOPopupData} SSURGOPopupData={SSURGOPopupData} settouchStartLocation={settouchStartLocation} touchStartLocation={touchStartLocation} />
								{SSURGOPopupData && layers.ssurgo && <SSURGOPopup map={map} loadSSURGOPopupData={loadSSURGOPopupData} SSURGOPopupData={SSURGOPopupData} /> }
								{layers.lidar && <Lidar map={map} active={layers.lidar} />}{/* This is written this way because the lidar layer takes so long to load it impedes other processes. */}
								{basemap === 'satellite' && <Aerial map={map} active={layers.aerial} />}
							</>
						)}

					{/* Misc controls. */}
					<div className="ZoomControl">
						<img src="/assets/plus.svg" alt="zoom in" onClick={() => map.zoomIn({ animate: true })} />
						<hr />
						<img src="/assets/minus.svg" alt="zoom out" onClick={() => map.zoomOut({ animate: true })} />
					</div>
					<div className="LegendControl">
						<img src="/assets/legend.svg" alt="legend" onClick={() => history.push(`${location.pathname}#legend`)}/>
					</div>
				</div>
			</>
		);
	}
}
