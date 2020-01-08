import React from 'react';

export const SettingsDefaultState = {
	colorBlindMode: true,
	helpersDismissed: false,
	helper: null,
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
		dismissHelpers() {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					helpersDismissed: true,
					helper: null,
				},
			}));
		},
		toggleHelper(options) {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					helper: options,
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
