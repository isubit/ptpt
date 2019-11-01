import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';

export const SideNavButton = props => {
    return (
        <React.Fragment>
            <div class="SideNav">
                <Link to="/sidenav">side nav</Link>
            </div>
        </React.Fragment>
    )
}

export const HeaderOptions = props => {
    return (
        <React.Fragment>
            <ul className="HeaderOptions">
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                    <Link to="/plant/tree_single">Plant Single Tree (test)</Link>
                </li>
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
                    <Link to="/plant/tree_row">Plant Row of Trees</Link>
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
            <div class="Searchbar">
                <input placeholder="Enter a location or address"></input>
            </div>
        </React.Fragment>
    )
}

export const Title = props => {
    return (
        <React.Fragment>
            <div className="Title">
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
                <div className="Header grid">
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