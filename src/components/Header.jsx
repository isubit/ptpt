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

const SaveButton = ({ save, mobileShow }) => (
	<div className={`Save ${mobileShow ? 'mobileSave' : ''}`}>
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
	const { pathname } = location;
	return (
		<MapConsumer>
			{
				ctx => {
					const numFeatures = ctx.state.data.size;
					// logic to show default header
					if ((pathname === '/report' && numFeatures === 0) || (pathname !== '/report' && pathname !== '/help' && pathname !== '/about')) {
						return (
							<div className="Header">
								<div className="grid-row sidenav-btn">
									<div className="title-wrap">
										<SideNav />
										<Title />
									</div>
									<LocationInputWrapper location={location} />
									<HeaderOptions location={location} />
									<SaveButton save={() => history.push(`${location.pathname}#save`)} />
								</div>
								<div className="search-save-btn">
									<LocationInputWrapper location={location} />
									<SaveButton save={() => history.push(`${location.pathname}#save`)} />
								</div>
							</div>
						);
					}
					// logic to show no headerOptions and locationInput
					if (pathname === '/report' && numFeatures > 0) {
						return (
							<div className="Header">
								<div className="grid-row sidenav-btn">
									<div className="title-wrap">
										<SideNav />
										<Title />
									</div>
									<SaveButton save={() => history.push(`${location.pathname}#save`)} mobileShow />
								</div>
							</div>
						);
					}
					// logic to show no headerOptions, locationInput, and save
					if (pathname === '/help' || pathname === '/about') {
						return (
							<div className="Header">
								<div className="grid-row sidenav-btn">
									<div className="title-wrap">
										<SideNav />
										<Title />
									</div>
								</div>
							</div>
						);
					}
					return null;
				}
			}
		</MapConsumer>
	);
};

export const HeaderWithRouter = withRouter(Header);
