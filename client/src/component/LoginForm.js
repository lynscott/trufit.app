import React, { Component } from 'react'
import { Field, reset, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { signInUser, resetSignUpFail } from '../actions'
import { withRouter } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Alert } from 'reactstrap'

const afterSubmit = (result, dispatch) => dispatch(reset('LoginForm'))

class LoginForm extends Component {
  constructor(props) {
    super(props)


    this.state = {
      visible: false
    }
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
          style={{backgroundColor:'#e7e7e7'}}
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
    )
  }


  async onSubmit(values) {

    try {
    // console.log(values)
    await this.props.signInUser(this.props.history ,values)
    // this.props.closeForm()
    } catch (error) {
      console.log(error)
      // this.setState({visible:true})
    }
    
  }

  //TODO: Create dedicated signup error logic
  onDismissFail = () => {
    // this.setState({visible:false})
    this.props.resetSignUpFail()
  }

  render() {
    const { handleSubmit } = this.props
    console.log(this.props.signUpFail)

    return (
      <form className='p-4' onSubmit={handleSubmit(this.onSubmit.bind(this))}
      >
      <FontAwesomeIcon icon="user-circle" size={'3x'} />
      <h2>Sign In To Your Account</h2>
      <Alert color="danger" isOpen={this.props.signUpFail} toggle={this.onDismissFail}>
          Incorrect email or password.
      </Alert>

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
          className="btn btn-outline-primary mb-3"
        >
          Submit
        </button>

        <br/>
        {/* <h4>or</h4>
        <a
          href="/auth/google"
          id="login-button"
          className="btn btn-danger"
        >
          <i className="fab fa-google" /> Sign In With Google
        </a>
        <br />
        <br />
        <a
          href="auth/facebook"
          id="login-button"
          className="btn btn-primary"
        >
          <i className="fab fa-facebook-f" /> Sign In With Facebook
        </a> */}
      </form>
    )
  }
}

function validate(values) {
  const errors = {}

  if (!values.email) {
    errors.email = 'Required.'
  }
  if (!values.password) {
    errors.password = 'Required.'
  }


  return errors
}

const mapStateToProps = state => {
  return {
    // activeType: state.activeType,
    // values: getFormValues('SignUpForm')(state),
    // signUpSuccess: state.auth.signUp,
    signUpFail: state.auth.signUpFail,
    errorMessage: state.auth.errorMessage
  }
}

export default reduxForm({
  validate,
  form: 'LoginForm',
  onSubmitSuccess: afterSubmit
})(withRouter(connect(mapStateToProps, { signInUser, resetSignUpFail })(LoginForm)))
