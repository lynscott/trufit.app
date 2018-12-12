import React, { Component } from 'react';
import { Field, reset, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { contactForm } from '../actions';
import Alert from 'react-s-alert';

const afterSubmit = (result, dispatch) => dispatch(reset('LoginForm'));

class LoginForm extends Component {
  renderField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col">
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

  renderSelectField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col">
        <select
          width="100%"
          value="none"
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          {...field.input}
        >
          <option value="none">Male</option>
          <option value="Fat Loss">Female</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }


  async onSubmit(values) {
    await this.props.signInUser(values);
    Alert.success(<h3>Success!</h3>, {
      position: 'bottom',
      effect: 'scale'
    });
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>

        <Field
          placeholder="Email"
          name="email"
          type="email"
          component={this.renderField}
        />

        <Field
          placeholder="Password"
          name="password"
          type="password"
          component={this.renderField}
        />

        <button
          type="submit"
          className="btn btn-outline-primary"
        >
          Submit
        </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.email) {
    errors.email = 'Required.';
  }
  if (!values.password) {
    errors.password = 'Required.';
  }


  return errors;
}

export default reduxForm({
  validate,
  form: 'LoginForm',
  onSubmitSuccess: afterSubmit
})(connect(null, { contactForm })(LoginForm));
