import React from 'react';
import { Link } from 'react-router-dom';

export class SideNav extends React.Component {
	constructor(props) {
		super(props);
		this.state = { isNavOpen: false };
	}

	toggleNav = () => {
		const { isNavOpen } = this.state;
		this.setState({ isNavOpen: !isNavOpen });
	}

	render() {
		const { isNavOpen } = this.state;
		return (
			<div>
				<button type="button" className="SideNavButton" onClick={this.toggleNav} onKeyPress={this.toggleNav}>
					<img className="narrow-sidenav" src="/assets/side_nav.svg" alt="Side Navigation Toggle" />
					<img className="wide-sidenav" src="/assets/sidenav_wide.svg" alt="Side Navigation Toggle" />
				</button>
				<div className={isNavOpen ? 'NavOptions grid-row active' : 'NavOptions grid-row'}>
					<button type="button" className="CloseButton" onClick={this.toggleNav} onKeyPress={this.toggleNav}>
						<img src="/assets/sidebar-close.svg" alt="Close Side Navigation" />
					</button>
					<div className="grid-wrap">
						<ul>
							<li>
								<Link to="/settings">Settings</Link>
							</li>
							<li>
								<Link to="/help">Help</Link>
							</li>
							<li>
								<Link to="/about">About</Link>
							</li>
							<li>
								<Link to="/activate">Activate Helper Popups</Link>
							</li>
						</ul>
						<div>
							<p>Any additonal info like copyright information or sponsorship can go here.</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
