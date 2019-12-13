import React from 'react';
import {
	useLocation,
	useHistory,
} from 'react-router-dom';

import { LocationPrompt } from './LocationPrompt';
import { WelcomeModal } from './WelcomeModal';

export const BigModal = props => {
	const location = useLocation();
	const history = useHistory();

	let Component;
	switch (location.hash.replace('#', '')) {
		case 'welcome':
			Component = WelcomeModal;
			break;
		case 'location':
			Component = LocationPrompt;
			break;
		default:
			Component = null;
	}

	return Component ? <Component {...props} router={{ location, history }} /> : null;
};
