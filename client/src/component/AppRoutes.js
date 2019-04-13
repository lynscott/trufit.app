import React, { Component } from 'react'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../index.css'
import App from './App'
import About from './About'
import Dashboard from '../DashBoard/Dashboard'
import DashRoutes from '../DashBoard/DashRoutes'
import DashSideBar from '../DashBoard/DashSideBar'
import NutritionDash from '../DashBoard/NutritionDash'

import Nav from './Nav'
import keys from '../config/keys'
import ShowPlan from './ShowPlan'
import * as actions from '../actions'
import { Container, Row, Fade } from 'reactstrap'

class AppRoutes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scroll: window.pageYOffset,
    }

   
  }
  componentDidMount() {
    this.props.fetchPlanTemps()
    this.props.fetchUser()
    this.props.fetchProfile()
    window.addEventListener('scroll', this.handleScroll)

  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (event) => {
    // let scrollTop = event.srcElement.body.scrollTop,
    //     itemTranslate = Math.min(0, scrollTop/3 - 60)

    this.setState({
      scroll: window.pageYOffset
    })
}

  testENV = () => {
    if (process.env.NODE_ENV === 'development' || keys.preAccessList.includes(this.props.currentUser.email)) {
      //this.props.currentUser ? console.log(keys.preAccessList.includes(this.props.currentUser.email)) : 'null'
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
      return this.renderOverview()
    }

    return <Redirect to="/" />
  }

  renderNutrition = () => {
    return (
      <Row>
        <DashSideBar profile={this.props.userProfile} user={this.props.currentUser} />
        <NutritionDash/>
        {/* <div style={{ backgroundColor: 'white' }}> placeholder nutrition </div> */}
      </Row>
    )
  }

  renderPlans = () => {
    return (
      // <DeviceOverview/>

      <Row>
        <DashSideBar profile={this.props.userProfile} user={this.props.currentUser} />
        <div style={{ backgroundColor: 'white' }}> placeholder plans </div>
      </Row>
    )
  }

  renderAccountSettings = () => {
    return (
      <Row>
        <DashSideBar profile={this.props.userProfile} user={this.props.currentUser} />
        <div style={{ backgroundColor: 'white' }}> placeholder account </div>
      </Row>
    )
  }

  renderOverview = () => {
    return (
      <Row>
        <DashSideBar profile={this.props.userProfile} user={this.props.currentUser} />
        <Dashboard />
      </Row>
    )
  }

  render() {
    // console.log(this.state)
    return (
      <Container fluid>
        { window.location.pathname.includes('dashboard') === false?
        <Fade in={this.state.scroll > 50 ? true: false} > 
          <Nav className="navbar" />
        </Fade>
        : null}
        {/* <Nav className="navbar d-none d-sm-block d-md-none " /> */}
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
    currentUser: state.auth.user,
    userProfile: state.auth.userProfile
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(AppRoutes)
)
