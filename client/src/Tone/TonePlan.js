import React, { Component } from 'react';
import pic from '../img/tone_plan.jpg';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';

const title = 'Tone Plan';

class TonePlan extends Component {
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
            className="figure-img d-none d-md-block img-fluid rounded"
            alt=" Plan A"
          />
          <figcaption className="figure-caption">
            Includes:
            <ul className="list-unstyled">
              <li>12 Week Personalized Tone & Sculpt Program</li>
              <li>Nutrition Guide</li>
              <li>Supplement Guide</li>
            </ul>
          </figcaption>
        </figure>
        <StripeCheckout
          name={title}
          description="Tone & Sculpt Program."
          amount={2730}
          token={token => this.props.handleToneToken(token, history, auth._id)}
          stripeKey="pk_live_2nhU1EGud3cMUuL7bMoZ3c19"
          image={pic}
          zipCode={true}
          bitcoin={true}
        >
          <button disabled={!auth} className="btn btn-success">
            Buy Premium Plan <s>$39</s> $27.30
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

export default connect(mapStateToProps, actions)(withRouter(TonePlan));
