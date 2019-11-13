import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	// Switch,
	// Redirect,
	// Link,
} from 'react-router-dom';

import 'styles/base.sass';

import { MapWrapper } from 'components/MapComponent.jsx';
import { Store } from 'contexts';
import { Header } from 'components/Header.jsx';
import { WelcomeModal } from 'components/modals/WelcomeModal.jsx';

const App = () => (
	<Store>
		<Router>
			{/* These will always be visible, no addt'l routing required. */}
			{/* The map is always mounted (but perhaps covered)
				to improve performance when route switching. */}
			<Header />
			<Route path="/:action?/:type?/:step?" render={(router) => <MapWrapper router={router} />} />
			{/* --- */}

			{/* Routed components here. These will float over the map. */}
			<Route path="/help" render={() => <h2>Help Page</h2>} />
			<Route path="/welcome" render={() => <WelcomeModal />} />
			{/* ---- */}
		</Router>
	</Store>
);

ReactDOM.render(
	<App />,
	document.getElementById('root'),
);
