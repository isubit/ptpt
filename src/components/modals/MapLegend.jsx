import React from 'react';
import { Link } from 'react-router-dom';

export const MapLegend = ({
	router: {
		location: {
			pathname,
		},
	},
}) => (
	<div className="MapLegend modal">
		<div className="grid-row">
			<div className="grid-wrap">
				<Link className="CloseButton" to={pathname}><img className="CloseButton" src="../../assets/close_dropdown.svg" alt="close legend modal" /></Link>
				<h2 className="modal-header">Map Legend</h2>
				<div className="modal-text">
					<div className="SSURGO">
						<h3 className="spacer-bottom-1">SSURGO / CSR</h3>
						<div>
							<div className="gradient" />
							<div className="labels distribute">
								<span>100</span>
								<span>50</span>
								<span>0</span>
							</div>
						</div>
					</div>
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
	</div>
);
