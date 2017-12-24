import React, { Component } from 'react';
import TypeList from '../containers/types.js';
import TypeDetail from '../containers/type_detail';
import PlanDetail from '../containers/plan_detail';
import PlanList from '../containers/plans.js';
import InfoBar from '../containers/user_info.js';
import ClientRoll from './Clients.js';
import ContactForm from './ContactForm.js';
import PremiumPlans from './PremiumPlans.js';
import Footer from './Footer.js';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Alert from 'react-s-alert';
import logo from '../img/logo_sm.png';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/scale.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { users: [], text: '' };
    this.sendEmail = this.sendEmail.bind(this);
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  sendEmail(name, email, text) {
    fetch('/email', {
      method: 'post',
      headers: new Headers({
        'Content-Type': 'application/json'
      }),
      body: JSON.stringify({ name: name, email: email, text: text })
    }).then(res => res.json());
  }

  render() {
    return (
      <div className="bg-secondary text-primary">
        {/* <Nav class="navbar sticky-top" /> */}
        <div
          className="jumbotron jumbotron-fluid bg-secondary mt-3"
          id="header"
        >
          <div className="container-fluid" id="home-inner">
            <div className="row align-items-middle">
              <div className="col-md-4 d-none align-middle d-md-block text-center">
                <div className="card bg-secondary text-center card-form">
                  <div className="card-body">
                    <h4>Question? Comment? Shoot Lyn an Email!</h4>
                    <ContactForm />
                  </div>
                </div>
              </div>
              <div
                id="mobile-img"
                className="col-md-4 d-block d-md-none text-center"
              >
                <img src={logo} width="70%" className="img-fluid" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="jumbotron" id="mid">
            <div className="row d-block d-sm-none">
              <div className="col d-lg-none text-center">
                <div className="card bg-secondary text-center card-form">
                  <div className="card-body">
                    <h4 className="text-white">
                      Question? Comment?<br /> Send Lyn a Message!
                    </h4>
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
            <section className="row p-4">
              <div className="col-md-4 mb-4 text-center">
                <i className="fas fa-heartbeat py-2" id="icons" />
                <h3>Training</h3>
                <p>
                  Train smarter with custom plans that factor in your body fat,
                  BMR, and activity level instantly.
                </p>
              </div>
              <div className="col-md-4 mb-4 text-center">
                <i className="fas fa-utensils py-2" id="icons" />
                <h3>Nutrition</h3>
                <p>
                  Custom nutrition plans tailored to help you reach your fitness
                  goal. Complimentary with each training program.
                </p>
              </div>
              <div className="col-md-4 mb-4 text-center">
                <i className="fas fa-mobile py-2" id="icons" />
                <h3>LifeStyle</h3>
                <p>
                  All plans are mobile ready and optimized to help you manage
                  your fitness from the palm of your hand.
                </p>
              </div>
            </section>
            <br />
            <ClientRoll />
            <br />
            <h5>
              Client transformations.<br />
              Will you be next?
            </h5>
          </div>
        </div>
        <div className="jumbotron jumbotron-fluid bg-secondary" id="training">
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <div id="head" className="pt-5">
                  <h1 id="div-title" className="display-4 text-white">
                    Free Programs<br />
                  </h1>
                  <h2>
                    <small id="div-footer" className="text-muted">
                      Beginner level workout guides for those new to fitness.
                    </small>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="jumbotron" id="mid">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <hr />

                <PlanDetail />
                <PlanList />
                <TypeDetail />
                <TypeList />
                <InfoBar sendEmail={this.sendEmail} />
                <br />
                <hr />

                <Alert stack={{ limit: 3 }} />
              </div>
            </div>
          </div>
        </div>
        <div className="jumbotron jumbotron-fluid bg-secondary" id="premo">
          <div className="container">
            <div className="row">
              <div className="col text-center">
                <div id="head" className="pt-3">
                  <h1 id="div-title" className="display-4">
                    Premium Programs<br />
                  </h1>
                  <h2>
                    <small id="div-footer" className="text-muted">
                      Designed to take you to the next level.
                    </small>
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid">
          <div className="jumbotron" id="mid">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <PremiumPlans />
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(App);
