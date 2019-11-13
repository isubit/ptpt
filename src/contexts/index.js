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

	save = () => {
		const data = JSON.stringify(this.state, null, 4);
		download(data, 'test.json');
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
