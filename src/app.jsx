import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

// import 'styles/main.sass';

import { MapWrapper } from 'components/MapComponent.jsx';
import { Store } from 'contexts';
import { Header } from 'components/Header.jsx';

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
				<Route path="/help" render={() => <h2>Help Page</h2>} />
				<Route path="/" render={() => 
					<React.Fragment>
						<Header />
						<MapWrapper />
					</React.Fragment>
				}/>
			</Router>
		</Store>
    );
};

ReactDOM.render(
	<App />,
	document.getElementById('root')
);