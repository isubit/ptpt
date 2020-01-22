import React from 'react';

export const SmallModal = props => {
	const {
		buttonText,
		dismissHelpers,
		onClose,
		text,
		toggleHelper,
	} = props;

	return (
		<div className="SmallModal small-modal">
			<button
				className="CloseButton"
				type="button"
				onClick={() => {
					toggleHelper(null);
					onClose && onClose();
				}}
			>
				<img src="../../assets/close_dropdown.svg" alt="close welcome modal" />
			</button>
			<p className="modal-text spacer-top-2">{text}</p>
			<div className="close-wrapper distribute vertical-align spacer-top-1">
				<span className="modal-link" onClick={dismissHelpers} onKeyPress={dismissHelpers} role="button" tabIndex="0">Dismiss helper popups</span>
				<button
					className="Button"
					type="button"
					onClick={() => {
						toggleHelper(null);
						onClose && onClose();
					}}
				>
					{buttonText}
				</button>
			</div>
		</div>
	);
};
