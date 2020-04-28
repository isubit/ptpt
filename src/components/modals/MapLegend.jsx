import React from 'react';
import { Link } from 'react-router-dom';

const SSURGOTable = () => {
	// color of swatches are incomplete for (0-5, 6-10, & 11-20)
	const SSURGOLegendData = [
		{ range: [91, 100], indicator_color: '#668867' },
		{ range: [81, 90], indicator_color: '#73926F' },
		{ range: [71, 80], indicator_color: '#809C76' },
		{ range: [61, 70], indicator_color: '#8CA47F' },
		{ range: [51, 60], indicator_color: '#9BAF89' },
		{ range: [41, 50], indicator_color: '#AAB991' },
		{ range: [31, 40], indicator_color: '#DAD8B1' },
		{ range: [21, 30], indicator_color: '#ECE4BB' },
		{ range: [11, 20], indicator_color: '#cccf93' },
		{ range: [6, 10], indicator_color: '#e6dda1' },
		{ range: [0, 5], indicator_color: '#ffebb0' },
	];
	const IA_RATING_CONSTANT = 2.72;

	return (
		<div className="SSURGO">
			<h3 className="ssurgo-table-header spacer-bottom-1">gSSURGO - SLR</h3>
			<div className="ssurgo-legend-table">
				<div className="ssurgo-table-labels ssurgo-table-row">
					<p>IA CSR</p>
					<p>AVERAGE RENT ($/ACRE)</p>
				</div>
				{
					SSURGOLegendData.map((el, index) => {
						const highlight = index % 2 === 0 ? 'light-blue' : '';
						return (
							<div className={`ssurgo-table-row ${highlight}`}>
								<p className="ssurgo-range">{`${el.range[0]}-${el.range[1]}`}</p>
								<div className="ssurgo-rent">
									<div className="ssurgo-color-indicator" style={{ backgroundColor: el.indicator_color }} />
									<p>{`$${Math.round(el.range[0] * IA_RATING_CONSTANT)} - $${Math.round(el.range[1] * IA_RATING_CONSTANT)}`}</p>
								</div>
							</div>
						);
					})
				}
			</div>
		</div>
	);
};

export const MapLegend = ({
	router: {
		location: {
			pathname,
		},
	},
}) => (
	<div className="MapLegend modal">
		<div className="legend-header">
			<Link className="CloseButton" to={pathname}><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="close legend modal" /></Link>
			<h2 className="modal-header">Legend</h2>
		</div>
		<div className="legend-text">
			<div className="modal-text">
				<SSURGOTable />
				<div className="Contours spacer-top-2">
					<h3 className="spacer-bottom-1">Contours</h3>
					<div>
						<div className="vertical-align">
							<img className="spacer-right-1" src="/assets/contour_legend.svg" alt="contour lines" />
							<span>2&apos; Contours</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
);
