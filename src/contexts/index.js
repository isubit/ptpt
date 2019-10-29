import React from 'react';

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

	render() {
		const { state } = this;
		return (
			<MapProvider value={{state: state.MapState, actions: MapActions(this)}}>
				<SettingsProvider value={{state: state.Settings, actions: SettingsActions(this)}}>
					{this.props.children}
				</SettingsProvider>
			</MapProvider>
		)
	}
};