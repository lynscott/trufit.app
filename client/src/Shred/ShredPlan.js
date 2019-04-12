import React, { Component } from 'react';
// import pic from '../img/fat_loss.jpg';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { withRouter } from 'react-router-dom';

const title = 'Shred Plan';

class ShredPlan extends Component {
  renderLogin() {
    const { history, auth } = this.props;
    if (!this.props.auth) {
      return (
        <button
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#exampleModal"
        >
          Sign-in To Purchase
        </button>
      );
    } else {
      return (
        <StripeCheckout
          name={title}
          description="A Weight Reduction Program."
          amount={3900}
          token={token => this.props.handleShredToken(token, history, auth._id)}
          stripeKey="pk_live_2nhU1EGud3cMUuL7bMoZ3c19"
          // image={pic}
          zipCode={true}
          bitcoin={true}
        >
          <button disabled={!auth.authenticated} className="btn btn-success">
            Buy Premium Plan $39
          </button>
        </StripeCheckout>
      );
    }
  }

  render() {
    const { history, auth } = this.props;
    return (
      <div className="col-md-4 py-4">
        <figure className="figure">
          {/* <img
            src={pic}
            className="figure-img w-50  d-inline-block d-md-none img-fluid rounded"
            alt=" Plan A"
          />
          <img
            src={pic}
            className="figure-img d-none d-md-block img-fluid rounded"
            alt=" Plan A"
          /> */}
          <figcaption className="figure-caption">
            Includes:
            <ul className="list-unstyled">
              <li>12 Week Personalized Weight Loss Program</li>
              <li>Nutrition Guide</li>
              <li>Supplement Guide</li>
            </ul>
          </figcaption>
        </figure>

        {this.renderLogin()}
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps, actions)(withRouter(ShredPlan));
