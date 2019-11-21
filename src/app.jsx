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

import { MapWrapper } from 'components/MapComponent';
import { Store } from 'contexts';
import { Header } from 'components/Header';
import { WelcomeModal } from 'components/modals/WelcomeModal';

/* (function injectMapScript(d, s, id) {
	const js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)){ return; }
	js = d.createElement(s); 
	js.id = id;
	js.onload = function() {
		// remote script has loaded // emit event 
	};
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); */

const App = () => (
	<Store>
		<Router>
			{/* These will always be visible, no addt'l routing required. */}
			{/* The map is always mounted (but perhaps covered)
				to improve performance when route switching. */}
			<Header />
			{/* <Route path="/:action?/:type?/:step?" render={(router) => <MapWrapper router={router} />} /> */}
			<Route path="/" render={(router) => <MapWrapper router={router} />} />
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
