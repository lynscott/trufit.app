import React, { Component } from 'react'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../index.css'
import App from './App'
import About from './About'
import Dashboard from '../DashBoard/Dashboard'
import OnlineTraining from './OnlineTraining'
import DashRoutes from '../DashBoard/DashRoutes'
import DashSideBar from '../DashBoard/DashSideBar'
import StartStrengthPlan from '../Strength/StartStrengthPlan'
import StartShredPlan from '../Shred/StartShredPlan'
import StartTonePlan from '../Tone/StartTonePlan'
import Nav from './Nav'
import ShowPlan from './ShowPlan'
import * as actions from '../actions'
import { Container, Row } from 'reactstrap'

class AppRoutes extends Component {
  componentDidMount() {
    this.props.fetchPlanTemps()
    if (!localStorage.getItem('token')) {
      this.props.fetchUser()
    } else {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
    }
  }

  testENV = () => {
    if (process.env.NODE_ENV === 'development') {
      return this.renderOverview()
    } else {
      return (
        <div className="jumbotron" style={{ marginTop: '90px' }}>
          <h1> New Dashboard Coming Soon!</h1>
        </div>
      )
    }
  }

  renderDash = matchProps => {
    if (
      window.localStorage.getItem('token') !== null ||
      this.props.currentUser !== null
    ) {
      return this.testENV()
    }

    return <Redirect to="/" />
  }

  renderNutrition = () => {
    return (
      <Row>
        <DashSideBar user={this.props.currentUser} />
        <div style={{ backgroundColor: 'white' }}> placeholder nutrition </div>
      </Row>
    )
  }

  renderPlans = () => {
    return (
      // <DeviceOverview/>

      <Row>
        <DashSideBar user={this.props.currentUser} />
        <div style={{ backgroundColor: 'white' }}> placeholder plans </div>
      </Row>
    )
  }

  renderAccountSettings = () => {
    return (
      <Row>
        <DashSideBar user={this.props.currentUser} />
        <div style={{ backgroundColor: 'white' }}> placeholder account </div>
      </Row>
    )
  }

  renderOverview = () => {
    return (
      <Row>
        <DashSideBar user={this.props.currentUser} />
        <Dashboard />
      </Row>
    )
  }

  render() {
    return (
      <Container fluid>
        <Nav className="navbar" />
        <Switch>
          <Route exact path="/about" component={About} />
          {/* <Route exact path="/dashboard" render={this.renderDash} /> */}
          {/* <Route path="/training" component={OnlineTraining} /> */}
          <Route
            exact
            path="/dashboard/:userid/plan/:id"
            component={ShowPlan}
          />

          <Route exact path="/dashboard/overview" render={this.renderDash} />
          {/* <Route exact path='/n/admin/dashboard' render={this.renderDashboard} /> */}
          <Route exact path="/dashboard/plans" render={this.renderPlans} />

          <Route
            exact
            path="/dashboard/nutrition"
            render={this.renderNutrition}
          />

          <Route
            exact
            path="/dashboard/account-settings"
            render={this.renderAccountSettings}
          />
          {/* <Route
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
                /> */}
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
    actions
  )(AppRoutes)
)
