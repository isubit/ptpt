import React from 'react'
import { Link } from 'react-router-dom'

export class SideNav extends React.Component {
    constructor(props) {
        super (props)
        this.state = { isNavOpen: false }
        
        this.toggleNav = this.toggleNav.bind(this)
    }
    toggleNav() {
        let { isNavOpen } = this.state
        this.setState({isNavOpen: !isNavOpen})
    }
    render() {
        let { isNavOpen } = this.state
        return (
            <React.Fragment>
                <div className="SideNavButton" onClick={this.toggleNav}>
                    <img className="narrow-sidenav" src="../assets/side_nav.svg"></img>
                    <img className="wide-sidenav" src="../assets/sidenav_wide.svg"></img>
                </div>
                <div className={isNavOpen ? "NavOptions grid-row active" : "NavOptions grid-row"}>
                    <img onClick={this.toggleNav} src="../assets/sidebar-close.svg"></img>
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
            </React.Fragment>
        )
    }
}
