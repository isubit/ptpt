import React from 'react';
import {
	Link,
} from 'react-router-dom';

import { MapConsumer } from 'contexts/MapState';

export const SaveModal = () => (
	<MapConsumer>
		{ctx => (
			<div className="SaveModal modal">
				<div className="grid-row">
					<div className="grid-wrap">
						<Link className="CloseButton" to="/"><img src="../../assets/close_dropdown.svg" alt="close save modal" /></Link>
						<h2 className="modal-header">Save Your File</h2>
						<p className="modal-text">
							{/* eslint-disable-next-line max-len */}
							When you save your file, it will save your progress and download a file that you can then reupload at any time to continue using the application.
							<br />
              <br />
							If you come back to the application using the same device and browser, it will automatically load your progress.
							<br />
              <br />
							You can also email the file to others and have them upload the file to view your progress.
						</p>
						<div className="modal-footer">
							<div className="button-wrap">
								<button className="Button" type="button" onClick={ctx.save} onKeyPress={ctx.save}>Save</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)}
	</MapConsumer>
);
