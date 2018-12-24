import React, { Component } from 'react'
import { Field, reset, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { signUpUser } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from 'reactstrap'

const afterSubmit = (result, dispatch) => dispatch(reset('SignUpForm'))

class SignUpForm extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)

    this.state = { 
      tooltipOpen: false, 
    }

  }


  toggle = () => {
    console.log('tooltip hover')
    this.setState({tooltipOpen: !this.state.tooltipOpen})
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
          style={{backgroundColor:'#e7e7e7'}}
          type={field.type}
          {...field.input}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="none">Prefer Not To Say</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }


  async onSubmit(values) {
    console.log(values)
    try {
      // await this.props.signUpUser(values)
      this.props.closeForm()
      Alert.success(<h3>Success!</h3>, {
        position: 'bottom',
        effect: 'scale'
      })
    } catch (error) {
      Alert.error(<h3>{error}</h3>, {
        position: 'bottom',
        effect: 'scale'
      })
    }
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form className="p-4" onSubmit={handleSubmit(this.onSubmit.bind(this))} 
        style={{margin:0, borderRadius:'5px'}}
      >
      <FontAwesomeIcon icon="user-plus" size={'3x'} />
      <h2>Create An Account</h2>
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
        
        <FontAwesomeIcon id="ExtraInfoTooltip" icon="info-circle" />
        {/* <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="ExtraInfoTooltip" href='#' toggle={this.toggle}> */}
          <p style={{textAlign:'left', fontSize:'15px', paddingLeft:'15px', paddingRight:'15px'}}>
            Your weight, height, and gender help determine a better caloric intake and BMR and are soley
            used to help personalize your training plan and nutrition guide.</p>
        {/* </Tooltip> */}
        <Field
          placeholder="Current Weight"
          name="current_weight"
          type="text"
          component={this.renderField}
        />

        <div className = 'pl-3 pr-3 row align-items-center'>
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
  if (values.password) {
    if (values.password1.length < 8) {
        errors.password1 = 'Password must be at least 8 characters long.'
    }
  }

  return errors
}

export default reduxForm({
  validate,
  form: 'SignUpForm',
  onSubmitSuccess: afterSubmit
})(connect(null, { signUpUser })(SignUpForm))
