import React from 'react';
import { Link } from 'react-router-dom';

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
	<button type="button" className="SaveButton" onClick={save} onKeyPress={save}>
		<img className="narrow-save" src="/assets/save_narrow.svg" alt="Save" />
		<img className="wide-save" src="/assets/save_wide.svg" alt="Save" />
	</button>
);

export const Header = () => (
	<div className="Header">
		<div className="grid-row sidenav-btn">
			<SideNav />
			<Title />
			<LocationInputWrapper />
			<HeaderOptions />
			<MapConsumer>
				{ctx => <SaveButton save={ctx.save} />}
			</MapConsumer>
		</div>
		<div className="search-save-btn">
			<LocationInputWrapper />
			<MapConsumer>
				{ctx => <SaveButton save={ctx.save} />}
			</MapConsumer>
		</div>
	</div>
);
