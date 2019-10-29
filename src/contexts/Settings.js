import React from 'react';

export const SettingsDefaultState = {
	colorBlindMode: true,
};
export const SettingsContext = React.createContext(SettingsDefaultState);
export const SettingsProvider = SettingsContext.Provider;
export const SettingsConsumer = SettingsContext.Consumer;

export const SettingsActions = that => ({
    toggleColorBlindMode() {
        that.setState({
            ...that.state,
            Settings: {
                ...that.state.Settings,
                colorBlindMode: !that.state.Settings.colorBlindMode
            }
        });
    }
});