import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';


// SideNavButton will simply be a button. This button will route and render the SideNavComponent 
export const SideNavButton = props => {
    return (
        <Link to="/sidenav">side nav</Link>
    )
}
//build 
export const HeaderOptions = props => {
    return (
        <React.Fragment>
            <ul className="header-options">
                <li className="option">
                    <img src="https://via.placeholder.com/30x30?text=Option"></img>
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

// SaveButton will just be a button that saves the geojson data --> this data lies in context MapProvider, retrieve
// using MapConsumer

export class HeaderComponent extends React.Component {
    constructor(props) {
        super(props)
        
    }

    render() {
        return (
            <React.Fragment>
                <div className="header-wrap">
                    <SideNavButton />
                    <Title />
                    <HeaderOptions />
                    <SearchBar />
                    <div className="save-button"><img src="https://via.placeholder.com/35x35?text=Save"></img></div>
                </div>
            </React.Fragment>
        )
    }
}