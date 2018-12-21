import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import PlanList from './PlanList'

import DashCalendar from './DashCalendar'
import NutritionTable from './NutritionTable'
import { scaleRotate as Menu } from 'react-burger-menu'
import './Sidebar.scss'
import './DashBoard.scss'

const Block = ({content, colSize, content2=null ,configs=null}) => {

  return (
    <div className='row p-3 justify-content-around'>
      <div className={`col-md-${colSize} ${configs}`}>
        {content}
      </div>
      <div className={`col-md-4`}>
        {/* <div>
          Preview of your current scheduled workout or
          no workouts? Set up a plan.
        </div> */}
        {content2}
      </div>
    </div>
  )
}


const JumboBlock = ({message}) => {

  let date = new Date()

  return (
    <div className="jumbotron">
      <h1 className="display-4">Affirmation</h1>
      {date.toLocaleDateString()}
      <p className="lead">Enter some text as a reminder why you won't quit!</p>
      <hr className="my-4"/>
      <p>{message}</p>
    </div>
  )
}

class Dashboard extends Component {

  sideContent = () => {
    return (
      <div className="card">
        {/* <img className="card-img-top" src=".../100px180/?text=Image cap" alt="Card image cap"/> */}
        <div className="card-body">
          <h5 className="card-title">Next Workout: Legs Week 2</h5>
          {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Start</li>
          <li className="list-group-item">End</li>
          <li className="list-group-item">Skip</li>
        </ul>
        <div className="card-body">
          <a href="#" className="card-link">Edit Workout</a>
          <a href="#" className="card-link">Another link</a>
        </div>
      </div>
    )
  }

  renderContent() {
    switch (this.props.auth.user) {
      case null:
        return ''
      case false:
        return this.props.history.push('/')
      default:
        return (
          <React.Fragment>
            <JumboBlock
              message={'Hello World 2'}
            />
            {/* <h4>Overview</h4> */}
            <Block
              content={<DashCalendar/>}
              colSize={6}
              content2={this.sideContent()}
              configs= 'calendar-container'
            />
            <hr/>
            <Block
              content={<NutritionTable/>}
              colSize={6}
            />
            <hr/>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <PlanList />
              </div>
            </div>
          </React.Fragment>
        )
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.fetchUser()
    } else {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
    }
  }

  render() {
    return (
      <div style={{ marginTop: '90px' }} id="outer-container">
        <Menu pageWrapId={'page-wrap'} outerContainerId={'outer-container'}>
          <a id="home" className="menu-item" href="/">
            Overview
          </a>
          <a id="about" className="menu-item" href="/about">
            Plans
          </a>
          <a id="contact" className="menu-item" href="/contact">
            Nutrition
          </a>
          <a onClick={this.showSettings} className="menu-item--small" href="">
            Settings
          </a>
        </Menu>
        <main className="bg-light justify-content-center" style={{paddingTop:'50px'}} id="page-wrap">
          {/* <div className=' bg-light'> */}

          {this.renderContent()}
          {/* </div> */}
        </main>
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
  return { auth }
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(Dashboard))
