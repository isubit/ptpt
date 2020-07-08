import React from 'react';
import download from 'js-file-download';
import calcBbox from '@turf/bbox';
import calcBuffer from '@turf/buffer';

import { save as saveMethod, load as loadMethod } from 'utils/saveLoad';
import { SettingsDefaultState, SettingsProvider, SettingsActions } from './Settings';
import { MapDefaultState, MapProvider, MapActions } from './MapState';


export class Store extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			Settings: SettingsDefaultState,
			MapState: MapDefaultState,
		};
	}

	componentDidMount() {
		const {
			MapState: {
				lastGeolocationStatus,
				mapAPILoaded,
			},
		} = this.state;

		// Setup Google Places API script loading event.
		if (!mapAPILoaded) {
			window.addEventListener('script.googleplaces', () => {
				this.setState(state => ({
					MapState: {
						...state.MapState,
						mapAPILoaded: true,
					},
				}));
			});
		}

		// Query for the Geolocation API permission state.
		if (!lastGeolocationStatus) {
			navigator.permissions ? navigator.permissions.query({ name: 'geolocation' })
				.then(({ state: status }) => {
					this.setState(state => ({
						MapState: {
							...state.MapState,
							lastGeolocationStatus: status,
						},
					}));
				}) : navigator.geolocation.getCurrentPosition(({ state: status }) => {
				this.setState(state => ({
					MapState: {
						...state.MapState,
						lastGeolocationStatus: status,
					},
				}));
			});
		}
	}

	save = () => {
		const { contents, date } = saveMethod(this.state.MapState.data);
		download(contents, `prairie_tree_planting_tool_savefile_${date.getTime()}.json`);
	}

	load = async file => {
		const data = await loadMethod(file);

		this.setState(state => ({
			MapState: {
				...state.MapState,
				data,
				currentMapDetails: {
					bounds: (() => {
						if (!data || data.size === 0) {
							return null;
						}

						const features = [...data.values()];
						const fc = {
							type: 'FeatureCollection',
							features,
						};
						const buffered = calcBuffer(fc, 100, { units: 'meters' });
						const bbox = calcBbox(buffered);

						return bbox;
					})(),
				},
			},
		}));
		return data;
	}

	// save = () => {
	// 	const date = new Date();
	// 	const contents = JSON.stringify({
	// 		data: this.state.MapState.data,
	// 		date,
	// 		version: '1.0',
	// 	}, (name, val) => {
	// 		if (val instanceof Map) {
	// 			return [...val.entries()];
	// 		}
	// 		return val;
	// 	}, 4);

	// 	window.localStorage && localStorage.setItem('data', contents);
	// 	download(contents, `prairie_tree_planting_tool_savefile_${date.getTime()}.json`);
	// }

	// load = async (file, cb) => {
	// 	if (file[0]) {
	// 		try {
	// 			const contents = await file[0].text();
	// 			const parsed = JSON.parse(contents);
	// 			const data = new Map(parsed.data);
	// 			const features = [...data.values()];
	// 			const centroid = calcCentroid({
	// 				type: 'FeatureCollection',
	// 				features,
	// 			});

	// 			this.setState(state => ({
	// 				MapState: {
	// 					...state.MapState,
	// 					data,
	// 					currentMapDetails: {
	// 						latlng: centroid.geometry.coordinates,
	// 					},
	// 				},
	// 			}), () => cb && cb());
	// 		} catch (e) {
	// 			console.warn('File is corrupted:', e);
	// 		}
	// 	}
	// }

	render() {
		const {
			load,
			save,
			state,
		} = this;
		return (
			<SettingsProvider value={{ state: state.Settings, actions: SettingsActions(this) }}>
				<MapProvider value={{
					actions: MapActions(this),
					load,
					save,
					state: state.MapState,
				}}
				>
					{this.props.children}
				</MapProvider>
			</SettingsProvider>
		);
	}
}
