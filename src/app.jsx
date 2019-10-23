import React from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// import 'styles/base.sass';

// import { Header } from 'components/Header.jsx';
// import { MapMaker } from 'components/MapMaker.jsx';
// import { Store } from 'contexts';

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
        <React.Fragment>
            <h2>Hello World!</h2>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
        </React.Fragment>
    );
};

ReactDOM.render(
	<App />,
	document.getElementById('root')
);