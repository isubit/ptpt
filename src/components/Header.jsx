import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

export const SideNavButton = props => {
    return (
        <Link to="/sidenav">side nav</Link>
    )
}

export const HeaderOptions = props => {
    return (
        <React.Fragment>
            <ul className="header-options">
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                    <Link to="/plant/tree_single">Plant Single Tree (test)</Link>
                </li>
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                </li>
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                </li>
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                </li>
            </ul>
        </React.Fragment>
    )
}

export const SearchBar = props => {
    return (
        //MapConsumer here?
        <React.Fragment>
            <input placeholder="Enter a location or address"></input>
        </React.Fragment>
    )
}

export const Title = props => {
    return (
        <React.Fragment>
            <div className="title">
                <p>PRAIRIE & TREE</p>
                <p>Planting Tool</p>
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
                    <SideNavButton />
                    <Title />
                    <HeaderOptions />
                    <SearchBar />
                    <div className="save-button"><img src="https://via.placeholder.com/35x35?text=Save"></img></div>
                </div>
            </React.Fragment>
        );
    }
}