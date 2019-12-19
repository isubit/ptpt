import React from 'react';

export const SettingsDefaultState = {
	colorBlindMode: true,
	dismissHelpers: false,
	seenWelcome: false,
};
export const SettingsContext = React.createContext(SettingsDefaultState);
export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;

export const SettingsActions = (that) => {
	const actions = {
		toggleColorBlindMode() {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					colorBlindMode: !state.Settings.colorBlindMode,
				},
			}));
		},
		toggleHelpers() {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					dismissHelpers: !state.Settings.dismissHelpers,
				},
			}));
		},
		toggleSeenWelcome() {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					seenWelcome: true,
				},
			}));
		},
	};
	return actions;
};
