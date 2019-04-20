import React, { Component } from 'react'
import { Field, reset, reduxForm, getFormValues } from 'redux-form'
import { connect } from 'react-redux'
import { signUpUser } from '../actions'
// import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Media, Alert } from 'reactstrap'
import Fade from 'react-reveal/Fade'
import TypeList from '../containers/types'
import TypeDetail from '../containers/type_detail'

const afterSubmit = (result, dispatch) => dispatch(reset('SignUpForm'))

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.toggle2 = this.toggle2.bind(this)

    this.state = {
      tooltipOpen: false,
      tooltip2: false,
      page: 1,
      nextBtn: false,
      activeType: true,
      visible: true
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    // console.log(prevProps, 'prev props')
    if (prevProps.activeType !== this.props.activeType) {
      this.setState({ activeType: true })
    }

    if (prevProps.values && this.props.values) {
      if (prevProps.values !== this.props.values) {
        if (
          this.props.values.email !== undefined &&
          this.props.values.name !== undefined &&
          this.props.values.password2 !== undefined &&
          this.state.activeType
        ) {
          this.setState({ nextBtn: true })
        }
      }
    }
  }



  toggle = () => {
    console.log('tooltip hover')
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  toggle2 = () => {
    console.log('tooltip hover')
    this.setState({ tooltip2: !this.state.tooltip2 })
  }

  renderField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col">
        <input
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          required
          style={{ backgroundColor: '#e7e7e7' }}
          {...field.input}
        />
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderSelectField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col">
        <select
          width="100%"
          value="none"
          placeholder={field.placeholder}
          className={className}
          style={{ backgroundColor: '#e7e7e7' }}
          type={field.type}
          required
          {...field.input}
        >
          <option value="none">Select One</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderSomatypeField = field => {
    // console.log(this.props, field.meta.touched)
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col">
        <TypeList />
        <br />
        <TypeDetail />
        {field.input.onChange(this.props.activeType.type)}
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderSelectActivityLevel(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col">
        <label>{field.label}</label>
        <Input
          width="100%"
          placeholder={field.placeholder}
          className={className}
          style={{ backgroundColor: '#e7e7e7' }}
          type="select"
          {...field.input}
        >
          <option value={1.25}>Little or no exercise.</option>
          <option value={1.3}>Exercise/sports 1-3 days/week.</option>
          <option value={1.55}>Exercise/aerobic activity 3-5 days/week.</option>
          <option value={1.725}>Heavy exercise every day.</option>
          <option value={1.9}>
            Heavy exercise 2 or more times per day, or training for marathon/triathlon.
          </option>
        </Input>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  async onSubmit(values) {
    this.props.values.somatype = this.props.activeType
    try {
      await this.props.signUpUser(values)
      
      // this.props.closeForm()
    } catch (error) {
      console.log(error)
    }
  }

  onDismiss = () => {
    this.setState({visible:false})
    this.props.closeForm()
  }

  render() {
    const { handleSubmit, values } = this.props
    // console.log(this.props)

    return (
      <form
        className="p-3"
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        style={{ margin: 0, borderRadius: '5px' }}
      >
 
        <Alert color="success" isOpen={this.props.signUpSuccess} toggle={this.onDismiss}>
          Success! A welcome email has been sent to your address.
        </Alert>
        
        {/* <h2>*Sign up is temporarily disabled to prepare for service launch!*</h2> */}
        <FontAwesomeIcon icon="user-plus" size={'2x'} />
        <h3>Create An Account</h3>

        {this.state.page === 1 ? (
          <Fade top cascade>
            <React.Fragment>
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
              <FontAwesomeIcon id="bodyTypeTooltip" icon="info-circle" />
              <Tooltip
                placement="right"
                isOpen={this.state.tooltip2}
                target="bodyTypeTooltip"
                href="#"
                toggle={this.toggle2}
              >
                <p
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  paddingLeft: '10px',
                  paddingRight: '10px'
                }}
                >
                  Select a body type that most accurately represents you! Note:
                  You may not feel 100% one type and that's okay! Select the one
                  that best represents your current physique.
                </p>
              </Tooltip>

              <Field
                placeholder="Body Type"
                name="somatype"
                type="text"
                component={this.renderSomatypeField}
              />
            </React.Fragment>
          </Fade>
        ) : null}

        {this.state.page === 2 ? (
          <Fade right>
            <React.Fragment>
              <FontAwesomeIcon id="ExtraInfoTooltip" icon="info-circle" />
              <Tooltip
                placement="right"
                isOpen={this.state.tooltipOpen}
                target="ExtraInfoTooltip"
                href="#"
                toggle={this.toggle}
              >
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '14px',
                    paddingLeft: '10px',
                    paddingRight: '10px'
                  }}
                >
                  Your weight, height, age, and gender help estimate your bodies
                  metabolic rate and are solely used to help personalize your
                  training plan and nutrition guide.
                </p>
              </Tooltip>
              <Field
                placeholder="Current Weight"
                name="current_weight"
                type="text"
                component={this.renderField}
              />

              <div className="pl-1 pr-1 row align-items-center">
                <label>Height</label>
                <Field
                  placeholder="Feet"
                  name="height_ft"
                  type="number"
                  component={this.renderField}
                />

                <Field
                  placeholder="Inches"
                  name="height_in"
                  type="number"
                  component={this.renderField}
                />
              </div>

              <Field
                placeholder="Age"
                name="age"
                type="number"
                component={this.renderField}
              />

              <Field
                placeholder="Gender"
                name="gender"
                type="text"
                component={this.renderSelectField}
              />

              <Field
                placeholder="Activity Level"
                label="Choose a current level of activity that best fits you."
                name="activity_mod"
                type="number"
                component={this.renderSelectActivityLevel}
              />
            </React.Fragment>
          </Fade>
        ) : null}

        {this.state.page === 2 ? (
          <Button
            className="mx-3"
            color="secondary"
            onClick={() => this.setState({ page: 1 })}
          >
            Previous
          </Button>
        ) : null}
        {this.state.page === 1 ? (
          <Button
            color="success"
            disabled={!this.state.nextBtn}
            onClick={() => this.setState({ page: 2, tooltip2: false })}
          >
            Next
          </Button>
        ) : (
          <button type="submit" className="btn btn-outline-danger">
            Submit
          </button>
        )}
      </form>
    )
  }
}

function validate(values) {
  const errors = {}
  if (!values.name) {
    errors.name = 'Required'
  }
  if (!values.email) {
    errors.email = 'Required.'
  }
  if (values.password1 !== values.password2) {
    errors.password1 = 'Passwords must match.'
  }
  if (values.password1) {
    if (values.password1.length < 8) {
      errors.password1 = 'Password must be at least 8 characters long.'
    }
  }
  if (!values.current_weight) {
    errors.current_weight = 'Required.'
  }
  if (!values.height_ft) {
    errors.height_ft = 'Required.'
  }
  if (!values.height_in) {
    errors.height_in = 'Required.'
  }
  if (!values.age) {
    errors.age = 'Required.'
  }
  if (!values.gender) {
    errors.gender = 'Required.'
  }
  if (!values.activity_mod) {
    errors.activity_mod = 'Required.'
  }

  return errors
}

const mapStateToProps = state => {
  return {
    activeType: state.activeType,
    values: getFormValues('SignUpForm')(state),
    signUpSuccess: state.auth.signUp
  }
}

export default reduxForm({
  validate,
  form: 'SignUpForm',
  onSubmitSuccess: afterSubmit
})(
  connect(
    mapStateToProps,
    { signUpUser }
  )(SignUpForm)
)
