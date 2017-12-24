import React, { Component } from 'react';
import { Field, reset, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { trainingForm } from '../actions';
import Alert from 'react-s-alert';
import _ from 'lodash';

const afterSubmit = (result, dispatch) => dispatch(reset('TrainingForm'));

const FIELDS = [
  { name: 'first' },
  { name: 'last' },
  { name: 'email' },
  { name: 'phone' },
  { name: 'age' },
  { name: 'gender' },
  { name: 'weight' },
  { name: 'height' },
  { name: 'goals' },
  { name: 'history' },
  { name: 'diet' },
  { name: 'call_info' },
  { name: 'motivation' },
  { name: 'plan' }
];

class TrainingForm extends Component {
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

  renderSelectPlan(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col-md-6">
        <label>Which plan are you interested in?</label>
        <select
          value=" "
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          {...field.input}
        >
          <option value=" ">Select a Plan</option>
          <option value="Athlete">Athlete $199/Month </option>
          <option value="Life Style">Life Style $99/Month</option>
          <option value="Fitness">Fitness $59/Month</option>
        </select>
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
      <div className="form-group col-md-4">
        <select
          value="Gender"
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          {...field.input}
        >
          <option value="Gender">Gender</option>
          <option value="Male">Male </option>
          <option value="Female">Female</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

  renderTextField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`;
    return (
      <div className="form-group col-md-6">
        <textarea
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          rows="4"
          {...field.input}
        />
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

  onSubmit(values) {
    console.log(values);
    this.props.trainingForm(values).then(() =>
      Alert.success(
        <h3>Training form sent! We will reach out to you shortly!</h3>,
        {
          position: 'bottom',
          effect: 'scale'
        }
      )
    );
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className="form-row justify-content-center">
          <Field
            placeholder="First"
            name="first"
            type="text"
            component={this.renderField}
          />
          <Field
            placeholder="Last"
            name="last"
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
            placeholder="Phone Number"
            name="phone"
            type="tel"
            component={this.renderField}
          />
          <Field
            placeholder="Age"
            name="age"
            type="integer"
            component={this.renderField}
          />
          <Field
            placeholder="Gender"
            name="gender"
            type="text"
            component={this.renderSelectField}
          />
          <Field
            placeholder="Weight(lbs)"
            name="weight"
            type="integer"
            component={this.renderField}
          />
          <Field
            placeholder="Height(in)"
            name="height"
            type="text"
            component={this.renderField}
          />
          <Field
            placeholder="Body Fat % (if known)"
            name="body_fat"
            type="text"
            component={this.renderField}
          />
        </div>
        <div className="form-row justify-content-center">
          <Field
            placeholder="What is your desired goal? (Build muscle, Lose body fat, Get stronger, ect.)"
            name="goals"
            type="textarea"
            component={this.renderTextField}
          />
          <Field
            placeholder="Tell me about your past fitness experience and current regimen."
            name="history"
            type="textarea"
            component={this.renderTextField}
          />
          <Field
            placeholder="Any foods you can't/won't eat? What is your current diet like?"
            name="diet"
            type="textarea"
            component={this.renderTextField}
          />
          <Field
            placeholder="What motivated you to take this step in your fitness journey?"
            name="motivation"
            type="textarea"
            component={this.renderTextField}
          />
          <Field
            placeholder="When is a specific time and date Lyn can call you to start your program?"
            name="call_info"
            type="textarea"
            component={this.renderTextField}
          />
          <Field
            placeholder="Plan"
            name="plan"
            type="text"
            component={this.renderSelectPlan}
          />
        </div>
        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  _.each(FIELDS, ({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'TrainingForm',
  onSubmitSuccess: afterSubmit
})(connect(null, { trainingForm })(TrainingForm));
