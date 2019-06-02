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


const PriceBlock = ({ title, listItems, price }) => {
  return (
    <Fade top>
      <div className="col-md-3 col-lg-4 m-3 align-self-start">
        <div className="card">
          <div className="card-body">
            <h4
              className="card-title p-3 bg-info text-white" >
              {title}
            </h4>
            <h5 className="card-subtitle mb-2 text-light">{price}</h5>
            <Fade top cascade delay={500}>
              <ul className="list-group list-group-flush text-white">
                {listItems.map((item, index) => {
                  return <li key={index} className="list-group-item">{item}</li>
                })}
              </ul>
            </Fade>
          </div>
        </div>
      </div>
    </Fade>
  )
}

const IconBlock = ({ text, iconClass }) => {
  return (
    <Fade bottom delay={500}>
      <div className="col-md-4 mb-4 text-center">
        <i className={iconClass} id="icons" />
        <p>{text}</p>
      </div>
    </Fade>
  )
}

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
    // console.log(this.props)
    return (
      <div className="container-fluid bg-light">
        <div className="row" id="header">
          <div className="col d-none d-md-block">
            <Fade top>
              <h1
                className="main-header p-2"
                id="title-line"
                style={{ marginTop: '50vh', textDecoration: 'none' }}
              >
                One Day At A Time
              </h1>
              <Button className='mb-3' color="info" onClick={this.signup}>Get Started</Button>
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
        <div className='row justify-content-center p-3' id="test-div">
          <div
            style={{ borderTop: '#008ed6 3px solid' }}
            id="demo-block"
            className="row justify-content-center p-2 align-items-center text-white section-row"
          >
            <div className="col-md-8 align-middle">
              <Fade bottom>
                <h1 className="section-header">Virtual Training</h1>
                <p>
                  Complete virtual training environment equipped to help you
                  manage your workout & achieve your goals.
                </p>
              </Fade>
              <Fade left>
                <img
                  className="d-block w-100 img-fluid rounded"
                  src={'https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/dash_prev.webp'}
                  alt="img of dash"
                />
              </Fade>
            </div>
          </div>
          <div
            id="icon-block"
            className="row p-3 text-dark section-row align-items-center"
          >
            <IconBlock
              text={
                'Train smarter with custom plans that factor in your body fat, BMR, and activity level instantly.'
              }
              iconClass={'fas fa-heartbeat py-2'}
            />
            <IconBlock
              text={
                'Manage your nutrition plan and tailor it to your food preferences and goals. Complimentary with each training program.'
              }
              iconClass={'fas fa-utensils py-2'}
            />
            <IconBlock
              text={
                'Track your progress, map out your training schedule, and put in the work! Let the system handle the light lifting while you do the heavy lifting.'
              }
              iconClass={'fas fa-calendar-check py-2'}
            />
          </div>
        </div>
        <div className="row p-3 bg-light justify-content-center quote-section section-row align-items-center">
          <div className="col-md-6">
            <Fade bottom>
              <blockquote className="blockquote">
                <p className="mb-0 font-italic text-dark" style={{fontSize:'medium'}}>
                  Based on over 10 years of training experience each plan is
                  crafted with some of my favorite exercises, and techniques I've
                  found to be most effective in building quality muscle and burning fat.
                  <br />
                  {/* <br/> */}
                  {/* Not just for myself but for my clients as well. */}
                </p>{' '}
                - Lyn
              </blockquote>
            </Fade>
            <Fade bottom delay={1000}>
              <ClientRoll />
            </Fade>
          </div>
        </div>
        <div id='price-block' className='row p-3 justify-content-center'>
          <div style={{backgroundColor:'transparent', width:'100%'}}
                className="row justify-content-center text-white p-4 text-white align-items-end">
            <Fade bottom>
              <div className="col-md-12">
                <h1 className="section-header">Pricing</h1>
                {/* <p>Complete virtual training environment equipped to <br/> help you manage your workout & achieve your goals.</p> */}
              </div>
            </Fade>
          </div>
          <div style={{backgroundColor:'transparent'}} 
                className="row justify-content-around pricing-section text-white align-items-center">
              <PriceBlock
                listItems={[
                  'Start/Stop Any Plan Anytime',
                  'Training & Nutrition Tracking',
                  'Excludes Downloads'
                ]}
                title={'Self Training'}
                price={'$8/month'}
              />
              <PriceBlock
                listItems={[
                  'Virtual Personal Training',
                  'Weekly Check-ins',
                  'Excludes Downloads'
                ]}
                title={'Personal Training'}
                price={'$18/month'}
              />
              <PriceBlock
                listItems={['PDF Download', 'Excludes Online System', 'One Time Payment']}
                title={'Training Plan'}
                price={'$30'}
              />
          </div>
          <div style={{backgroundColor:'transparent', width:'100%'}}
            className="row justify-content-center p-4 text-white align-items-start">
            <Fade bottom delay={500}>
              <div className="col">
              <Button color="info" onClick={this.signup}>Get Started</Button>
              </div>
            </Fade>
          </div>
        </div>
        <div className="row justify-content-center  bg-dark">
          <div className="col">
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
