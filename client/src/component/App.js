import React, { Component } from 'react'
import ClientRoll from './Clients.js'
import ContactForm from './ContactForm.js'
import PremiumPlans from './PremiumPlans.js'
import Footer from './Footer.js'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Fade from 'react-reveal/Fade'
import Alert from 'react-s-alert'
import { Spring } from 'react-spring'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/scale.css'
import './App2.scss'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


class App extends Component {
  constructor(props) {
    super(props)

    this.state = { 
      users: [], 
      text: '' ,
      modal: false,
      signup: false
    }

    this.sendEmail = this.sendEmail.bind(this)
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

  componentDidMount() {
    //TODO: Create refresh token
    // this.props.fetchUser()
    // if (localStorage.getItem('token')) {
    //   let token = localStorage.getItem('token')
    //   this.props.mountToken(token)
    //   this.props.fetchUserLocal(token)
    // } else {
    //   this.props.fetchUser()
    // }
  }

  sendEmail(name, email, text) {
    fetch('/email', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ name: name, email: email, text: text })
    }).then(res => res.json())
  }

  render() {
    return (
      <div className="container-fluid bg-light">
        <div className="row" id="header">
          <div className="col d-md-block">
            <Fade top>
              <h1
                className="main-header p-2"
                id="title-line"
                style={{ marginTop: '10vh', textDecoration: 'none' }}
              >
                <img src={require("./images/FT1-01-T.png")} style={{maxWidth:300,minWidth:10,marginBottom:0}} />
              </h1>
              <div className="arrow bounce"><a className="fa fa-arrow-down fa-2x"></a></div>
              <Button className='mb-3 MainButton' color="info" onClick={this.signup}>GET STARTED</Button>
              {/* <Button className='my-3' color="secondary" onClick={this.toggle}>Sign In</Button> */}
            </Fade>
            <div className='row pt-3' >
              <Fade top delay={1000}>

                <Modal isOpen={this.state.signup} toggle={this.signup}>
                  <ModalBody>
                    <SignUpForm closeForm={this.signup}/>
                  </ModalBody>
                  <ModalFooter style={{padding:'0.5rem'}}>
                    {/* <Button color="primary" onClick={this.toggle}>Sign Up</Button>{' '} */}
                    <Button color="secondary" onClick={this.signup}>Cancel</Button>
                  </ModalFooter>
                </Modal>   
  
                <Modal isOpen={this.state.modal} toggle={this.toggle}>
                  <ModalHeader toggle={this.toggle}>Welcome Back!
                  </ModalHeader>
                  <ModalBody>
                    <LoginForm closeForm={this.toggle}/>
                  </ModalBody>
                  <ModalFooter style={{padding:'0.5rem'}}>
                    {/* <Button color="primary" onClick={this.toggle}>Sign Up</Button>{' '} */}
                    <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                  </ModalFooter>
                </Modal>

              </Fade>
              </div>
          </div>
        </div>

       
       
        <div className="row justify-content-center">
          <div className="col footer">
            <Footer />
          </div>
        </div>
      </div>

    )
  }
}

export default connect(
  null,
  actions
)(App)
