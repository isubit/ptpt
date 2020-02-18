import React from 'react';

const dismissed = [];

export const SmallModal = props => {
	const {
		buttonText,
		dismissHelpers,
		onClose,
		text,
		toggleHelper,
		helperFor,
	} = props;

	return dismissed.includes(helperFor) ? null : (
		<div className="SmallModal small-modal">
			<button
				className="CloseButton"
				type="button"
				onClick={() => {
					toggleHelper(null);
					onClose && onClose();
					helperFor && dismissed.push(helperFor);
				}}
			>
				<img src="../../assets/close_dropdown.svg" alt="close welcome modal" />
			</button>
			<p className="modal-text spacer-top-2">{text}</p>
			<div className="close-wrapper distribute vertical-align spacer-top-1">
				{
					(helperFor !== 'report') && <span className="modal-link" onClick={dismissHelpers} onKeyPress={dismissHelpers} role="button" tabIndex="0">Dismiss helper popups</span>
				}
				<button
					className="Button"
					type="button"
					onClick={() => {
						toggleHelper(null);
						onClose && onClose();
						helperFor && dismissed.push(helperFor);
					}}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};
