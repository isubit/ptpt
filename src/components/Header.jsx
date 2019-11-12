import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

import { SideNav } from './SideNav.jsx'
import { HeaderOptions } from './HeaderOptions.jsx'

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
        this.state = {}
    }

    render() {
        return (
            <React.Fragment>
                <div className="Header">
                    <div className="grid-row sidenav-btn">
                        <SideNav />
                        <Title />
                        <SearchBar />
                        <HeaderOptions />
                        <SaveButton />
                    </div>
                    <div className="search-save-btn">
                        <SearchBar />
                        <SaveButton />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}