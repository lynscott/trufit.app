import React, { Component } from 'react'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../index.css'
import App from './App'
import About from './About'
import Dashboard from './Dashboard'
import OnlineTraining from './OnlineTraining'

import StartStrengthPlan from '../Strength/StartStrengthPlan'
import StartShredPlan from '../Shred/StartShredPlan'
import StartTonePlan from '../Tone/StartTonePlan'
import Nav from './Nav'
import ShowPlan from './ShowPlan'
import {Container} from 'reactstrap'

let testENV = () => {
    if (process.env.NODE_ENV === 'development') {
      return <Dashboard/>
    } else {
      return (
        <div className='jumbotron' style={{marginTop:'90px'}}>
            <h1> New Dashboard Coming Soon!</h1>
        </div>
      )
    }
  }

class AppRoutes extends Component {

    renderDash = (matchProps) => {
        if (window.localStorage.getItem('token') !== null || this.props.currentUser !== null) {
            return testENV()
        }

        return <Redirect to='/'/>
    }

    render() {
        return (
        <Container fluid>
            <Nav className="navbar" />
            <Switch>
                <Route exact path="/about" component={About} />
                <Route exact path="/dashboard" component={this.renderDash} />
                {/* <Route path="/training" component={OnlineTraining} /> */}
                <Route
                    exact
                    path="/dashboard/:userid/plan/:id"
                    component={ShowPlan}
                />
                <Route
                    exact
                    path="/startplan/strength/:userid"
                    component={StartStrengthPlan}
                />
                <Route
                    exact
                    path="/startplan/shred/:userid"
                    component={StartShredPlan}
                />
                <Route
                    exact
                    path="/startplan/tone/:userid"
                    component={StartTonePlan}
                />
                <Route exact path="/" component={App} />
            </Switch>
        </Container>
        )
    }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.user
    // token: state.user.userToken,
    // userGroup: state.user.userGroup
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(AppRoutes)
)
