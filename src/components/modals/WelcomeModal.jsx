import React from 'react'
import { Link } from 'react-router-dom'

export class WelcomeModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = { isDisplayed: true }
        this.toggleWelcomeModal = this.toggleWelcomeModal.bind(this)
    }

    toggleWelcomeModal() {
        let { isDisplayed } = this.state
        this.setState({ isDisplayed: !isDisplayed })
    }

    render() {
        let { isDisplayed } = this.state
        return (
            <React.Fragment>
                <div className={isDisplayed ? "WelcomeModal active grid-row" : "WelcomeModal grid-row"}>
                    <div className="grid-wrap">
                        <img className="CloseButton" onClick={this.toggleWelcomeModal} src="../../assets/close_dropdown.svg"></img>
                        <h2 className="modal-header">Welcome to the Prairie & Tree Planting Tool</h2>
                        <p className="modal-text">To get started, you can use your current location, 
                            add a location or address in the bar above. You 
                            can also pan to an area on the map. Once you have 
                            your location on the map, use the planting tools in 
                            the upper right side to plant your trees and prairies. 
                            If you need additional help, you can read the help <Link to="/help">help documentation</Link>.
                        </p>
                        <div>
                            <span className="modal-link">Dismiss helper popups</span>
                            <div className="Button">
                                <span>Let's Get Started</span>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}