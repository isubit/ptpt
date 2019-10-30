import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

// import 'styles/base.sass';

import { MapWrapper } from 'components/MapComponent.jsx';
import { Store } from 'contexts';

const App = props => {
	// return (
	// 	<Store>
	// 		<Router>
	// 			<React.Fragment>
	// 				<Header />
	// 				<Switch>
	// 					<Route path="/new/:action?/:id?" render={router => <MapMaker router={router} />} />
	// 					<Redirect to="/new" />
	// 				</Switch>
	// 			</React.Fragment>
	// 		</Router>
	// 	</Store>
    // );
    return (
		<Store>
			<Router>
				<Link to="/">Map</Link>
				<Link to="/help">Help</Link>
				<Route path="/help" render={() => <h2>Help Page</h2>} />
				<Route path="/" render={() => <MapWrapper />} />
			</Router>
		</Store>
    );
};

ReactDOM.render(
	<App />,
	document.getElementById('root')
);