import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectPlan } from '../actions/index';

class PlanList extends Component {
  renderPlans() {
    return this.props.goals.map(goal => {
      return (
        <li
          key={goal.name}
          id="planlist"
          onClick={() => this.props.selectPlan(goal)}
          className="list-group-item list-group-item-action"
        >
          {goal.name}
        </li>
      );
    });
  }
  render() {
    return (
      <div>
        <ul className="list-group">{this.renderPlans()}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    goals: state.goals
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectPlan: selectPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlanList);
