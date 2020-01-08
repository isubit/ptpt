import React from 'react';
import { Link } from 'react-router-dom';

import { TreePlantingForm } from '../TreePlantingForm';
import { PrairiePlantingForm } from '../PrairiePlantingForm';

export class PlantingModal extends React.Component {
	constructor(props) {
		super(props);
		this.bottom = React.createRef();
		const {
			editingFeature: {
				properties: {
					type,
				},
			},
		} = props;
		let {
			editingFeature: {
				properties: {
					configs = null,
				},
			},
		} = props;

		if (!configs) {
			if (type === 'tree') {
				configs = {
					windbreak: false,
					propagation: 'N',
					rows: [{
						type: '',
						species: '',
					}],
					spacing_rows: {
						value: 3, // placeholder value
						unit: 'feet',
					},
					spacing_trees: {
						value: 3, //  placeholder value
						unit: 'feet',
					},
					stock_size: '',
					drip_irrigation: false,
					pasture_conversion: false,
				};
			} else if (type === 'prairie') {
				configs = {
					seed: '',
					seed_price: '',
					management: {
						id: 'J8wEfx7P',
						display: 'mow',
					},
					cropping_system: {
						id: 1,
						display: 'Corn Rotation',
					},
					pest_control: {
						id: 1,
						display: 'Pest Control',
					},
				};
			}
		}
		this.state = {
			...configs,
		};

		this.form = React.createRef();
	}

	componentDidUpdate(prevProps) {
		const { stepIndex: prevStepIndex } = prevProps;
		const { stepIndex: currentStepIndex } = this.props;
		if (currentStepIndex > prevStepIndex) {
			this.scrollToBottom();
		}
	}

	handleNumRowChange = (event) => {
		const numRows = typeof event === 'number' ? event : event.target.value;
		this.setState((state) => {
			let updateRows = [];
			if (numRows < state.rows.length) {
				updateRows = state.rows.splice(0, numRows);
				return {
					rows: updateRows,
				};
			}
			if (numRows > state.rows.length) {
				updateRows = [...state.rows];
				for (let i = 0; i < numRows - state.rows.length; i += 1) {
					updateRows.push({
						type: '',
						species: '',
					});
				}
				return {
					rows: updateRows,
				};
			}
			return null;
		});
	}

	handleWindbreakChange = (event) => {
		let updateWindbreak = event.target.value;
		if (updateWindbreak === 'true' || updateWindbreak === 'false') {
			updateWindbreak = JSON.parse(updateWindbreak);
		}
		this.setState({ windbreak: updateWindbreak }, () => {
			if (this.state.rows.length > 4) {
				this.handleNumRowChange(4);
			}
		});
	}

	handlePropgationChange = (event) => {
		const updatePropagation = event.target.value;
		this.setState({ propagation: updatePropagation });
	}

	handlePastureConversionChange = (event) => {
		const updateConversion = event.target.value;
		this.setState({ pasture_conversion: updateConversion === 'on' });
	}

	handleRowTypeChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].type = event.target.value;
		this.setState({ rows });
	}

	handleRowSpeciesChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].species = event.target.value;
		this.setState({ rows });
	}

	handleRowSpacingChange = (event) => {
		const spacingValue = Number(event.target.value);
		this.setState((state) => ({
			spacing_rows: {
				...state.spacing_rows,
				value: spacingValue,
			},
		}));
	}

	handleTreeSpacingChange = (event) => {
		const spacingValue = Number(event.target.value);
		this.setState((state) => ({
			spacing_trees: {
				...state.spacing_trees,
				value: spacingValue,
			},
		}));
	}

	handleStockSizeChange = (event) => {
		const stock_size = event.target.value;
		console.log(stock_size);
		this.setState(() => ({ stock_size }));
	}

	handleDripIrrigationChange = (event) => {
		const updateDripIrrigation = event.target.checked;
		this.setState({ drip_irrigation: updateDripIrrigation });
	}

	handleSeedMixChange = (event) => {
		const updateSeedMix = event.target.value;
		this.setState(() => ({ seed: updateSeedMix }));
	}

	handleSeedPriceChange = (event) => {
		const updateValue = typeof event === 'number' ? event : event.target.value;
		this.setState(() => ({ seed_price: updateValue }));
	}

	handleManagementChange = (event) => {
		const id = event.target.value;
		const display = event.target.options[event.target.selectedIndex].text;
		const updateManagement = {
			id,
			display,
		};
		this.setState(() => ({ management: updateManagement }), () => console.log(this.state));
	}

	handleCroppingChange = (event) => {
		const updateCropping = event.target.value;
		this.setState(() => ({ cropping_system: updateCropping }));
	}

	handlePestControlChange = (event) => {
		const updatePestControl = event.target.value;
		this.setState(() => ({ pest_control: updatePestControl }));
	}

	scrollToBottom = () => {
		this.bottom.current.scrollIntoView({ behavior: 'smooth' });
	}

	handleNextStep = () => {
		const {
			nextStep,
			steps,
			stepIndex,
			editingFeature: {
				properties: {
					type,
				},
			},
		} = this.props;


		if (this.form.current && this.form.current.checkValidity()) {
			this.setState(() => ({
				formError: null,
			}), () => nextStep(`/plant/${type}/${steps[stepIndex + 1]}`));
		} else {
			this.setState(() => ({
				formError: 'Please fill in all fields before moving onto the next step.',
			}));
		}
	}

	handleSave = () => {
		const {
			props: {
				editingFeature,
				saveFeature,
				editingFeature: {
					properties: {
						type,
					},
				},
			},
		} = this;

		let properties;
		if (type === 'tree') {
			const {
				state: {
					pasture_conversion,
					propagation,
					rows,
					spacing_trees,
					spacing_rows,
					stock_size,
					drip_irrigation,
					windbreak,
				},
			} = this;

			properties = {
				type,
				configs: {
					pasture_conversion,
					propagation,
					windbreak,
					rows,
					spacing_rows,
					spacing_trees,
					stock_size,
					drip_irrigation,
				},
			};
		} else if (type === 'prairie') {
			const {
				seed,
				seed_price,
				management,
				cropping_system,
				pest_control,
			} = this.state;

			properties = {
				type,
				configs: {
					seed,
					seed_price,
					management,
					cropping_system,
					pest_control,
				},
			};
		}

		if (this.form.current && this.form.current.checkValidity()) {
			this.setState(() => ({
				formError: null,
			}), () => {
				editingFeature.properties = {
					...editingFeature.properties,
					...properties,
				};
				saveFeature(editingFeature);
			});
		} else {
			this.setState(() => ({
				formError: 'Please fill in all fields before saving.',
			}));
		}
	}

	// routeToReport = () => {
	// 	const {
	// 		editingFeature,
	// 		nextStep,
	// 	} = this.props;

	// 	this.handleSave();
	// 	nextStep('/report', editingFeature)
	// }

	render() {
		const {
			props: {
				step,
				stepIndex,
				steps,
				editingFeature,
				editingFeature: {
					properties: {
						type,
					},
				},
			},
			state: {
				formError,
			},
			form,
		} = this;

		let formProps = {
			editingFeature,
			step,
			form,
			formError,
		};

		if (type === 'tree') {
			const {
				state: {
					windbreak,
					propagation,
					rows,
					spacing_trees,
					spacing_rows,
					stock_size,
					drip_irrigation,
					pasture_conversion,
				},
				handleTreeSpacingChange,
				handleDripIrrigationChange,
				handleRowSpeciesChange,
				handleRowTypeChange,
				handleNumRowChange,
				handleRowSpacingChange,
				handleStockSizeChange,
				handleWindbreakChange,
				handlePropgationChange,
				handlePastureConversionChange,
			} = this;

			formProps = {
				...formProps,
				windbreak,
				propagation,
				rows,
				spacing_trees,
				spacing_rows,
				stock_size,
				drip_irrigation,
				pasture_conversion,
				handleTreeSpacingChange,
				handleDripIrrigationChange,
				handleRowSpeciesChange,
				handleRowTypeChange,
				handleNumRowChange,
				handleRowSpacingChange,
				handleStockSizeChange,
				handleWindbreakChange,
				handlePropgationChange,
				handlePastureConversionChange,
			};
		} else if (type === 'prairie') {
			const {
				state: {
					seed,
					seed_price,
					management,
					cropping_system,
					pest_control,
				},
				handleSeedMixChange,
				handlePestControlChange,
				handleManagementChange,
				handleCroppingChange,
				handleSeedPriceChange,
			} = this;

			formProps = {
				...formProps,
				seed,
				seed_price,
				management,
				cropping_system,
				pest_control,
				handleSeedMixChange,
				handlePestControlChange,
				handleManagementChange,
				handleCroppingChange,
				handleSeedPriceChange,
			};
		}

		return (
			<>
				<div className="modal margin-center">
					<Link className="CloseButton" to="/"><img src="../../assets/close_dropdown.svg" alt="Close Planting Modal" /></Link>
					{ type === 'tree' && <TreePlantingForm {...formProps} /> }
					{ type === 'prairie' && <PrairiePlantingForm {...formProps} /> }
					<div ref={this.bottom} />
				</div>
				<div className="button-wrap vertical-align">
					{formError && <p className="warning">{formError}</p>}
					{
						stepIndex === steps.length - 1
							? (
								<>
									<button
										type="button"
										className="modal-link"
										onClick={this.handleSave}
										onKeyPress={this.handleSave}
									>
										<span>View Map</span>
									</button>
									<button
										type="button"
										className="Button"
										onClick={this.handleSave}
										onKeyPress={this.handleSave}
									>
										<span>View Report</span>
									</button>
									{/* <Link
										onClick={this.handleSave}
										onKeyPress={this.handleSave}
										className="Button"
										to={{
											pathname: '/report',
											state: editingFeature,
										}}
									>
										<span>View Report</span>
									</Link> */}
								</>
							)
							: (
								<button
									type="button"
									className="Button"
									onClick={this.handleNextStep}
									onKeyPress={this.handleNextStep}
								>
									<span>Next</span>
								</button>
							)
					}
				</div>
			</>
		);
	}
}
