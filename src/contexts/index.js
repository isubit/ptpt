import React from 'react';
import download from 'js-file-download';

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
			navigator.permissions.query({ name: 'geolocation' })
				.then(({ state: status }) => {
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
		const date = new Date();
		const contents = JSON.stringify({
			data: this.state,
			date,
			version: '1.0',
		}, (name, val) => {
			if (val instanceof Map) {
				return [...val.entries()];
			}
			return val;
		}, 4);
		download(contents, `prairie_tree_planting_tool_savefile_${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.json`);
	}

	load = file => {
		if (file.data) {
			this.setState(file.data);
		}
	}

	render() {
		const { state, save } = this;
		return (
			<SettingsProvider value={{ state: state.Settings, actions: SettingsActions(this) }}>
				<MapProvider value={{ state: state.MapState, actions: MapActions(this), save }}>
					{this.props.children}
				</MapProvider>
			</SettingsProvider>
		);
	}
}
