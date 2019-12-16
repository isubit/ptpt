import React from 'react';
import { Link } from 'react-router-dom';

const NumRowInput = (props) => {
	const {
		windbreak,
		numRows,
		handleNumRowChange,
		handleWindbreakChange,
		handlePropgationChange,
	} = props;
	let { propagation } = props;

	switch (propagation) {
		case 'N':
			propagation = 'North';
			break;
		case 'S':
			propagation = 'South';
			break;
		case 'W':
			propagation = 'West';
			break;
		case 'E':
			propagation = 'East';
			break;
		default:
			break;
	}

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<img src="../../assets/step1.svg" alt="Step 1" />
			</div>
			<div className="configInputs">
				<div className="inputElement">
					<span>Is this a windbreak?</span>
					<span className="inputLabel">Tree Rows</span>
					<select value={windbreak ? 'Yes' : 'No'} onChange={(e) => handleWindbreakChange(e)}>
						<option>Yes</option>
						<option>No</option>
					</select>
				</div>
				<div className="inputElement">
					<span>How many tree rows would you like to plant?</span>
					<select value={numRows} onChange={(e) => handleNumRowChange(e)}>
						<option>1</option>
						<option>2</option>
						<option>3</option>
						<option>4</option>
						<option>5</option>
						<option>6</option>
						<option>7</option>
						<option>8</option>
						<option>9</option>
						<option>10</option>
					</select>
				</div>
				<div className="inputElement">
					{/* <input type="checkbox" name="longest_length_rows" />
					<span>Configure rows to fit the longest length</span> */}
					<span>Choose a direction to plant your rows in.</span>
					<select
						value={propagation}
						onChange={(e) => handlePropgationChange(e)}
					>
						<option>North</option>
						<option>South</option>
						<option>West</option>
						<option>East</option>
					</select>
				</div>
			</div>
		</div>
	);
};

const RowDetailInput = (props) => {
	const {
		rows,
		handleRowTypeChange,
		handleRowSpeciesChange,
	} = props;
	// build the controlled input fields
	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<img src="../../assets/step2.svg" alt="Step 2" />
			</div>
			<div className="configInputs">
				<p>Choose a tree type and species for each row. Below are the recommended tree types and species based on your soil. You can change these by choosing a different option in each dropdown.</p>
				{
					rows.map((row, i) => (
						<div className="rowDetails">
							<div className="rowNumber">
								<span>Row {i + 1}</span>
							</div>
							<div className="rowInputs inputElement">
								<span className="inputLabel">Tree Type</span>
								<select value={row.type.display} onChange={(e) => handleRowTypeChange(e, i)}>
									<option>Type 1</option>
									<option>Type 2</option>
									<option>Type 3</option>
								</select>
								<span className="inputLabel">Tree Species</span>
								<select value={row.species.display} onChange={(e) => handleRowSpeciesChange(e, i)}>
									<option>Species 1</option>
									<option>Species 2</option>
									<option>Species 3</option>
								</select>
							</div>
						</div>
					))
				}
			</div>
		</div>
	);
};

