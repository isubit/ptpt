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

export const OptionsDropdown = props => {
        let option = props.option
        if (option == 'tree') {
            return (
                <React.Fragment>
                    <div className="OptionsDropdown grid-row">
                        <img src="../assets/close_dropdown.svg"></img>
                        <div className="dropdown-list">
                            <ul>
                                <li>
                                    <Link to="/plant/tree_single">Plant Single Trees</Link>
                                </li>
                                <li>
                                    <Link to="/plant/tree_row">Plant Tree Rows</Link>
                                </li>
                                <li>
                                    <Link to="/plant/tree_plantation">Plant a Tree Plantation</Link>
                                </li>
                                <li>
                                    <Link to="/upload">Upload a Shapefile</Link>
                                </li>
                            </ul>
                        </div>       
                    </div>
                </React.Fragment>
            )
        } else if (option == 'prairie') {
        }
}

export class HeaderOptions extends React.Component {
    constructor(props) {
        super(props)
        this.treeOption = React.createRef()
        this.prairieOption = React.createRef()
        this.layersOption = React.createRef()
        this.reportOption = React.createRef()
    }

    addActiveClass(ref) {
        ref.classList.add('active')
    } 

    render() {
        return (
            <React.Fragment>
                <div className="HeaderOptions">
                    <ul>
                        <li className="option" ref={this.treeOption}>
                            <Link to="/plant" onClick={() => this.addActiveClass(this.treeOption)}>
                                <img className="tree-option-inactive" src="../assets/plant_tree_option.svg"></img>
                                <img className="tree-option-active" src="../assets/tree_active.svg"></img>
                                <div className="option-name">
                                    <p>Plant</p>
                                    <p>Trees</p>
                                </div>
                            </Link>
                            <OptionsDropdown option="tree" />
                        </li>                  
                        <li className="option">
                            <Link to="/plant">
                                <img src="../assets/plant_prairie.svg"></img>
                                <div className="option-name">
                                    <p>Plant</p>
                                    <p>Prairies</p>
                                </div>
                            </Link>
                        </li>
                        <li className="option">
                            <Link>
                                <img src="../assets/map_layers.svg"></img>
                                <div className="option-name">
                                    <p>View Map</p>
                                    <p>Layers</p>
                                </div>
                            </Link>
                        </li>
                        <li className="option">
                            <Link>
                                <img src="../assets/view_report.svg"></img>
                                <div className="option-name">
                                    <p>View</p>
                                    <p>Report</p>
                                </div>
                            </Link>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        )
    }
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
                    <div className="search-save-btn">
                        <SearchBar />
                        <SaveButton />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}