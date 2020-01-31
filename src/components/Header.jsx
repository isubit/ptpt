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
	} = props;
	const { pathname } = location;
	return (
		<div className="Header">
			<div className="grid-row sidenav-btn">
				<div className="title-wrap">
					<SideNav />
					<Title />
				</div>
				{
					(pathname !== '/report' && pathname !== '/about' && pathname !== '/help') && (
						<>
							<LocationInputWrapper location={location} />
							<HeaderOptions location={location} />
						</>
					)
				}
				{
					(pathname === '/report' || (pathname !== '/about' && pathname !== '/help')) && (
						<MapConsumer>
							{ctx => {
								const mobileShow = pathname === '/report';
								return <SaveButton save={ctx.save} mobileShow={mobileShow} />;
							}}
						</MapConsumer>
					)
				}
				{
					(pathname === '/help' || pathname === '/about') && null
				}
			</div>
			{
				(pathname !== '/help' && pathname !== '/about' && pathname !== '/report') && (
					<div className="search-save-btn">
						<LocationInputWrapper location={location} />
						<MapConsumer>
							{ctx => <SaveButton save={ctx.save} />}
						</MapConsumer>
					</div>
				)
			}
		</div>
	);
};

export const HeaderWithRouter = withRouter(Header);
