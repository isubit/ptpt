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
				mapAPILoaded,
			},
		} = this.state;

		if (!mapAPILoaded) {
			const updateState = {
				MapState: {
					...this.state.MapState,
					mapAPILoaded: true,
				},
			};
			window.addEventListener('scriptinjection.googleplaces', () => {
				this.setState(updateState);
			});
		}
	}

	save = () => {
		const date = new Date();
		const contents = JSON.stringify({
			data: this.state,
			date,
			version: '1.0',
		}, null, 4);
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
