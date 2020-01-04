import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
} from 'react-router-dom';

import 'styles/base.sass';

import { MapWrapperDefault, MapWrapperSatellite } from 'components/MapComponent';
import { Store } from 'contexts';
import { HeaderWithRouter } from 'components/Header';
import { BigModal } from 'components/modals/BigModal';
import { MapConsumer } from 'contexts/MapState';
import { SettingsConsumer } from 'contexts/Settings';
import { ReportWrapper } from 'components/Report';

(function injectMapScript(w, s, id) {
	const script = w.document.createElement(s);
	script.type = 'text/javascript';
	script.id = id;
	script.async = true;
	script.onload = function onload() {
		const event = new Event('script.googleplaces');
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
					return <HeaderWithRouter {...state} {...actions} />;
				}}
			</MapConsumer>

			<MapConsumer>
				{(ctx) => {
					const {
						basemap,
					} = ctx.state;
					return (
						<Route
							path="/"
							render={router => {
								if (basemap === 'satellite') {
									return <MapWrapperSatellite router={router} />;
								}
								return <MapWrapperDefault router={router} />;
							}}
						/>
					);
				}}
			</MapConsumer>
			{/* --- */}

			{/* Routed components here. These will float over the map. */}
			<Route path="/report" render={() => <ReportWrapper />} />
			<SettingsConsumer>
				{ctx => {
					const { seenWelcome } = ctx.state;
					return !seenWelcome ? <Redirect to="/#welcome" /> : null;
				}}
			</SettingsConsumer>
			<Route path="/help" render={() => <h2>Help Page</h2>} />
			<BigModal />
			{/* ---- */}

		</Router>
	</Store>
);

ReactDOM.render(
	<App />,
	document.getElementById('root'),
);
