import React, { Component } from 'react';
import { connect } from 'react-redux';
import { intakeToneForm } from '../actions';
import { Field, reduxForm } from 'redux-form';
import Alert from 'react-s-alert';
import { withRouter } from 'react-router-dom';

class ToneForm extends Component {
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
      <div className="form-group col">
        <label>What is your current activity level?</label>
        <select
          value="none"
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          {...field.input}
        >
          <option value="none">Select An Option</option>
          <option value="1.2">Sedentary (No Excercise)</option>
          <option value="1.375">
            Lightly Active (Light Excercise 1-3 Days/Week){' '}
          </option>
          <option value="1.55">
            Moderately Active (Moderate Excercise 3-5 Days/Week)
          </option>
          <option value="1.725">
            Very Active (Demanding Life Style/Excercise 6-7 Days/Week)
          </option>
          <option value="1.9">
            Extremely Active (Physically Demaning Job and Hard Daily Excercise)
          </option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    );
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return '';
      case true:
        return this.renderIntake();
      default:
        return this.renderIntake();
    }
  }

  onSubmit(values) {
    const { history, auth } = this.props;
    console.log(values);
    this.props.intakeToneForm(values, history, auth._id).then(() =>
      Alert.success(<h3>Plan Ready!</h3>, {
        position: 'top',
        effect: 'scale'
      })
    );
  }

  renderIntake() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
        <div className="container">
          <Field
            placeholder="Age"
            name="age"
            type="number"
            component={this.renderField}
          />
          <Field
            placeholder="Weight (lbs)"
            name="weight"
            type="number"
            component={this.renderField}
          />
          <Field
            placeholder="Height (inches)"
            name="height"
            type="number"
            component={this.renderField}
          />
          <Field
            placeholder="Body Fat% (If you have it)"
            name="body_fat"
            type="number"
            component={this.renderField}
          />
          <Field
            placeholder="none"
            name="activity_mod"
            type="number"
            component={this.renderSelectPlan}
          />
          <button type="submit" className="btn btn-outline-primary">
            Start Plan!
          </button>
        </div>
      </form>
    );
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <div className="row justify-content-center">
            <div className="col-md-6 text-center">
              <h2>Tone & Sculpt Plan Intake Form</h2>
              {this.renderIntake()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default reduxForm({
  form: 'Intakeform'
})(connect(mapStateToProps, { intakeToneForm })(withRouter(ToneForm)));
