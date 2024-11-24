import React, { Component } from 'react'
import './../styling/RightSideFormLayout.css'
import FlashMessages from '../components/FlashMessages'

export default class RightSideFormLayout extends Component {
  render() {
    return (
      <>
        <div className="overlay" onClick={this.props.overlayClickAction ? this.props.overlayClickAction : this.props.onClose}/>
        <div className='form-card slide-in-right'>
          <FlashMessages errorId="slider-error-message" successId="slider-success-message" />
          <button className="close-button" onClick={this.props.onClose}>×</button>
            {this.props.children}
        </div>
      </>
    )
  }
}
