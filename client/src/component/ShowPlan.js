import React, { Component } from 'react'
import { connect } from 'react-redux'
// import pic from '../img/logo.png'
import PlanHeader from './PlanHeader'
import { findDOMNode } from 'react-dom'
// import $ from 'jquery';

import { fetchPlan, fetchUser } from '../actions'

class ShowPlan extends Component {
  componentDidMount() {
    const { id } = this.props.match.params
    this.props.fetchPlan(id)
  }

  findBMR() {
    const { weight, height, age } = this.props.plan
    const { gender } = this.props.auth
    const inToCm = height * 2.54
    const lbsToKg = weight / 2.2
    if (gender === 'male') {
      const BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * (age + 5)
      return Math.round(BMR)
    } else if (gender === 'female') {
      const BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * age - 161
      return Math.round(BMR)
    }
  }

  pathSelect() {
    const { activity_mod } = this.props.plan
    if (1.2 === activity_mod || activity_mod === 1.375) {
      return 'Fitness'
    } else if (activity_mod === 1.55) {
      return 'Life Style'
    } else if (activity_mod === 1.725 || activity_mod === 1.9) {
      return 'Athlete'
    }
  }

  calorieSelect() {
    const { planName } = this.props.plan
    const calories = this.findBMR() * this.props.plan.activity_mod
    if (planName === 'Savage Strength') {
      return calories + 300
    } else if (planName === 'Weight Loss') {
      return calories - 800
    } else if (planName === 'Tone & Sculpt') {
      return calories - 400
    }
  }

  planPDF = () => {
    const el = findDOMNode(this.refs.user_plan)
    // const userPlan = $(el);
    // console.log(userPlan);
  };

  render() {
    const { plan } = this.props

    if (!plan) {
      return (
        <div className="progress progress-bar-animated">
          <div
            className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="75"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: 75 }}
          />
        </div>
      )
    }
    return (
      <section ref="user_plan">
        <div className="jumbotron jumbotron-fluid bg-dark text-white" id="plan">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12">
                {/* <img
                  src={pic}
                  className="img-fluid w-75 mx-auto d-block"
                  style={{ width: 690 }}
                  alt=" LSF"
                /> */}
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6 text-center pb-2">
                <h4 className="display-4">{plan.planName} Program</h4>
              </div>
              <div className="col-md-6 text-center ml-2">
                <h1 className="text-center">Stats:</h1>

                {/* <button className="btn btn-light" onClick={this.planPDF}> Get PDF </button> */}
              </div>
            </div>
            <div className="row py-3 justify-content-center">
              <div className="col-md-4 bg-dark">
                <div
                  className="list-group bg-dark text-white"
                  id="list-tab"
                  role="tablist"
                >
                  <a
                    className="list-group-item list-group-item-action active list-group-item-dark"
                    id="list-home-list"
                    data-toggle="list"
                    href="#list-home"
                    role="tab"
                    aria-controls="home"
                  >
                    BMR: ~ {this.findBMR()} Calories
                  </a>
                  <a
                    className="list-group-item list-group-item-action list-group-item-dark"
                    id="list-profile-list"
                    data-toggle="list"
                    href="#list-profile"
                    role="tab"
                    aria-controls="profile"
                  >
                    Maintenance Calories: ~{' '}
                    {Math.round(this.findBMR() * this.props.plan.activity_mod)}
                  </a>
                  <a
                    className="list-group-item list-group-item-action list-group-item-dark"
                    id="list-messages-list"
                    data-toggle="list"
                    href="#list-messages"
                    role="tab"
                    aria-controls="messages"
                  >
                    Daily Calorie Goal: ~ {Math.round(this.calorieSelect())}
                  </a>
                </div>
              </div>
              <div className="col-md-6">
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="list-home"
                    role="tabpanel"
                    aria-labelledby="list-home-list"
                  >
                    Your BMR (Basal Metabolic Rate) is an estimate of the bare
                    minimum amount of energy needed to keep your body
                    functioning, including breathing and keeping your heart
                    beating.
                  </div>
                  <div
                    className="tab-pane fade"
                    id="list-profile"
                    role="tabpanel"
                    aria-labelledby="list-profile-list"
                  >
                    Calories needed to maintain your current weight.
                  </div>
                  <div
                    className="tab-pane fade"
                    id="list-messages"
                    role="tabpanel"
                    aria-labelledby="list-messages-list"
                  >
                    Your daily calorie goal based on your plan and intake
                    information. Fine tune this accordingly with your results as
                    you may need less/more calories to acheive your optimal rate
                    of weight loss or weight gain.
                  </div>
                </div>
              </div>
            </div>
            <PlanHeader
              caloricGoal={this.calorieSelect()}
              planType={this.props.plan.planName}
            />
          </div>
        </div>
      </section>
    )
  }
}

function mapStateToProps({ plans, auth }, ownProps) {
  return { plan: plans[ownProps.match.params.id], auth: auth }
}

export default connect(mapStateToProps, { fetchPlan, fetchUser })(ShowPlan)
