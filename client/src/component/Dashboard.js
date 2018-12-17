import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../actions';
import PlanList from './PlanList';
import SideBar from './SideBar'

class Dashboard extends Component {
  renderContent() {
    switch (this.props.auth.user) {
      case null:
        return '';
      case false:
        return this.props.history.push('/');
      default:

        return (
          <div className="media">
            {/* <img className="mr-3" src={this.props.auth.user.img} alt="placeholder" /> */}
            <div className="media-body">
              <h3 className="display-5">{this.props.auth.user.name}</h3>
            </div>
          </div>
        );
    }
  }

  componentDidMount() {
    if (!localStorage.getItem('token')) {
      this.props.fetchUser();
    } else {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
    }
  }

  render() {
    return (
      <div style={{marginTop:'90px'}}>
        <div className="container">
          
          <div className="jumbotron justify-content-center" id="dash">
            <i className="fa fa-chart-bar" /> Dashboard
            {this.renderContent()}
            {/* <div className="row justify-content-center">
              <div className="col-md-3 py-3">
                <a href="" className="btn btn-primary btn-block">
                  <i className="fa-fa-plus" /> Add Plan
                </a>
              </div>
              <div className="col-md-3 py-3">
                <a href="" className="btn btn-secondary btn-block">
                  <i className="fa-fa-plus" /> Check Stats
                </a>
              </div>
              <div className="col-md-3 py-3">
                <a href="" className="btn btn-primary btn-block">
                  <i className="fa-fa-plus" /> Upload Progress Pics
                </a>
              </div>
            </div> */}
            <br />
            <PlanList />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(Dashboard));
