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

import { MapWrapperDefault, MapWrapperSatellite } from 'components/MapComponent';
import { Store } from 'contexts';
import { Header } from 'components/Header';
import { WelcomeModal } from 'components/modals/WelcomeModal';
import { MapConsumer } from 'contexts/MapState';

const App = () => (
	<Store>
		<Router>
			{/* These will always be visible, no addt'l routing required. */}
			{/* The map is always mounted (but perhaps covered)
				to improve performance when route switching. */}
			<Header />
			{/* <Route path="/:action?/:type?/:step?" render={(router) => <MapWrapper router={router} />} /> */}
			<MapConsumer>
				{(ctx) => {
					const { basemap } = ctx.state;
					// if satellite style is selected render satellite styled map component
					const loadMap = (router, basemapName) => {
						if (basemapName === 'satellite') {
							return <MapWrapperSatellite router={router} />;
						}
						return <MapWrapperDefault router={router} />;
					};
					return <Route path="/" render={(router) => loadMap(router, basemap)} />;
				}}
			</MapConsumer>
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