const RowSpacingInput = (props) => {
	const {
		drip_irrigation,
		stock_size: {
			display: stock_size,
		},
		handleRowSpacingChange,
		handleTreeSpacingChange,
		handleStockSizeChange,
		handleDripIrrigationChange,
	} = props;
	let {
		spacing_trees: {
			value: tree_spacing,
		},
		spacing_rows: {
			value: row_spacing,
		},
	} = props;

	switch (row_spacing) {
		case 3:
			row_spacing = '3\'';
			break;
		case 4:
			row_spacing = '4\'';
			break;
		case 5:
			row_spacing = '5\'';
			break;
		default:
			break;
	}

	switch (tree_spacing) {
		case 3:
			tree_spacing = '3\'';
			break;
		case 4:
			tree_spacing = '4\'';
			break;
		case 5:
			tree_spacing = '5\'';
			break;
		default:
			break;
	}

	return (
		<div className="ConfigForm">
			<div className="stepNumber">
				<img src="../../assets/step3.svg" alt="Step 3" />
			</div>
			<div className="configInputs">
				<p>Choose the spacing you need in between the trees and what size you plan on purchasing the plantings. Recommendations based on your soil type and slope percentage are prefilled.</p>
				<div className="inputElement">
					<span className="inputLabel">Spacing Between Rows</span>
					<select
						value={row_spacing}
						onChange={(e) => handleRowSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div className="inputElement">
					<span className="inputLabel">Spacing Between Trees</span>
					<select
						value={tree_spacing}
						onChange={(e) => handleTreeSpacingChange(e)}
					>
						<option>3&apos;</option>
						<option>4&apos;</option>
						<option>5&apos;</option>
					</select>
				</div>
				<div className="inputElement">
					<span className="inputLabel">Planting Stock Size</span>
					<select value={stock_size} onChange={(e) => handleStockSizeChange(e)}>
						<option>Stock Size 1</option>
						<option>Stock Size 2</option>
						<option>Stock Size 3</option>
					</select>
				</div>
				<div className="inputElement">
					<input type="checkbox" name="drip_irrigation" checked={drip_irrigation} onChange={(e) => handleDripIrrigationChange(e)} />
					<span>I&apos;m using drip irrigation</span>
				</div>
			</div>
		</div>
	);
};

export class TreePlantingModal extends React.Component {
	constructor(props) {
		super(props);
		const {
			editingFeature,
		} = props;

		const type = editingFeature.properties.type || 'tree';
		const configs = editingFeature.properties.configs || (
			{
				windbreak: false,
				propagation: 'N',
				rows: [],
				spacing_rows: {
					value: 3, // placeholder value
					unit: 'feet',
				},
				spacing_trees: {
					value: 3, //  placeholder value
					unit: 'feet',
				},
				stock_size: {
					id: 1, // placeholder id
					display: 'Stock Size 1',
				},
				drip_irrigation: false,
			}
		);
		this.state = {
			...configs,
			stepIndex: 0,
			type,
		};
	}

	componentDidUpdate() {
	}

	componentDidMount() {
		// initialize first row if editingFeature has not been configured before (recommended type/species)
		if (this.state.rows.length === 0) {
			// const updateRows = this.generateRecommendedRowConfig(...);
			const updateRows = {
				type: {
					id: 1,
					display: 'Type 1',
				},
				species: {
					id: 15,
					display: 'Species 3',
				},
			};
			this.setState(({ rows: [updateRows] }));
		}

		// set the recommended spacing and stock size
	}

	// generateRecommendedRowConfig() {
	// 	// depending on soil type generate tree config for row
	// }

	// generateRecommendedTreeSpacing() {
	// 	// depending on soil type generate tree config for row
	// }

	// generateRecommendedRowSpacing() {
	// 	// depending on soil type generate tree config for row
	// }

	handleNumRowChange = (event) => {
		const {
			rows,
		} = this.state;

		let updateRows = [];
		if (event.target.value < rows.length) {
			updateRows = rows.splice(0, event.target.value);
			this.setState({ rows: updateRows });
		} else if (event.target.value > rows.length) {
			// need to generate recommended row type/species
			updateRows = [...rows];
			for (let i = 0; i < event.target.value - rows.length; i += 1) {
				// test data
				updateRows.push({
					type: {
						id: 1,
						display: 'Type 1',
					},
					species: {
						id: 15,
						display: 'Species 3',
					},
				});
			}
			this.setState({ rows: updateRows });
		}
	}

	handleWindbreakChange = (event) => {
		const updateWindbreak = (event.target.value === 'Yes') || false;
		this.setState({ windbreak: updateWindbreak });
	}

	handlePropgationChange = (event) => {
		let updatePropagation;
		switch (event.target.value) {
			case 'North':
				updatePropagation = 'N';
				break;
			case 'South':
				updatePropagation = 'S';
				break;
			case 'West':
				updatePropagation = 'W';
				break;
			case 'East':
				updatePropagation = 'E';
				break;
			default:
				updatePropagation = null;
				break;
		}
		this.setState({ propagation: updatePropagation });
	}

	handleRowTypeChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].type.display = event.target.value;
		this.setState({ rows });
	}

	handleRowSpeciesChange = (event, rowIndex) => {
		const {
			rows,
		} = this.state;
		rows[rowIndex].species.display = event.target.value;
		this.setState({ rows });
	}

	handleRowSpacingChange = (event) => {
		const spacingValue = Number(event.target.value.substring(0, 1));
		this.setState((state) => ({
			spacing_rows: {
				...state.spacing_rows,
				value: spacingValue,
			},
		}), () => console.log(this.state));
	}

	handleTreeSpacingChange = (event) => {
		const spacingValue = Number(event.target.value.substring(0, 1));
		this.setState((state) => ({
			spacing_trees: {
				...state.spacing_trees,
				value: spacingValue,
			},
		}), () => console.log(this.state));
	}

	handleStockSizeChange = (event) => {
		const stockSize = event.target.value;
		this.setState((state) => (
			{
				stock_size: {
					...state.stock_size,
					display: stockSize,
				},
			}
		), () => console.log(this.state));
	}

	handleDripIrrigationChange = (event) => {
		const updateDripIrrigation = event.target.checked;
		this.setState({ drip_irrigation: updateDripIrrigation });
	}

	handleNextStep = () => {
		const {
			nextStep,
			steps,
		} = this.props;

		this.setState((state) => ({
			stepIndex: state.stepIndex + 1,
		}), () => {
			nextStep(`/plant/tree/${steps[this.state.stepIndex]}`);
		});
	}

	handleSave = () => {
		const {
			props: {
				editingFeature,
				saveFeature,
				setEditingFeature,
			},
			state: {
				type,
				propagation,
				rows,
				spacing_trees,
				spacing_rows,
				stock_size,
				drip_irrigation,
				windbreak,
			},
		} = this;

		const properties = {
			type,
			configs: {
				propagation,
				windbreak,
				rows,
				spacing_rows,
				spacing_trees,
				stock_size,
				drip_irrigation,
			},
		};

		editingFeature.properties = properties;
		setEditingFeature(editingFeature);
		saveFeature();
	}

	render() {
		const {
			props: {
				step,
			},
			state: {
				windbreak,
				propagation,
				rows,
				spacing_trees,
				spacing_rows,
				stock_size,
				drip_irrigation,
				stepIndex,
			},
		} = this;
		return (
			<>
				<div className="modal margin-center">
					<Link to="/"><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="Close Planting Modal" /></Link>
					<h2 className="modal-header">Configure your tree rows below.</h2>
					<NumRowInput windbreak={windbreak} propagation={propagation} numRows={rows.length} handleNumRowChange={this.handleNumRowChange} handleWindbreakChange={this.handleWindbreakChange} handlePropgationChange={this.handlePropgationChange} />
					{
						(step === 'species' || step === 'spacing') && (
							<RowDetailInput rows={rows} handleRowTypeChange={this.handleRowTypeChange} handleRowSpeciesChange={this.handleRowSpeciesChange} />
						)
					}
					{
						(step === 'spacing') && (
							<RowSpacingInput spacing_trees={spacing_trees} spacing_rows={spacing_rows} stock_size={stock_size} drip_irrigation={drip_irrigation} handleRowSpacingChange={this.handleRowSpacingChange} handleTreeSpacingChange={this.handleTreeSpacingChange} handleStockSizeChange={this.handleStockSizeChange} handleDripIrrigationChange={this.handleDripIrrigationChange} />
						)
					}
				</div>
				<div className="button-wrap vertical-align">
					{
						stepIndex <= 1 && (
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
					{
						stepIndex === 2 && (
							<button
								type="button"
								className="Button"
								onClick={this.handleSave}
								onKeyPress={this.handleSave}
							>
								<span>View Map</span>
							</button>
						)
					}
				</div>
			</>
		);
	}
}
