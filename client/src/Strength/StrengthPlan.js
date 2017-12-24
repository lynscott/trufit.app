import React, { Component } from 'react';
import pic from '../img/sav.jpg';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';

const title = 'Strength Plan';

class StrengthPlan extends Component {
  renderCaption() {
    if (!this.props.auth) {
      return <p>* Login to purchase plans</p>;
    }
  }

  render() {
    const { history, auth } = this.props;
    return (
      <div className="col-md-4 py-4">
        <figure className="figure">
          <img
            src={pic}
            className="figure-img w-50 align-center d-inline-block d-md-none img-fluid rounded"
            alt=" Plan A"
          />
          <img
            src={pic}
            className=" figure-img d-none d-md-block img-fluid rounded"
            alt=" Plan A"
          />
          <figcaption className="figure-caption">
            12 Week Strength and Mass Program.
          </figcaption>
        </figure>
        <StripeCheckout
          name={title}
          description="Strength and Mass Program."
          amount={3900}
          token={token =>
            this.props.handleStrengthToken(token, history, auth._id)
          }
          stripeKey="pk_test_0MmGCS4ik8k7bj9vK53ziyj9"
          image={pic}
          zipCode={true}
          bitcoin={true}
        >
          <button disabled={!auth} className="btn btn-success">
            Buy Premium Plan $39
          </button>
        </StripeCheckout>
        {this.renderCaption()}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(StrengthPlan));
