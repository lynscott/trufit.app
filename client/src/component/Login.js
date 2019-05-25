import React, { Component } from 'react'
import LoginForm from './LoginForm'
import {isMobileSafari, isSafari, osName, isIOS} from 'react-device-detect'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class LoginModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: false
    }

    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }


  render() {
    console.log(isMobileSafari, isSafari, isIOS ,'SAF?')
    return (
      <div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                { !isMobileSafari ? <LoginForm/> :
                 'Mobile Safari is not fully supported for web apps (like this one) please use' 
                 + ' Chrome or Firefox instead!'}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginModal;
