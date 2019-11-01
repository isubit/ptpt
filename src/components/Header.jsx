import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

export const SideNavButton = props => {
    return (
        <React.Fragment>
            <Link to="/sidenav">
                <div className="SideNav">
                    <img src="../assets/side_nav.svg"></img>
                </div>
            </Link>
        </React.Fragment>
    )
}

export const HeaderOptions = props => {
    return (
        <React.Fragment>
            <ul className="HeaderOptions">
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
        </React.Fragment>
    )
}

export const SearchBar = props => {
    return (
        //MapConsumer here?
        <React.Fragment>
            <div className="Searchbar">
                <input placeholder="Enter a location or address"></input>
            </div>
        </React.Fragment>
    )
}

export const Title = props => {
    return (
        <React.Fragment>
            <div className="Title">
                <img src="../assets/narrow_logo.svg"></img>
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
                <div className="Header grid">
                    <SideNavButton />
                    <Title />
                    <HeaderOptions />
                    <SearchBar />
                    <div className="SaveButton"><img src="../assets/save_narrow.svg"></img></div>
                </div>
            </React.Fragment>
        );
    }
}