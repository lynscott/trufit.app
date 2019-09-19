import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import * as actions from '../actions'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import LoadingBar from './LoadingBar'
import { Button } from 'reactstrap'

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

class Nav extends Component {
  constructor(props) {
    super(props)

    this.state = {
      modal: false,
      signup: false,
      scroll: window.pageYOffset,
    }

    this.toggle = this.toggle.bind(this)
    this.signup = this.signup.bind(this)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  signup() {
    this.setState({
      signup: !this.state.signup
    })
  }

  signInModal = () => {
    return (
      <Modal isOpen={this.state.modal} toggle={this.toggle}>
        <ModalHeader toggle={this.toggle}>Welcome Back!</ModalHeader>
        <ModalBody>
          <LoginForm closeForm={this.toggle} />
        </ModalBody>
        <ModalFooter style={{padding:'0.5rem'}}>
          {/* <Button color="primary" onClick={this.toggle}>Sign Up</Button>{' '} */}
          <Button color="secondary" onClick={this.toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  signUpModal = () => {
    return (
      <Modal isOpen={this.state.signup} toggle={this.signup}>
        {/* <ModalHeader toggle={this.toggle}>Welcome Back!
        </ModalHeader> */}
        <ModalBody>
          <SignUpForm closeForm={this.signup} />
        </ModalBody>
        <ModalFooter style={{padding:'0.5rem'}}>
          {/* <Button color="primary" onClick={this.toggle}>Sign Up</Button>{' '} */}
          <Button color="secondary" onClick={this.signup}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    )
  }

  

  renderContent() {
    switch (this.props.auth.user) {
      case false:
        return <LoadingBar />
      case null:
        return [
          // <a className="nav-item nav-link px-2" key="1" onClick={this.toggle}>
          //   Sign-in
          // </a>,
          // <a className="nav-item nav-link px-2" onClick={this.signup} key="2">
          //   Sign-up
          // </a>
        ]
      default:
        return [
          <Link
            key="1"
            className="nav-item nav-link active px-2"
            to={'/dashboard/overview'}
          >
            Dashboard
          </Link>,
          // <a
          //   onClick={()=>this.props.signOut()}
          //   key="2"
          //   id="title"
          //   className="nav-item nav-link px-2"
          // >
          //   Sign-out
          // </a>
        ]
    }
  }

  componentDidMount() {
    // if (localStorage.getItem('token')) {
    //   let token = localStorage.getItem('token')
    //   this.props.mountToken(token)
    //   this.props.fetchUserLocal(token)
    // }
    //if (this.props.auth.user !== null)
    //      this.props.fetchUser()
  }

  render() {
    // console.log(this.props)
    return (
      <div className="row" >
        <nav className="navbar fixed-top navbar-expand-sm navbar-dark mainNavbar">
          <Link
            className="navbar-brand d-md-block main-logo"
            id="title"
            to="/"
          >
            <img
              src={require('./images/FT1-01.png')}
              className="d-inline-block align-top "
              width="48"
              height="48"
              alt="logo"
              style={{borderRadius:18,marginLeft:5}}
            />
          </Link>

          {/* {this.renderContent()} */}

          <button
            className="navbar-toggler nav-button"
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
              {/* <Link className="nav-item nav-link px-2 " id="title" to="/about">
                About
              </Link> */}
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
        {this.signUpModal()}
        {this.signInModal()}
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(Nav)
)
