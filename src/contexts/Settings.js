import _ from 'lodash';
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
		activateHelpers() {
			that.setState(state => ({
				...state,
				Settings: {
					...state.Settings,
					helpersDismissed: false,
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
			const newOptions = _.omit(options, ['onClose']);
			const oldOptions = _.omit(that.state.Settings.helper, ['onClose']);
			const same = _.isEqual(newOptions, oldOptions);
			(!same || options === null) && that.setState(state => ({
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
