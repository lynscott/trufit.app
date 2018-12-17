import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import logo from '../img/logo.png'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Login from './Login'
import SignUpModal from './SignUpModal'
import LoadingBar from './LoadingBar'

class Nav extends Component {
  renderContent() {
    switch (this.props.auth.user) {
      case false:
        return <LoadingBar />
      case null:
        return [
          <a
            className="nav-item nav-link px-2"
            data-toggle="modal"
            data-target="#exampleModal"
            key='1'
          >
            Sign-in
          </a>,
          <a
            className="nav-item nav-link px-2"
            data-toggle="modal"
            data-target="#signUpModal"
            key='2'
          >
            Sign-up
        </a>
        ]
      default:
        return [
          <Link
            key="1"
            className="nav-item nav-link active px-2"
            to={'/dashboard'}
          >
            Dashboard
          </Link>,
          <a
            href={localStorage.getItem('token') ? '/' : '/api/logout'}
            key="2"
            id="title"
            onClick={()=> localStorage.getItem('token') ? this.props.signUserOut(this.props.history) : null}
            className="nav-item nav-link px-2"
          >
            Sign-out
          </a>
        ]
    }
  }

  componentDidMount() {
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
    }
    
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <nav className="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
          <Link
            className="navbar-brand mx-auto d-block"
            style={{ width: 150 }}
            id="title"
            to="/"
          >
            <img
              src={logo}
              className="d-inline-block align-top"
              width="200"
              height="60"
              alt="logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav ml-auto">
              <Link className="nav-item nav-link px-2 " id="title" to="/about">
                About
              </Link>
              {/* <Link
                className="nav-item nav-link px-2"
                id="title"
                to="/training"
              >
                Online Training
              </Link> */}
              {this.renderContent()}
            </div>
          </div>
        </nav>
        <Login />
        <SignUpModal />
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default withRouter(connect(mapStateToProps, actions)(Nav))
