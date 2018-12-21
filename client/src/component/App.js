import React, { Component } from 'react'
import TypeList from '../containers/types.js'
import TypeDetail from '../containers/type_detail'
import PlanDetail from '../containers/plan_detail'
import PlanList from '../containers/plans.js'
import InfoBar from '../containers/user_info.js'
import ClientRoll from './Clients.js'
import ContactForm from './ContactForm.js'
import PremiumPlans from './PremiumPlans.js'
import Footer from './Footer.js'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Fade from 'react-reveal/Fade'
import Alert from 'react-s-alert'
import logo from '../img/logo_sm.png'
import { Spring } from 'react-spring'
import gif from '../img/dashboard.gif'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/scale.css'
import './App2.scss'

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
                {listItems.map(item => {
                  return <li className="list-group-item">{item}</li>
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

    this.state = { users: [], text: '' }
    this.sendEmail = this.sendEmail.bind(this)
  }

  componentDidMount() {
    //TODO: Create refresh token
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
    }
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
    console.log(this.props)
    return (
      <div className="container-fluid bg-light">
        <div className="row" id="header">
          <div className="col">
            <Fade top>
              <h1
                className="section-header p-2"
                id="title-line"
                style={{ marginTop: '50vh', textDecoration: 'none' }}
              >
                One Day At A Time
              </h1>
            </Fade>

            <Fade top delay={1000}>
              <button
                data-toggle="modal"
                data-target="#signUpModal"
                className="btn btn-info"
              >
                Get Started
              </button>
              {/* <br/> */}
              or
              {/* <br/> */}
              <button
                data-toggle="modal"
                data-target="#exampleModal"
                className="btn btn-primrary"
              >
                Sign In
              </button>
            </Fade>
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
                  src={gif}
                  alt="gif"
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
                'Custom nutrition plans tailored to help you reach your fitness goal. Complimentary with each training program.'
              }
              iconClass={'fas fa-utensils py-2'}
            />
            <IconBlock
              text={
                'Training environment to help you manage your goals, track your progress, and plan your training schedule.'
              }
              iconClass={'fas fa-calendar-check py-2'}
            />
          </div>
        </div>
        <div className="row p-3 bg-light justify-content-center qoute-section section-row align-items-center">
          <div className="col-md-8">
            <Fade bottom>
              <blockquote className="blockquote">
                <p className="mb-0 font-italic text-dark">
                  Based on over 10 years of training experience each plan is
                  crafted with some my favorite excercises and techniques I've
                  found to be most effective, whatever your fitness goal may be.
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
                  'Complete Training & Nutrition',
                  'Excludes Downloads'
                ]}
                title={'Unlimited Plan '}
                price={'$8/month'}
              />
              <PriceBlock
                listItems={[
                  'Virtual Personal Training',
                  'Maximum Customization',
                  'Weekly One on One Check-Ins'
                ]}
                title={'Unlimited Training'}
                price={'$18/month'}
              />
              <PriceBlock
                listItems={['PDF Download', 'Virtual Training System', 'One Time Payment']}
                title={'Single Plan'}
                price={'$30'}
              />
          </div>
          <div style={{backgroundColor:'transparent', width:'100%'}}
            className="row justify-content-center p-4 text-white align-items-start">
            <Fade bottom delay={500}>
              <div className="col">
                <button
                  data-toggle="modal"
                  className="btn btn-info"
                  data-target="#signUpModal"
                >
                  Sign Up
                </button>
              </div>
            </Fade>
          </div>
        </div>
        <div className="row p-3 justify-content-center align-items-top bg-dark">
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
