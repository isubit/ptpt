import React from 'react';
import {
	BrowserRouter as Router, Route, Switch, Redirect, Link,
} from 'react-router-dom';

import { SideNav } from './SideNav.jsx';
import { HeaderOptions } from './HeaderOptions.jsx';

export const SearchBar = (props) => (
	// MapConsumer here?
	<>
		<div className="SearchBar">
			<input placeholder="Enter a location or address" />
		</div>
	</>
);

export const Title = (props) => (
	<>
		<div className="Title">
			<img className="narrow-logo" src="../assets/narrow_logo.svg" />
			<img className="wide-logo" src="../assets/wide_logo.svg" />
		</div>
	</>
);

export const SaveButton = (props) => (
	<>
		<div className="SaveButton">
			<Link to="/save">
				<img className="narrow-save" src="../assets/save_narrow.svg" />
				<img className="wide-save" src="../assets/save_wide.svg" />
			</Link>
		</div>
	</>
);

export class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<>
				<div className="Header">
					<div className="grid-row sidenav-btn">
						<SideNav />
						<Title />
						<SearchBar />
						<HeaderOptions />
						<SaveButton />
					</div>
					<div className="search-save-btn">
						<SearchBar />
						<SaveButton />
					</div>
				</div>
			</>
		);
	}
}
