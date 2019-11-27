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
import { MapConsumer } from 'contexts/MapState';

(function injectMapScript(w, s, id) {
	const script = w.document.createElement(s);
	script.type = 'text/javascript';
	script.id = id;
	script.async = true;
	script.onload = function onload() {
		const event = new Event('scriptinjection');
		w.dispatchEvent(event);
	};
	script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.google_places_api_key}&libraries=places`;
	w.document.getElementsByTagName('head')[0].appendChild(script);
}(window, 'script', 'google_places_api_key'));

const App = () => (
	<Store>
		<Router>
			{/* These will always be visible, no addt'l routing required. */}
			{/* The map is always mounted (but perhaps covered)
				to improve performance when route switching. */}
			<MapConsumer>
				{ctx => {
					const { state, actions } = ctx;
					return <Header {...state} {...actions} />;
				}}
			</MapConsumer>
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
