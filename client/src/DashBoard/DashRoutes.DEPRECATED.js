import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Switch, Route, withRouter} from 'react-router-dom'
// import {loadUserActionCreator} from 'LoginActions/LoginAction'
import Dashboard from './Dashboard'
import DashSideBar from './DashSideBar'
import {Row, Col} from 'reactstrap'

class DashRoutes extends React.Component {
    constructor(props){
        super(props)
    }

    // componentDidMount(){
    //     this.props.loadUserActionCreator()
    //     if (this.props.userCourses === null) {
    //         this.props.loadUserDataActionCreator()
    //     }

    // }

    // renderDashOverview = () => {
    //     return ( <Dashboard/> )
    // }

    renderNutrition = () => {
        return(
            <div className='col-md-10'> placeholder nutrition </div>
        )
    }

    renderPlans = () => {
        return(
            // <DeviceOverview/>
            <div className='col-md-10'> placeholder plans </div>
        )
    }

    // TEMP DISABLED.
    // renderDashboard = () => {
    //     return( <CourseOverview/>)
    // }

    renderOverview = () => {
        return( <Dashboard/>)
    }

    // renderAdminCourseList = () => {
    //     return (<AdminCourseList/>)
    // }

    render(){
        return(
            <Row className='userinterface'>
                <DashSideBar/>
                <Switch>
                    <Route exact path='/dashboard/overview' render={this.renderOverview} />
                    {/* <Route exact path='/n/admin/dashboard' render={this.renderDashboard} /> */}
                    <Route exact path='/dash/plans' render={this.renderPlans} />
                    <Route exact path='/dash/nutrition' render={this.renderNutrition} />
                    {/* <Route exact path='/admin/communications' render={this.renderCommunications} />
                    <Route exact path='/admin/manage-access' render={this.renderManageAccess} /> */}
                </Switch>
            </Row>
        )
    }
}

const mapStateToProps = (state)=> {

    return {
        user: state.auth.user
    }
}

export default withRouter(connect(mapStateToProps, null)(DashRoutes))