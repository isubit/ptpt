import React from 'react'
import { Link } from 'react-router-dom'

export const NavOptions = props => {
    return (
        <React.Fragment>
            <div className="NavOptions">
                <ul>
                    <li>
                        <Link to="/settings" />
                    </li>
                    <li>
                        <Link to="/help" />
                    </li>
                    <li>
                        <Link to="/about" />
                    </li>
                    <li>
                        <Link to="/activate" />
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
        this.state = {}
    }
    render() {
        return (
            <React.Fragment>
                <NavOptions />
            </React.Fragment>
        )
    }
}