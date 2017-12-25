import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Field, reset, reduxForm } from 'redux-form';
import * as actions from '../actions';
import Alert from 'react-s-alert';

const afterSubmit = (result, dispatch) => dispatch(reset('FreePlanForm'));


class FreePlanForm extends Component {
  renderField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col-md-4">
        <input
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          {...field.input}
        />
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

    async onSubmit(values) {
      const { type, plan } = this.props;
      console.log(this.props.plan);
      await this.props.freePlanForm(values, plan , type);
      Alert.success(<h3>Plan sent!</h3>, {
        position: 'bottom',
        effect: 'scale'
      });
    }

  render() {
    const { handleSubmit } = this.props;
    console.log(this.props);
    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        {console.log(this.props.plan)}
        <div className="form-row justify-content-center">
        <Field
          placeholder="Name"
          name="person"
          type="text"
          component={this.renderField}
        />

        <Field
          placeholder="Email"
          name="email"
          type="email"
          component={this.renderField}
        />

        <button
          type="submit"
          className="btn btn-outline-primary my-0"
        >
          Get Free Plan!
        </button>
      </div>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};
  if (!values.person) {
    errors.person = <strong>Oops! Forgot your Name.</strong>;
  }
  if (!values.email) {
    errors.email = 'Oops! Forgot your Email.';
  }

  return errors;
}

function mapStateToProps(state) {
  return {
    type: state.activeType,
    plan: state.activePlan
  };
}

export default reduxForm({
  validate,
  form: 'FreePlanForm',
  onSubmitSuccess: afterSubmit
})(connect(mapStateToProps, actions)(FreePlanForm));
