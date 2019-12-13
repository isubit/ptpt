import React from 'react';

export const SettingsDefaultState = {
	colorBlindMode: true,
	dismissHelpers: false,
};
export const SettingsContext = React.createContext(SettingsDefaultState);
export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;

export const SettingsActions = (that) => {
	const actions = {
		toggleColorBlindMode() {
			that.setState({
				...that.state,
				Settings: {
					...that.state.Settings,
					colorBlindMode: !that.state.Settings.colorBlindMode,
				},
			});
		},
		toggleHelpers() {
			that.setState({
				...that.state,
				Settings: {
					...that.state.Settings,
					dismissHelpers: !that.state.Settings.dismissHelpers,
				},
			});
		},
	};
	return actions;
};
