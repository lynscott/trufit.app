import React, { Component } from "react"
import TypeList from "../containers/types.js"
import TypeDetail from "../containers/type_detail"
import PlanDetail from "../containers/plan_detail"
import PlanList from "../containers/plans.js"
import InfoBar from "../containers/user_info.js"
import ClientRoll from "./Clients.js"
import ContactForm from "./ContactForm.js"
import PremiumPlans from "./PremiumPlans.js"
import Footer from "./Footer.js"
import { connect } from "react-redux"
import * as actions from "../actions"
import Fade from 'react-reveal/Fade'
import Alert from "react-s-alert"
import logo from "../img/logo_sm.png"
import { Spring } from "react-spring"
import gif from '../img/dashboard.gif'
import "react-s-alert/dist/s-alert-default.css"
import "react-s-alert/dist/s-alert-css-effects/scale.css"
import './App2.scss'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = { users: [], text: "" }
    this.sendEmail = this.sendEmail.bind(this)
  }

  componentDidMount() {
    this.props.fetchUser()
    if (localStorage.getItem('token')) {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
    }
    
  }

  sendEmail(name, email, text) {
    fetch("/email", {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify({ name: name, email: email, text: text })
    }).then(res => res.json())
  }

  render() {
    // console.log(this.props)
    return (
      <div className="container-fluid">
        <div className="row" id="header">
        
          <div className="col">
          
          <Fade top>
            <h1 className='section-header p-2' id='title-line' style={{ marginTop: "50vh", textDecoration: 'none' }}>
            
            One Day At A Time
            </h1>
            </Fade>
          
          <Fade top delay={1000}>
            <button 
            data-toggle="modal"
            data-target="#signUpModal"
            className="btn btn-info">Get Started</button>

            {/* <br/> */}
            or
            {/* <br/> */}
            <button 
            data-toggle="modal"
            data-target="#exampleModal"
            className="btn btn-primrary">Sign In</button>
          </Fade>
          </div>
        
        </div>
        <div className="row justify-content-center p-4 align-items-center text-white section-row">
          <div className="col-md-4 align-middle">
          <Fade bottom>
            <h1 className='section-header'>Virtual Training</h1>
            <p>Complete virtual training environment equipped to help you manage your workout & achieve your goals.</p>
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
        <div className="row p-3 text-white section-row align-items-center">
        <Fade bottom >
          <div className="col-md-4 mb-4 text-center">
            <i className="fas fa-heartbeat py-2" id="icons" />
            <p>
              Train smarter with custom plans that factor in your body fat, BMR,
              and activity level instantly.
            </p>
          </div>
          </Fade>
          <Fade bottom delay={500}>
          <div className="col-md-4 mb-4 text-center">
            <i className="fas fa-utensils py-2" id="icons" />
            <p>
              Custom nutrition plans tailored to help you reach your fitness
              goal. Complimentary with each training program.
            </p>
          </div>
          </Fade>
          <Fade bottom delay={1000}>
          <div className="col-md-4 mb-4 text-center">
            <i className="fas fa-calendar-check py-2" id="icons" />
            <p>
              Training environment to help you manage your goals, 
              track your progress, and plan your training schedule.
            </p>
          </div>
          </Fade>
        </div>
        <div className="row p-3 bg-light justify-content-center qoute-section section-row align-items-center">
          <div className="col-md-8">
          <Fade bottom>
            <blockquote className="blockquote">
            <p className="mb-0 font-italic">
              Based on over 10 years of training experience each plan is crafted with some my 
              favorite excercises and techniques I've found to be most effective, whatever your fitness goal may be.
              <br/>
              {/* <br/> */}
              {/* Not just for myself but for my clients as well. */}
            </p> - Lyn
            </blockquote>
          </Fade>
          <Fade bottom delay={1000}>
            <ClientRoll/>
          </Fade>
          </div>
        </div>
        <div className="row justify-content-center text-white p-4 text-white bg-secondary align-items-end">
        <Fade bottom>
          <div className="col">
            <h1 className='section-header'>Pricing</h1>
            {/* <p>Complete virtual training environment equipped to <br/> help you manage your workout & achieve your goals.</p> */}
          </div>
        </Fade>
        </div>
        <div className="row justify-content-center pricing-section text-white bg-secondary align-items-center">
        <Fade bottom>
          <div className="col-md-4 m-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title p-3 bg-info"
                  style={{color:'white'}}
                >Unlimited Plan - 5$/Month</h5>
                <h6 className="card-subtitle mb-2 text-muted">Details:</h6>
                <Fade top cascade delay={1000}>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">Start/Stop Any Plan Anytime</li>
                  <li className="list-group-item">Unlimited Virtual Training</li>
                  <li className="list-group-item">Cancel Anytime</li>
                  <li className="list-group-item">Excludes Downloads</li>
                </ul>
                </Fade>
              </div>
            </div>
          </div>
        </Fade>
        <Fade bottom>
          <div className="col-md-4 m-3 align-self-start">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title p-3 bg-info"
                  style={{color:'white'}}
                >Single Plan - $30</h5>
                <h6 className="card-subtitle mb-2 text-muted">Details:</h6>
                <Fade top cascade delay={1000}>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">PDF Download</li>
                  <li className="list-group-item">Virtual Training</li>
                  <li className="list-group-item">One Time Payment</li>
                </ul>
                </Fade>
              </div>
            </div>
          </div>
        </Fade>
        </div>
        <div className="row justify-content-center p-4 text-white bg-secondary align-items-start">
        <Fade bottom delay={500}>
          <div className="col">
            <button data-toggle="modal"
            className='btn btn-info'
            data-target="#signUpModal">Sign Up</button>
          </div>
        </Fade>
        </div>
        <div className="row p-3 justify-content-center align-items-top">
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
