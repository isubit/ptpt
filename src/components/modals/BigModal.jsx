import React from 'react';
import {
	useLocation,
	useHistory,
} from 'react-router-dom';

import { SettingsConsumer } from 'contexts/Settings';

import { LocationPrompt } from './LocationPrompt';
import { MapLegend } from './MapLegend';
import { WelcomeModal } from './WelcomeModal';

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
		case 'welcome':
			Component = welcomeProps => (
				<SettingsConsumer>
					{ctx => {
						const {
							toggleSeenWelcome,
							dismissHelpers,
						} = ctx.actions;
						const { helpersDismissed } = ctx.state;
						return !helpersDismissed && <WelcomeModal toggleSeenWelcome={toggleSeenWelcome} dismissHelpers={dismissHelpers} {...welcomeProps} />;
					}}
				</SettingsConsumer>
			);
			break;
		default:
			Component = null;
	}

	return Component ? <Component {...props} router={{ location, history }} /> : null;
};
