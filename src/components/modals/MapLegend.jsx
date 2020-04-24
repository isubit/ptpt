import React from 'react';
import { Link } from 'react-router-dom';

const SSURGOTable = () => {
	const SSURGOLegendData = [
		['91-100', '$248 - $272', '#226633'],
		['81-90', '$220 - $245', '#35733d'],
		['71-80', '$205 - $220', '#488047'],
		['61-70', '$195 - $205', '#5b8a51'],
		['51-60', '$184 - $196', '#71995f'],
		['41-50', '$175 - $185', '#86a66a'],
		['31-40', '$161 - $174', '#9cb378'],
		['21-30', '$154 - $162', '#b2bf84'],
		['11-20', '$154 - $162', '#cccf93'],
		['6-10', '$154 - $162', '#e6dda1'],
		['0-5', '$154 - $162', '#ffebb0'],
	];
	return (
		<div className="SSURGO">
			<h3 className="ssurgo-table-header spacer-bottom-1">gSSURGO - SLR</h3>
			<div className="ssurgo-legend-table">
				<div className="ssurgo-table-labels ssurgo-table-row">
					<p>IA CSR</p>
					<p>AVERAGE RENT ($.ACRE)</p>
				</div>
				{
					SSURGOLegendData.map((SSURGOElement, index) => {
						const highlight = index % 2 === 0 ? 'light-blue' : '';
						return (
							<div className={`ssurgo-table-row ${highlight}`}>
								<p>{SSURGOElement[0]}</p>
								<div className="ssurgo-rent">
									<div className="ssurgo-color-swatch" style={{ backgroundColor: SSURGOElement[2] }} />
									<p>{SSURGOElement[1]}</p>
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
