import React, { Component } from 'react';
import LoginForm from './LoginForm';

class LoginModal extends Component {
  render() {
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
                {/* <h5 className="modal-title" id="exampleModalLabel">
                  Login
                </h5> */}
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
                <LoginForm/>
                <br/>
                or
                <a
                  href="/auth/google"
                  id="login-button"
                  className="btn btn-danger"
                >
                  <i className="fab fa-google" /> Continue With Google
                </a>
                <br />
                <br />
                <a
                  href="auth/facebook"
                  id="login-button"
                  className="btn btn-primary"
                >
                  <i className="fab fa-facebook-f" /> Continue With Facebook
                </a>
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

export default LoginModal;
