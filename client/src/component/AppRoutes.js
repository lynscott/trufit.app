import React, { Component, Suspense, lazy } from 'react'
import { Route, withRouter, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../index.css' //TODO: Clean this old css file and make .scss
// import App from './App'
// import About from './About'
// import Dashboard from '../DashBoard/Dashboard'
// import DashRoutes from '../DashBoard/DashRoutes'
// import DashSideBar from '../DashBoard/DashSideBar'
// import NutritionDash from '../DashBoard/NutritionDash'
// import TrainingDash from '../DashBoard/TrainingDash'
// import CreatePlanForm from './CreatePlanForm'
// import CreateWorkoutForm from './CreateWorkoutForm'
// import AdminPage from './Admin'

import Nav from './Nav'
import keys from '../config/keys'
import ShowPlan from './ShowPlan'
import * as actions from '../actions'
import { Fade, Spinner } from 'reactstrap'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {isMobileSafari, isSafari, osName, isIOS} from 'react-device-detect'
import Loadable from 'react-loadable'
import {COLLAPSE_TRIGGER_WIDTH} from '../constants/Layout'
import windowSize from 'react-window-size'


//TODO: Clean up file

const loaderCircle = (props) => {
  if (props.error) {
      console.log(props)
      return <div>Error! <button onClick={props.retry}>Retry</button></div>
  } else {
      return <Spinner color="primary" />
  }
}

const loadFromPath = (loaderCallBack) => Loadable({
  loader: loaderCallBack,
  loading: loaderCircle,
  timeout: 5000
})


const Home = loadFromPath(() => import('./App'))
const About = lazy(() => import('./About'))
const DashSideBar = loadFromPath(() => import('../DashBoard/DashSideBar'))
const Dash = loadFromPath(() => import('../DashBoard/Dashboard'))
const NutritionDash = loadFromPath(() => import('../DashBoard/NutritionDash'))
const Admin = loadFromPath(() => import('./Admin'))
const TrainingDash = loadFromPath(() => import('../DashBoard/TrainingDash'))
const ReactAdminDash = loadFromPath(() => import('./Admin/ReactAdmin')) 
const NutritionDashV2 = loadFromPath(() => import('../DashBoard/Nutrition/NutritionDashV2'))






class AppRoutes extends Component {
  constructor(props) {
    super(props)

    this.state = {
      scroll: window.pageYOffset,
      sidebarWidth: 0
    }

   
  }
  componentDidMount() {
    // console.log(isMobileSafari, isSafari, isIOS)

    // This also performs authentication!!!!
    this.props.fetchUser()

    let bar = document.getElementById('dash-sidebar') 
    if (bar)
      this.setState({sidebarWidth:document.getElementById('dash-sidebar').offsetWidth})
    
    window.addEventListener('scroll', this.handleScroll)

  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.currentUser !== null &&
        prevProps.currentUser !== this.props.currentUser) {
          this.props.fetchPlanTemps()
          this.props.fetchProfile()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (event) => {

    this.setState({
      scroll: window.pageYOffset
    })
  }

  //DEPRECATED:
  // testENV = () => {
  //   if (process.env.NODE_ENV === 'development' || keys.preAccessList.includes(this.props.currentUser.email)) {
  //     //this.props.currentUser ? console.log(keys.preAccessList.includes(this.props.currentUser.email)) : 'null'
  //     return this.renderOverview()
  //   } else {
  //     return (
  //       <div className="jumbotron" style={{ marginTop: '90px' }}>
  //         <h1> New Dashboard Coming Soon!</h1>
  //       </div>
  //     )
  //   }
  // }

  /**
   * Check to see whether or not the user is authenticated. If so render the component appropriately.
   * Perform all authentication checks here.
   * Otherwises redirect to root.
   * Must return a function as this is expected from routes.
   */
  authCheckOrRedirect = componentRendererFunc => {
    // Required for asynchronous authentication.
    // You must handle the authentication race condition on direct routes.
    
    if(this.props.isAuthenticating){
      return () => <Spinner  color='dark' />
    }

    if(this.props.currentUser && !this.props.isAuthenticating) {
      return () => componentRendererFunc()
    }

    return () => <Redirect to="/" />
  }

  renderDash = matchProps => {
    return this.renderOverview()
  }

  renderNutrition = () => {
        return <NutritionDashV2/>
  }

  renderPlans = () => {
    return <TrainingDash/> 
  }

  renderAccountSettings = () => {
    return (
        <Redirect to="/" /> //TODO: Complete settings dash
        // <div className='col-md-10 ' style={{ backgroundColor: 'white' }}>
        //   <h3 className='my-5'>This area is under construction, come back soon!</h3>
        //   <FontAwesomeIcon className='mb-4' icon={'tools'} size={'6x'} />
        // </div>
    )
  }

  renderOverview = () => {
    return  <Dash />
 
  }


  renderReactAdmin = () => {
    return  <ReactAdminDash />
 
  }

  renderAdmin = () => {
    if ( this.props.userProfile.isAdmin) {
      return <Admin />
    }
    else return (
          <div className='col-md-10 ' style={{ backgroundColor: 'white' }}>
            <h3 className='my-5'>Forbidden Area. Back Away Slowly.</h3>
            <FontAwesomeIcon className='mb-4' icon={'tools'} size={'6x'} />
          </div>
        )
  }

  /**
   * Anything related to sidebar logic.
   */
  renderSidebar = () => {
    return <DashSideBar profile={this.props.userProfile} user={this.props.currentUser} />
  }

  /**
   * Anything related to home navigation logic.
   */
  renderHomeNavigation = () => {
    return <Fade in={this.state.scroll >= 0} > 
          <Nav className="navbar" />
        </Fade>
  }


  returnRoute = () => {
    if (this.props.userProfile.isAdmin)
      return(
            <Route
              exact
              path="/dashboard/admin"
              render={this.renderAdmin}
            />
        )
    else return null
  }

  render() {
    return (
      <Container style={{padding:0, backgroundColor:'white'}} maxWidth={'xl'} >
        <Route exact path="/" render={this.renderHomeNavigation} />
        <Route exact path="/dashboard" render={() => <Redirect to="/dashboard/overview"/> }/>

        <Grid container >
          <Route path="/dashboard" render={this.renderSidebar} />
          <Switch>
            {/* DEPRECATED: */}
            {/* <Route
              exact
              path="/dashboard/:userid/plan/:id"
              component={ShowPlan}
            /> */}

            <Route exact path="/dashboard/overview" render={this.authCheckOrRedirect(this.renderDash)} />

            <Route exact path="/dashboard/plans" render={this.authCheckOrRedirect(this.renderPlans)} />

            <Route
              exact
              path="/dashboard/nutrition"
              render={this.authCheckOrRedirect(this.renderNutrition)}
            />

            <Route
              exact
              path="/dashboard/admin"
              render={this.authCheckOrRedirect(this.renderReactAdmin)}
            />

            <Route
              exact
              path="/dashboard/settings"
              render={this.authCheckOrRedirect(this.renderAccountSettings)}
            />

            {this.props.userProfile ?
            this.returnRoute()
            : null}

            <Route exact path="/" component={Home} />
          </Switch>
        </Grid>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.auth.user,
    isAuthenticating: state.auth.isAuthenticating,
    userProfile: state.auth.userProfile
  }
}

export default withRouter(
  connect(
    mapStateToProps,
    actions
  )(AppRoutes)
)
