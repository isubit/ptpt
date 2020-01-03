import React from 'react';
import {
	Link,
	withRouter,
} from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';

import { SideNav } from './SideNav';
import { HeaderOptions } from './HeaderOptions';
import { LocationInputWrapper } from './LocationInput';

const Title = () => (
	<div className="Title">
		<Link to="/">
			<img className="narrow-logo" src="/assets/narrow_logo.svg" alt="Logo - Prairie and Tree Planting Tool" />
			<img className="wide-logo" src="/assets/wide_logo.svg" alt="Logo - Prairie and Tree Planting Tool" />
		</Link>
	</div>
);

const SaveButton = ({ save }) => (
	<div className="Save">
		<button type="button" className="SaveButton" onClick={save} onKeyPress={save}>
			<img className="narrow-save" src="/assets/save_narrow.svg" alt="Save" />
			<img className="wide-save" src="/assets/save_wide.svg" alt="Save" />
		</button>
	</div>
);

const Header = (props) => {
	const {
		location,
		history,
	} = props;

	return (
		<div className="Header">
			<div className="grid-row sidenav-btn">
				<SideNav />
				<Title />
				<LocationInputWrapper location={location} />
				<HeaderOptions location={location} history={history} />
				<MapConsumer>
					{ctx => <SaveButton save={ctx.save} />}
				</MapConsumer>
			</div>
			<div className="search-save-btn">
				<LocationInputWrapper location={location} />
				<MapConsumer>
					{ctx => <SaveButton save={ctx.save} />}
				</MapConsumer>
			</div>
		</div>
	);
};

export const HeaderWithRouter = withRouter(Header);
