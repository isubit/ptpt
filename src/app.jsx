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
import { SmallModal } from 'components/modals/SmallModal';
import { MapConsumer } from 'contexts/MapState';
import { SettingsConsumer } from 'contexts/Settings';
import { ReportWrapper } from 'components/Report';
import { Help } from 'components/Help';
import { About } from 'components/About';

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

			{/* Helper modal. */}
			<SettingsConsumer>
				{(ctx) => {
					const { helper, helpersDismissed } = ctx.state;
					console.log(ctx.state);
					const { dismissHelpers, toggleHelper } = ctx.actions;
					return helper && !helpersDismissed ? <SmallModal {...helper} dismissHelpers={dismissHelpers} toggleHelper={toggleHelper} /> : null;
				}}
			</SettingsConsumer>

			{/* --- */}

			{/* Routed components here. These will float over the map. */}
			<SettingsConsumer>
				{ctx => {
					const { seenWelcome } = ctx.state;
					return !seenWelcome ? <Redirect to="/#welcome" /> : null;
				}}
			</SettingsConsumer>
			{/* do no render the reportWrapper unless  */}
			<Route path="/report" render={router => <ReportWrapper router={router} />} />
			<Route path="/help" render={() => <Help />} />
			<Route path="/about" render={() => <About />} />
			<BigModal />
			{/* ---- */}

		</Router>
	</Store>
);

ReactDOM.render(
	<App />,
	document.getElementById('root'),
);
