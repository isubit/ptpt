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
									<SaveButton save={ctx.save} />
								</div>
								<div className="search-save-btn">
									<LocationInputWrapper location={location} />
									<SaveButton save={ctx.save} />
								</div>
							</div>
						);
					}
					// logic to show no headerOptions and locationInput
					if (pathname === '/report' && numFeatures > 0) {
						const mobileShow = true;
						return (
							<div className="Header">
								<div className="grid-row sidenav-btn">
									<div className="title-wrap">
										<SideNav />
										<Title />
									</div>
									<SaveButton save={ctx.save} mobileShow={mobileShow} />
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
	// return (
	// 	<MapConsumer>
	// 		{ (ctx) => (
	// 			<div className="Header">
	// 				<div className="grid-row sidenav-btn">
	// 					<div className="title-wrap">
	// 						<SideNav />
	// 						<Title />
	// 					</div>
	// 					{/* do not change header unless there are saved features */}
	// 					{
	// 						(pathname !== '/report' && pathname !== '/about' && pathname !== '/help') && (
	// 							<>
	// 								<LocationInputWrapper location={location} />
	// 								<HeaderOptions location={location} />
	// 							</>
	// 						)
	// 					}
	// 					{
	// 						(pathname === '/report' || (pathname !== '/about' && pathname !== '/help')) && (
	// 							<SaveButton save={ctx.save} mobileShow={pathname === '/report'} />
	// 						)
	// 					}
	// 					{
	// 						(pathname === '/help' || pathname === '/about') && null
	// 					}
	// 				</div>
	// 				{
	// 					(pathname !== '/help' && pathname !== '/about' && pathname !== '/report') && (
	// 						<div className="search-save-btn">
	// 							<LocationInputWrapper location={location} />
	// 							<SaveButton save={ctx.save} />
	// 						</div>
	// 					)
	// 				}
	// 			</div>
	// 		)}
	// 	</MapConsumer>
	// );
};

export const HeaderWithRouter = withRouter(Header);
