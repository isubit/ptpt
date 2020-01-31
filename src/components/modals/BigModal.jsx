import React from 'react';
import {
	useLocation,
	useHistory,
} from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';
import { SettingsConsumer } from 'contexts/Settings';

import { LocationPrompt } from './LocationPrompt';
import { MapLegend } from './MapLegend';
import { WelcomeModal } from './WelcomeModal';
import { SaveModal } from './SaveModal';

export const BigModal = props => {
	const location = useLocation();
	const history = useHistory();

	let Component;
	switch (location.hash.replace('#', '')) {
		case 'legend':
			Component = MapLegend;
			break;
		case 'location':
			Component = LocationPrompt;
			break;
		case 'save':
			Component = SaveModal;
			break;
		case 'welcome':
			Component = welcomeProps => (
				<MapConsumer>
					{mapCtx => {
						const { load } = mapCtx;
						return (
							<SettingsConsumer>
								{settingsCtx => {
									const {
										toggleSeenWelcome,
										dismissHelpers,
									} = settingsCtx.actions;
									const { helpersDismissed } = settingsCtx.state;
									return !helpersDismissed && <WelcomeModal toggleSeenWelcome={toggleSeenWelcome} dismissHelpers={dismissHelpers} load={load} {...welcomeProps} />;
								}}
							</SettingsConsumer>
						);
					}}
				</MapConsumer>
			);
			break;
		default:
			Component = null;
	}

	return Component ? <Component {...props} router={{ location, history }} /> : null;
};
