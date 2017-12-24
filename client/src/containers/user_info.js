import React, { Component } from 'react';
import {connect} from 'react-redux';
import Alert from 'react-s-alert';


class InfoBar extends Component {
  constructor(props) {
    super(props);

    this.state = {name: '', email: '', weight: ''};
    this.onInputChange = this.onInputChange.bind(this);
    this.onInfoSubmit = this.onInfoSubmit.bind(this);
  }


  onInputChange(event) {
    if (event.target.name ==="name") {
      this.setState({name: event.target.value});
    }
    if (event.target.name ==="email") {
      this.setState({email: event.target.value});
    }
    if (event.target.name ==="weight") {
      this.setState({weight: event.target.value});
    }
  }

  onInfoSubmit(event) {
    event.preventDefault();
    if (!this.props.type.type || !this.props.plan.name) {
      return Alert.error("Please select a plan and body type", {
        position: 'bottom',
        effect: 'scale',
      });
    }
    this.props.sendEmail(event.target.name.value,
                         event.target.email.value,
                         this.props.plan.name)
                         return Alert.success(<h3>Plan sent!</h3>, {
                           position: 'bottom',
                           effect: 'scale',
                         })
  }

  render() {
    return (
      <form onSubmit={this.onInfoSubmit}>
        <div className="form-row">
          <div className="col-md-3">
            <input type="text" className="form-control" onChange={this.onInputChange} name="name" value={this.state.name} placeholder="Full Name"/>
          </div>
          <div className="col-md-3">
          <input type="email" className="form-control" name="email" onChange={this.onInputChange} value={this.state.email} placeholder="Email"/>
          </div>
          <div className="col-md-3">
            <input type="integer" className="form-control" name="weight" onChange={this.onInputChange} value={this.state.weight} placeholder= "Wieght (lbs)"/>
          </div>
          <div className="col-md-3">
            <button className="btn btn-primary" type="submit">Get My Plan!</button>
          </div>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state) {
  return {
    type: state.activeType,
    plan: state.activePlan
  };
}

export default connect(mapStateToProps)(InfoBar);
