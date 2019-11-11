import React from 'react'
import { Link } from 'react-router-dom'

export const OptionsDropdown = props => {
    let option = props.option
    if (option == 'tree') {
        return (
            <React.Fragment>
                <div className="OptionsDropdown grid-row">
                    <img className="CloseButton" src="../assets/close_dropdown.svg"></img>
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
    this.state = {
        optionStates: {
                    treeOptionActive: false,
                    prairieOptionActive: false,
                    layerOptionActive: false,
                    reportOptionActive: false
        },
        layerStates: {
            ssurgo: false,
            lidar: false,
            contours: false,
            satellite: false
        }
    }
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
}

handleCheckboxChange(event) {
    let checkboxName = event.target.name
    let { layerStates } = this.state
    // toggle on or off
    layerStates[checkboxName] = !layerStates[checkboxName]
    this.setState({
        layerStates: {
            ...layerStates
        }
    })

}

toggleActiveClass(optionName) {
    let { optionStates } = this.state
    let prevActiveState;

    for (let key in optionStates) {
        if (optionStates[key] == true) {
            prevActiveState = key
            break
        }
    }

    if (optionName == 'treeOption') {
        optionStates.treeOptionActive = !optionStates.treeOptionActive 
    } else if (optionName == 'prairieOption') {
        optionStates.prairieOptionActive = !optionStates.prairieOptionActive
    } else if (optionName == 'layerOption') {
        optionStates.layerOptionActive = !optionStates.layerOptionActive 
    } else if (optionName == 'reportOption') {
        optionStates.reportOptionActive = !optionStates.reportOptionActive
    }
    
    if (prevActiveState) {
        if (!prevActiveState.includes(optionName)) {
            optionStates[prevActiveState] = false
        }
    }
    
    this.setState({ 
        optionStates: {
            ...optionStates
        }
    })
} 

render() {
    let { optionStates } = this.state
    let { 
        optionStates: {
            treeOptionActive,
            prairieOptionActive,
            layerOptionActive,
            reportOptionActive
        },
        layerStates: {
            ssurgo,
            satellite,
            contours,
            lidar
        }
    } = this.state

    return (
        <React.Fragment>
            <div className="HeaderOptions">
                <ul>
                    <li className={treeOptionActive ? "option active" : "option" }>
                        <Link to="/plant" onClick={() => this.toggleActiveClass('treeOption')}>
                            <img className="option-inactive" src="../assets/plant_tree_option.svg"></img>
                            <img className="option-active" src="../assets/tree_active.svg"></img>
                            <div className="option-name">
                                <p>Plant</p>
                                <p>Trees</p>
                            </div>
                        </Link>
                        <div className="OptionsDropdown grid-row">
                            <img className="CloseButton" onClick={() => this.toggleActiveClass('treeOption')} src="../assets/close_dropdown.svg"></img>
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
                    </li>                  
                    <li className={prairieOptionActive ? "option active" : "option" }>
                        <Link to="/plant" onClick={() => this.toggleActiveClass('prairieOption')}>
                            <img className="option-inactive" src="../assets/plant_prairie.svg"></img>
                            <img className="option-active" src="../assets/prairieOption_active.svg"></img>
                            <div className="option-name">
                                <p>Plant</p>
                                <p>Prairies</p>
                            </div>
                        </Link>
                    </li>
                    <li className={layerOptionActive ? "option active" : "option" }>
                        <Link to="/#" onClick={() => this.toggleActiveClass('layerOption')}>
                            <img className="option-inactive" src="../assets/map_layers.svg"></img>
                            <img className="option-active" src="../assets/layerOption_active.svg"></img>
                            <div className="option-name">
                                <p>View Map</p>
                                <p>Layers</p>
                            </div>
                        </Link>
                        <div className="OptionsDropdown grid-row">
                            <img className="CloseButton" onClick={() => this.toggleActiveClass('layerOption')} src="../assets/close_dropdown.svg"></img>
                            <div className="dropdown-checkbox">
                                <label>
                                    <input type="checkbox" name="ssurgo" onChange={this.handleCheckboxChange} />
                                    <span>gSSURGO - CSR</span>
                                </label>    
                                <label>                                                          
                                    <input type="checkbox" name="lidar" onChange={this.handleCheckboxChange}></input>
                                    <span>LiDAR Hillshade</span>
                                </label> 
                                <label>
                                    <input type="checkbox" name="contours" onChange={this.handleCheckboxChange}></input>
                                    <span>(2 ft contours)</span>
                                </label>
                                <label>
                                    <input type="checkbox" name="satellite" onChange={this.handleCheckboxChange}></input>
                                    <span>Satellite</span>
                                </label>
                                <div className="Button">
                                    <span>Add A Map Layer</span>
                                </div>
                                <img src="../assets/question-mark.svg"></img>
                            </div>
                        </div>
                    </li>
                    <li className={reportOptionActive ? "option active" : "option" }>
                        <Link to="/#" onClick={() => this.toggleActiveClass('reportOption')}>
                            <img className="option-inactive" src="../assets/view_report.svg"></img>
                            <img className="option-active" src="../assets/reportOption_active.svg"></img>
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