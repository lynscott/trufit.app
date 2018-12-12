import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../img/logo.png';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Login from './Login';
import LoadingBar from './LoadingBar';

class Nav extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return <LoadingBar />;
      case false || null:
        return (
          <a
            className="nav-item nav-link px-2"
            data-toggle="modal"
            data-target="#exampleModal"
          >
            Sign-in
          </a>
        )
      default:
        return [
          <Link
            key="1"
            className="nav-item nav-link active px-2"
            to={`/dashboard/${this.props.auth._id}`}
          >
            Dashboard
          </Link>,
          <a
            href="/api/logout"
            key="2"
            id="title"
            className="nav-item nav-link px-2"
          >
            Logout
          </a>
        ];
    }
  }

  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    console.log(this.props)
    return (
      <div>
        <nav className="navbar fixed-top navbar-expand-sm navbar-dark bg-dark">
          <Link
            className="navbar-brand mx-auto d-block"
            style={{ width: 150 }}
            id="title"
            to="/"
          >
            <img
              src={logo}
              className="d-inline-block align-top"
              width="200"
              height="60"
              alt="logo"
            />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <div className="navbar-nav ml-auto">
              <Link className="nav-item nav-link px-2 " id="title" to="/about">
                About
              </Link>
              <Link
                className="nav-item nav-link px-2"
                id="title"
                to="/training"
              >
                Online Training
              </Link>
              {this.renderContent()}
            </div>
          </div>
        </nav>
        <Login />
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(Nav);
