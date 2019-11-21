import React from 'react';
import { Link } from 'react-router-dom';

import { MapConsumer } from '../contexts/MapState';
// import { Context } from 'mocha';

/* export const OptionsDropdown = (props) => {
	const { option } = props;
	if (option === 'tree') {
		return (
			<>
				<div className="OptionsDropdown grid-row">
					<img className="CloseButton" src="/assets/close_dropdown.svg" alt="Close" />
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
			</>
		);
	}
}; */

const DropdownCheckbox = ({ setBasemap, setMapLayer }) => (
	<div className="dropdown-checkbox">
		<div>
			<input type="checkbox" name="ssurgo" onChange={(e) => setMapLayer(e.target.name)} />
			<span>gSSURGO - CSR</span>
		</div>
		<div>
			<input type="checkbox" name="lidar" onChange={(e) => setMapLayer(e.target.name)} />
			<span>LiDAR Hillshade</span>
		</div>
		<div>
			<input type="checkbox" name="contours" onChange={(e) => setMapLayer(e.target.name)} />
			<span>(2 ft contours)</span>
		</div>
		<div>
			<input type="checkbox" name="satellite" onChange={(e) => setBasemap(e.target.name)} />
			<span>Satellite</span>
		</div>
		<button type="button" className="Button">
			<span>Add A Map Layer</span>
		</button>
		<img src="/assets/question-mark.svg" alt="Help" />
	</div>
);

export class HeaderOptions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			optionStates: {
				treeOptionActive: false,
				prairieOptionActive: false,
				layerOptionActive: false,
				reportOptionActive: false,
			},
		};
	}

	handleCheckboxChange = (event) => {
		const checkboxName = event.target.name;
		const { layerStates } = this.state;
		// toggle on or off
		layerStates[checkboxName] = !layerStates[checkboxName];
		this.setState({
			layerStates: {
				...layerStates,
			},
		});
	}

	toggleActiveClass = (optionName) => {
		const { optionStates } = this.state;
		let prevActiveState;

		const optionStateKeys = Object.keys(optionStates);
		optionStateKeys.forEach((key) => {
			if (optionStates[key] === true) {
				prevActiveState = key;
			}
		});

		if (optionName === 'treeOption') {
			optionStates.treeOptionActive = !optionStates.treeOptionActive;
		} else if (optionName === 'prairieOption') {
			optionStates.prairieOptionActive = !optionStates.prairieOptionActive;
		} else if (optionName === 'layerOption') {
			optionStates.layerOptionActive = !optionStates.layerOptionActive;
		} else if (optionName === 'reportOption') {
			optionStates.reportOptionActive = !optionStates.reportOptionActive;
		}

		if (prevActiveState) {
			if (!prevActiveState.includes(optionName)) {
				optionStates[prevActiveState] = false;
			}
		}

		this.setState({
			optionStates: {
				...optionStates,
			},
		});
	}

	render() {
		const {
			optionStates: {
				treeOptionActive,
				prairieOptionActive,
				layerOptionActive,
				reportOptionActive,
			},
		} = this.state;

		return (
			<div className="HeaderOptions">
				<ul>
					<li className={treeOptionActive ? 'option active' : 'option'}>
						<Link to="/plant/tree" onClick={() => this.toggleActiveClass('treeOption')}>
							<img className="option-inactive" src="/assets/plant_tree_option.svg" alt="Plant trees" />
							<img className="option-active" src="/assets/tree_active.svg" alt="Plant trees" />
							<div className="option-name">
								<p>Plant</p>
								<p>Trees</p>
							</div>
						</Link>
					</li>
					<li className={prairieOptionActive ? 'option active' : 'option'}>
						<Link to="/plant/prairie" onClick={() => this.toggleActiveClass('prairieOption')}>
							<img className="option-inactive" src="/assets/plant_prairie.svg" alt="Plant prairies" />
							<img className="option-active" src="/assets/prairieOption_active.svg" alt="Plant prairies" />
							<div className="option-name">
								<p>Plant</p>
								<p>Prairies</p>
							</div>
						</Link>
					</li>
					<li className={layerOptionActive ? 'option active' : 'option'}>
						<Link to="/#" onClick={() => this.toggleActiveClass('layerOption')}>
							<img className="option-inactive" src="/assets/map_layers.svg" alt="Show layers" />
							<img className="option-active" src="/assets/layerOption_active.svg" alt="Show layers" />
							<div className="option-name">
								<p>View Map</p>
								<p>Layers</p>
							</div>
						</Link>
						<div className="OptionsDropdown grid-row">
							<button type="button" className="CloseButton" onClick={() => this.toggleActiveClass('layerOption')}>
								<img src="/assets/close_dropdown.svg" alt="Close" />
							</button>
							<MapConsumer>
								{(ctx) => {
									const {
										actions: {
											setBasemap,
											setMapLayer,
										},
									} = ctx;
									return <DropdownCheckbox setBasemap={setBasemap} setMapLayer={setMapLayer} />;
								}}
							</MapConsumer>
						</div>
					</li>
					<li className={reportOptionActive ? 'option active' : 'option'}>
						<Link to="/#" onClick={() => this.toggleActiveClass('reportOption')}>
							<img className="option-inactive" src="/assets/view_report.svg" alt="View report" />
							<img className="option-active" src="/assets/reportOption_active.svg" alt="View report" />
							<div className="option-name">
								<p>View</p>
								<p>Report</p>
							</div>
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}
