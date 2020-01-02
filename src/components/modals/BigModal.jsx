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
						const { toggleSeenWelcome } = ctx.actions;
						return <WelcomeModal toggleSeenWelcome={toggleSeenWelcome} {...welcomeProps} />;
					}}
				</SettingsConsumer>
			);
			break;
		default:
			Component = null;
	}

	return Component ? <Component {...props} router={{ location, history }} /> : null;
};
