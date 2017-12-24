import React, { Component } from 'react';
import { connect } from 'react-redux';
import pic from '../img/logo.png';
import PlanHeader from './PlanHeader';

import { fetchPlan, fetchUser } from '../actions';

class ShowPlan extends Component {
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.fetchPlan(id);
  }

  findBMR() {
    const { weight, height, age } = this.props.plan;
    const { gender } = this.props.auth;
    const inToCm = height * 2.54;
    const lbsToKg = weight / 2.2;
    if (gender === 'male') {
      const BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * (age + 5);
      return Math.round(BMR);
    } else if (gender === 'female') {
      const BMR = 9.99 * lbsToKg + 6.25 * inToCm - 4.92 * age - 161;
      return Math.round(BMR);
    }
  }

  pathSelect() {
    const { activity_mod } = this.props.plan;
    if (1.2 === activity_mod || activity_mod === 1.375) {
      return 'Fitness';
    } else if (activity_mod === 1.55) {
      return 'Life Style';
    } else if (activity_mod === 1.725 || activity_mod === 1.9) {
      return 'Athlete';
    }
  }

  calorieSelect() {
    const { planName } = this.props.plan;
    console.log(this.props.plan);
    const calories = this.findBMR() * this.props.plan.activity_mod;
    if (planName === 'Savage Strength') {
      return calories + 300;
    } else if (planName === 'Weight Loss') {
      return calories - 800;
    } else if (planName === 'Tone & Sculpt') {
      return calories - 400;
    }
  }

  render() {
    const { plan } = this.props;

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
      );
    }
    return (
      <section>
        <div className="jumbotron jumbotron-fluid bg-dark text-white" id="plan">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <img
                  src={pic}
                  className="img-fluid w-75 mx-auto d-block"
                  style={{ width: 690 }}
                  alt=" LSF"
                />
              </div>
            </div>
            <div className="row justify-content-center">
              <div className="col-md-6 text-center pb-2">
                <h3 className="display-4">{plan.planName} Program</h3>
              </div>
              <div className="col-md-6 text-center ml-2">
                <h4 className="text-center">Stats:</h4>
                <ul className="list-unstyled">
                  <li>
                    <strong>
                      <p className="lead mb-0">
                        {' '}
                        BMR: ~ {this.findBMR()} Calories
                      </p>
                    </strong>
                  </li>
                  <li>
                    <strong>
                      <p className="lead mb-0">
                        Maintenance Calories: ~{' '}
                        {Math.round(
                          this.findBMR() * this.props.plan.activity_mod
                        )}
                      </p>
                    </strong>
                  </li>
                  <li>
                    <strong>
                      <p className="lead">
                        Daily Calorie Goal: ~ {Math.round(this.calorieSelect())}
                      </p>
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
            <PlanHeader
              caloricGoal={this.calorieSelect()}
              planType={this.props.plan.planName}
            />
          </div>
        </div>
      </section>
    );
  }
}

function mapStateToProps({ plans, auth }, ownProps) {
  return { plan: plans[ownProps.match.params.id], auth: auth };
}

export default connect(mapStateToProps, { fetchPlan, fetchUser })(ShowPlan);
