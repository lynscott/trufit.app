import React, { Component } from 'react';
import { Field, reset, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { contactForm } from '../actions';
import Alert from 'react-s-alert';

const afterSubmit = (result, dispatch) => dispatch(reset('ContactForm'));

class ContactForm extends Component {
  renderField(field) {
    const className = `form-control-lg ${
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
    const className = `form-control-lg ${
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
          <option value="none">Select An Option</option>
          <option value="Fat Loss">Fat Loss</option>
          <option value="Mass Gain">Mass Gain</option>
          <option value="Online Training">Online Training</option>
          <option value="Saying Hi!">Just Saying Hi!</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

  renderTextField(field) {
    const className = `form-control-lg ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col">
        <textarea
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          rows="3"
          {...field.input}
        />
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

  async onSubmit(values) {
    await this.props.contactForm(values);
    Alert.success(<h3>Email sent!</h3>, {
      position: 'bottom',
      effect: 'scale'
    });
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
          placeholder="Interest"
          name="subject"
          type="text"
          component={this.renderSelectField}
        />

        <Field
          placeholder="Type Your Message Here!"
          name="message"
          type="textarea"
          component={this.renderTextField}
        />

        <button
          type="submit"
          className="btn btn-outline-primary btn-lg btn-block"
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
    errors.last = <strong>Oops! Forgot your Name.</strong>;
  }
  if (!values.email) {
    errors.email = 'Oops! Forgot your Email.';
  }
  if (values.subject === 'none') {
    errors.subject = 'Oops! Please choose an option.';
  }
  if (!values.message) {
    errors.message = 'Oops! Your message needs a message!';
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'ContactForm',
  onSubmitSuccess: afterSubmit
})(connect(null, { contactForm })(ContactForm));
