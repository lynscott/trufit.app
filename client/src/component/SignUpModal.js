import React, { Component } from 'react'
import SignUpForm from './SignUpForm'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class SignUpModal extends Component {
  render() {
    return (
      <div>
        <div
          className="modal fade"
          id="signUpModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="signUpModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              {/* <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div> */}
              
              <div className="modal-body p-0">
                <SignUpForm/>
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
    );
  }
}

export default SignUpModal;
