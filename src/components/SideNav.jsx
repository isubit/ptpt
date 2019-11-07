import React from 'react'
import { Link } from 'react-router-dom'

export const NavOptions = props => {
    return (
        <React.Fragment>
            <div className="NavOptions">
                <div>
                    <img src="../assets/sidebar-close.svg"></img>
                </div>
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
        </React.Fragment>
    )
}

export class SideNav extends React.Component {
    constructor(props) {
        super (props)
        this.state = { isOpen: false }
    }
    render() {
        return (
            <React.Fragment>
                <NavOptions />
            </React.Fragment>
        )
    }
}