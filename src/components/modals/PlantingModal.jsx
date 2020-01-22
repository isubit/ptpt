import React from 'react';
// import { Link } from 'react-router-dom';

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
						value: 10,
						unit: 'feet',
					},
					spacing_trees: {
						value: 5,
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
			selectForAllRows: false,
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
		const {
			rows,
			selectForAllRows,
		} = this.state;
		const numRows = typeof event === 'number' ? event : event.target.value;
		// if the number of rows change and the number is greater than 1 and selectForAllRows is true, update all the new rows to have the same type and species as the first.
		this.setState((state) => {
			let updateRows = [];
			if (numRows < state.rows.length) {
				updateRows = state.rows.splice(0, numRows);
				return {
					rows: updateRows,
				};
			}
			if (!selectForAllRows) {
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
			} else if (numRows > 1 && numRows > state.rows.length) {
				updateRows = [...state.rows];
				for (let i = 0; i < numRows - state.rows.length; i += 1) {
					updateRows.push({
						type: rows[0].type,
						species: rows[0].species,
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
			if (this.state.rows.length >= 4 && this.state.windbreak === true) {
				this.handleNumRowChange(1);
			} else if (this.state.rows.length > 4) {
				this.handleNumRowChange(4);
			}
		});
	}

	handleSelectForAllRows = (event) => {
		// if checked then take the first row type and species and apply it to all rows
		const {
			rows,
		} = this.state;
		// check if the first row is filled, if not do nothing
		const updateSelectForAllRows = event.target.checked;
		this.setState({
			selectForAllRows: updateSelectForAllRows,
		}, () => {
			// if selectForAllRows is true, then pull the first row species and type then assign these to all the rows.
			if (this.state.selectForAllRows) {
				const {
					type,
					species,
				} = rows[0];
				// set the state for all the rows -- build a new row array
				const updatedRows = [];
				for (let i = 0; i < rows.length; i += 1) {
					const row = {
						type,
						species,
					};
					updatedRows.push(row);
				}
				this.setState(() => (
					{
						rows: updatedRows,
					}
				));
			} else {
				// make all the rows after first empty
				const updatedRows = [rows[0]];
				for (let i = 0; i < rows.length - 1; i += 1) {
					const row = {
						type: '',
						species: '',
					};
					updatedRows.push(row);
				}
				this.setState(() => (
					{
						rows: updatedRows,
					}
				));
			}
		});
	}

	handlePropgationChange = (event) => {
		const updatePropagation = event.target.value;
		this.setState({ propagation: updatePropagation });
	}

	handlePastureConversionChange = (event) => {
		const updateConversion = event.target.checked;
		this.setState({ pasture_conversion: updateConversion });
	}

	handleRowTypeChange = (event, rowIndex) => {
		const {
			rows,
			selectForAllRows,
		} = this.state;
		const updatedRowType = event.target.value;
		if (selectForAllRows && rowIndex === 0) {
			// change all the rows to the type of the first row
			const rowMap = rows.map(row => {
				const updatedRow = {
					type: updatedRowType,
					species: row.species,
				};
				return updatedRow;
			});
			console.log(rowMap);
			this.setState({
				rows: rowMap,
			});
		} else {
			rows[rowIndex].type = updatedRowType;
			this.setState({ rows });
		}
	}

	handleRowSpeciesChange = (event, rowIndex) => {
		const {
			rows,
			selectForAllRows,
		} = this.state;
		const updatedRowSpecies = event.target.value;
		if (selectForAllRows && rowIndex === 0) {
			// change all the rows to the type of the first row
			const rowMap = rows.map(row => {
				const updatedRow = {
					type: row.type,
					species: updatedRowSpecies,
				};
				return updatedRow;
			});
			this.setState({
				rows: rowMap,
			});
		} else {
			rows[rowIndex].species = updatedRowSpecies;
			this.setState({ rows });
		}
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

	handleSave = (e) => {
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
		const setReportFeature = e.target.innerHTML === 'View Report' || (e.target.children[0] ? e.target.children[0].innerText === 'View Report' : false);

		if (this.form.current && this.form.current.checkValidity()) {
			this.setState(() => ({
				formError: null,
			}), () => {
				editingFeature.properties = {
					...editingFeature.properties,
					...properties,
				};
				saveFeature(editingFeature, setReportFeature);
			});
		} else {
			this.setState(() => ({
				formError: 'Please fill in all fields before saving.',
			}));
		}
	}

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
					selectForAllRows,
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
				handleSelectForAllRows,
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
				selectForAllRows,
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
				handleSelectForAllRows,
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
				<div className="modal">
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
