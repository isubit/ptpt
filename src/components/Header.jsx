import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { ReadStream } from 'tty';

export const SideNavButton = props => {
    return (
        <React.Fragment>
                <div className="SideNav">
                    <Link to="/sidenav">
                        <img className="narrow-sidenav" src="../assets/side_nav.svg"></img>
                        <img className="wide-sidenav" src="../assets/sidenav_wide.svg"></img>
                    </Link>
                </div>
            
        </React.Fragment>
    )
}

export const HeaderOptions = props => {
    return (
        <React.Fragment>
            <div className="HeaderOptions">
                <ul>
                    <li className="option">
                        <img src="../assets/plant_tree_option.svg"></img>
                    </li>
                    <li className="option">
                        <img src="../assets/plant_prairie.svg"></img>
                    </li>
                    <li className="option">
                        <img src="../assets/map_layers.svg"></img>
                    </li>
                    <li className="option">
                        <img src="../assets/view_report.svg"></img>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    )
}

export const SearchBar = props => {
    return (
        //MapConsumer here?
        <React.Fragment>
            <div className="SearchBar">
                <input placeholder="Enter a location or address"></input>
            </div>
        </React.Fragment>
    )
}

export const Title = props => {
    return (
        <React.Fragment>
            <div className="Title">
                <img className="narrow-logo" src="../assets/narrow_logo.svg"></img>
                <img className="wide-logo" src="../assets/wide_logo.svg"></img>
            </div>
        </React.Fragment>
    )
}

export const SaveButton = props => {
    return (
        <React.Fragment>
            <div className="SaveButton">
                <Link to="/save">
                    <img className="narrow-save" src="../assets/save_narrow.svg"></img>
                    <img className="wide-save" src="../assets/save_wide.svg"></img>
                </Link>
            </div>
        </React.Fragment>
    )
}

export class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <div className="Header">
                    <div className="grid-row sidenav-btn">
                        <SideNavButton />
                        <Title />
                        <SearchBar />
                        <HeaderOptions />
                        <SaveButton />
                    </div>
                    <div className="grid-row save-btn">
                        <SearchBar />
                        <SaveButton />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}