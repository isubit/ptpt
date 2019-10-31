import React from 'react';

import { SettingsDefaultState, SettingsProvider, SettingsActions } from './Settings';
import { MapDefaultState, MapProvider, MapActions } from './MapState';

//Store is a component that contains a state comprised of the map settings and map state
//Store is then built with created context from Map State (MapProvider and MapDefaultState) and Settings
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
			// There is nothing being rendered here all of this is simply data to be rendered into the props of elements that 
			// will be wrapped within the store component in app.jsx
			<SettingsProvider value={{state: state.Settings, actions: SettingsActions(this)}}>
				<MapProvider value={{state: state.MapState, actions: MapActions(this)}}>
					{this.props.children}	
				</MapProvider>
			</SettingsProvider>
		)
	}
};