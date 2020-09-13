import React from 'react';
import {
	Link,
} from 'react-router-dom';

import { MeasureDisplay } from './MeasureDisplay';
import { MapConsumer } from '../contexts/MapState';

// checkboxElements could probably be factored out into own component.
// const DropdownCheckbox = ({
// 	setBasemap,
// 	setMapLayer,
// 	layers,
// 	basemap,
// }) => (
// 	<div className="dropdown-checkbox">
// 		<div className="checkboxElement">
// 			<input type="checkbox" checked={layers.ssurgo} name="ssurgo" onChange={(e) => setMapLayer(e.target.name)} />
// 			<span>gSSURGO - CSR</span>
// 		</div>
// 		<div className="checkboxElement">
// 			<input type="checkbox" checked={layers.lidar} name="lidar" onChange={(e) => setMapLayer(e.target.name)} />
// 			<span>LiDAR Hillshade</span>
// 		</div>
// 		<div className="checkboxElement">
// 			<input type="checkbox" checked={layers.contours} name="contours" onChange={(e) => setMapLayer(e.target.name)} />
// 			<span>2-ft Contours</span>
// 		</div>
// 		<div className="checkboxElement">
// 			<input
// 				type="checkbox"
// 				checked={basemap === 'satellite'}
// 				name="satellite"
// 				onChange={(e) => {
// 					e.target.checked ? setBasemap(e.target.name) : setBasemap('outdoor');
// 				}}
// 			/>
// 			<span>Satellite</span>
// 		</div>
// 		{basemap === 'satellite' && (
// 			<div className="satelliteSelection">
// 				<div className="checkboxElement">
// 					<input type="radio" name="aerialYear" value="2019" checked={layers.aerialYear === '2019'} onChange={(e) => setMapLayer(e.target.name, e.target.value)} />
// 					<span>Spring &lsquo;19</span>
// 				</div>
// 				<div className="checkboxElement">
// 					<input type="radio" name="aerialYear" value="2016-2018" checked={layers.aerialYear === '2016-2018'} onChange={(e) => setMapLayer(e.target.name, e.target.value)} />
// 					<span>Spring &lsquo;16-&lsquo;18</span>
// 				</div>
// 			</div>
// 		)}
// 		{/* <button type="button" className="Button">
// 			<span>Add A Map Layer</span>
// 		</button>
// 		<img src="/assets/question-mark.svg" alt="Help" /> */}
// 	</div>
// );

export class HeaderOptions extends React.Component {
	state = {
		treeOption: false,
		prairieOption: false,
		layerOption: false,
		measureOption: false,
		reportOption: false,
	};

	componentDidUpdate() {
		const {
			treeOption,
			prairieOption,
			measureOption,
			reportOption,
		} = this.state;
		const {
			location: {
				pathname,
			},
		} = this.props;

		if (pathname.includes('/plant/tree') && !treeOption) {
			this.setOptionState('treeOption');
		} else if (pathname.includes('/plant/prairie') && !prairieOption) {
			this.setOptionState('prairieOption');
		} else if (pathname.includes('/measure') && !measureOption) {
			this.setOptionState('measureOption');
		} else if (pathname.includes('/report') && !reportOption) {
			this.setOptionState('reportOption');
		} else if (pathname === '/' && (treeOption || prairieOption || measureOption || reportOption)) {
			this.setOptionState(null);
		}
	}

	toggleLayerOption() {
		this.setOptionState('layerOption');
	}

	setOptionState(optionName) {
		const {
			layerOption,
		} = this.state;

		const updateState = {
			treeOption: false,
			prairieOption: false,
			layerOption: false,
			measureOption: false,
			reportOption: false,
		};

		if (optionName) {
			if (optionName !== 'layerOption') {
				updateState[optionName] = true;
			} else {
				updateState[optionName] = !layerOption;
			}
		}

		this.setState(updateState);
	}

	render() {
		const {
			treeOption,
			prairieOption,
			// layerOption,
			measureOption,
			reportOption,
		} = this.state;

		return (
			<div className="HeaderOptions">
				<ul>
					<li className={treeOption ? 'option active' : 'option'}>
						<Link to="/plant/tree">
							<img className="option-inactive" src="/assets/tree_green.svg" alt="Plant trees" />
							<img className="option-active" src="/assets/tree_active.svg" alt="Plant trees" />
							<div className="option-name">
								Plant Trees
							</div>
						</Link>
					</li>
					<li className={prairieOption ? 'option active' : 'option'}>
						<Link to="/plant/prairie">
							<img className="option-inactive" src="/assets/prairie_green.svg" alt="Plant prairies" />
							<img className="option-active" src="/assets/prairieOption_active.svg" alt="Plant prairies" />
							<div className="option-name">
								Plant Prairies
							</div>
						</Link>
					</li>
					{/* <li className={layerOption ? 'option active' : 'option'}>
						<Link to="/#" onClick={() => this.toggleLayerOption()}>
							<img className="option-inactive" src="/assets/map_layers_green.svg" alt="Show layers" />
							<img className="option-active" src="/assets/layerOption_active.svg" alt="Show layers" />
							<div className="option-name">
								View Map Layers
							</div>
						</Link>
						<div className="OptionsDropdown grid-row">
							<button type="button" className="CloseButton" onClick={() => this.toggleLayerOption()}>
								<img src="/assets/close_dropdown.svg" alt="Close" />
							</button>
							<MapConsumer>
								{(ctx) => {
									const {
										state: {
											layers,
											basemap,
										},
										actions: {
											setBasemap,
											setMapLayer,
										},
									} = ctx;
									return <DropdownCheckbox setBasemap={setBasemap} setMapLayer={setMapLayer} layers={layers} basemap={basemap} />;
								}}
							</MapConsumer>
						</div>
					</li> */}
					<li className={measureOption ? 'option active' : 'option'}>
						<Link to="/measure">
							<img className="option-inactive" src="/assets/measure_green.svg" alt="Measure" />
							<img className="option-active" src="/assets/measure_active.svg" alt="Measure" />
							<div className="option-name">
								Measure Distance
							</div>
						</Link>

						<MapConsumer>
							{(mapCtx) => (mapCtx.state.measureFeature ? (
								<div className="OptionsDropdown large right">
									<MeasureDisplay feature={mapCtx.state.measureFeature} onClear={() => mapCtx.actions.setMeasureFeature(null)} />
								</div>
							) : null)}
						</MapConsumer>
					</li>
					<li className={reportOption ? 'option active' : 'option'}>
						<Link to="/report">
							<img className="option-inactive" src="/assets/report_green.svg" alt="View report" />
							<img className="option-active" src="/assets/reportOption_active.svg" alt="View report" />
							<div className="option-name">
								View Report
							</div>
						</Link>
					</li>
				</ul>
			</div>
		);
	}
}
