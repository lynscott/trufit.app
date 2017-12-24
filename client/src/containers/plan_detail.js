import React, { Component } from 'react';
import { connect } from 'react-redux';

class PlanDetail extends Component {
  renderGoal() {
    return (
      <div id="planlist">
        <div className="card">
          {/* <img className="card-img-top" src={this.props.plan.img} alt="bench" /> */}
          <div className="card-body">
            <h4 className="card-title">{this.props.plan.name}</h4>
            <p className="card-text">{this.props.plan.info}</p>
          </div>
        </div>
        <div>{this.props.plan.plan}</div>
      </div>
    );
  }

  render() {
    if (!this.props.plan) {
      return (
        <div>
          <h2>
            <span className="badge badge-secondary">Select a plan!</span>
          </h2>
        </div>
      );
    }

    return <div>{this.renderGoal()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    plan: state.activePlan
  };
}

export default connect(mapStateToProps)(PlanDetail);
