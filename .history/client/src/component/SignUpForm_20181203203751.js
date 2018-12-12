import React, { Component } from 'react';
import { Field, reset, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { contactForm } from '../actions';
import Alert from 'react-s-alert';

const afterSubmit = (result, dispatch) => dispatch(reset('SignUpForm'));

class SignUpForm extends Component {
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
    console.log(values)
    try {
      await this.props.signUpUser(values);
      Alert.success(<h3>Success!</h3>, {
        position: 'bottom',
        effect: 'scale'
      });
    } catch (error) {
      Alert.error(<h3>Serror</h3>, {
        position: 'bottom',
        effect: 'scale'
      });
    }
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <Field
          placeholder="Name"
          name="name"
          type="text"
          component={this.renderField}
        />

        <Field
          placeholder="Email"
          name="email"
          type="email"
          component={this.renderField}
        />

        <Field
          placeholder="Password"
          name="password1"
          type="password"
          component={this.renderField}
        />

        <Field
          placeholder="Confirm Password"
          name="password2"
          type="password"
          component={this.renderField}
        />

        <Field
          placeholder="Current Weight"
          name="current_weight"
          type="text"
          component={this.renderField}
        />

        <Field
          placeholder="Gender"
          name="gender"
          type="text"
          component={this.renderSelectField}
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
  if (!values.name) {
    errors.name = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required.';
  }
  if (values.password1 !== values.password2) {
    errors.password1 = 'Passwords must match.';
  }
  if (values.password) {
    if (values.password1.length < 8) {
        errors.password1 = 'Password must be at least 8 characters long.';
    }
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'SignUpForm',
  onSubmitSuccess: afterSubmit
})(connect(null, { contactForm })(SignUpForm));
