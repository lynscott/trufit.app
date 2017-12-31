import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchPlans } from '../actions/';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import Moment from 'react-moment';

class PlanList extends Component {
  componentDidMount() {
    this.props.fetchPlans();
  }

  renderList() {
    return _.map(this.props.plans, plan => {
      return (
        <Link
          className="list-group-item list-group-item-action text-center bg-light"
          to={`/dashboard/${this.props.auth._id}/plan/${plan._id}`}
          key={plan._id}
          id="plan-list"
        >
          <h4 className="display-5">{plan.planName}</h4>

          <p className="lead">
            Date Started:{' '}
            <Moment format="MM/DD/YYYY h:mma">{plan.datePurchased}</Moment>
          </p>
        </Link>
      );
    });
  }

  render() {
    return <div>{this.renderList()}</div>;
  }
}

function mapStateToProps({ plans, auth }) {
  return { plans, auth };
}

export default connect(mapStateToProps, { fetchPlans })(PlanList);
