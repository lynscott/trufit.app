import React, { Component } from 'react'
import {
  Field,
  reset,
  reduxForm,
  FieldArray,
  Fields,
  getFormValues,
  change,
  untouch,
  touch
} from 'redux-form'
import { connect } from 'react-redux'
import { signUpUser, fetchExercises, createNewPlan } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container } from 'reactstrap'
import Select from 'react-select'
import Creatable from 'react-select'

const afterSubmit = (result, dispatch) => dispatch(reset('CreateWorkoutForm'))


class CreateWorkoutForm extends Component {
    constructor(props) {
        super(props)
    
        this.toggle = this.toggle.bind(this)
    
        this.state = {
          tooltipOpen: false
        }
      }
    
      componentDidMount = () => {
        this.props.fetchExercises()
      }

      renderWorkoutSelect =(field) => {
        return (
          <Select
            options = {field.items}
            className='workout-selector__field form-group col'
            classNamePrefix='workout-selector'
            onChange = {(value) => {
                console.log(value)
                field.input.onChange(value.label)
            }}
          />
        )
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
              style={{ backgroundColor: '#e7e7e7' }}
              {...field.input}
            />
            <div className="invalid-feedback">
              {field.meta.touched ? field.meta.error : ''}
            </div>
          </div>
        )
      }

      render() {
        const { handleSubmit } = this.props

        return (
          <form
            className="p-4"
            onSubmit={handleSubmit(this.onSubmit.bind(this))}
            style={{ margin: 0, borderRadius: '5px' }}
          >
            {/* <FontAwesomeIcon icon="user-plus" size={'3x'} /> */}
            {/* <h2>Create New Training Plan</h2> */}
            <div className='row justify-content-center'>
              <Field
                placeholder="Category"
                name="workout.category"
                type="text"
                component={this.renderField}
              />
    
              <Field
                placeholder="Sets"
                name="workout.sets"
                type="text"
                component={this.renderField}
              />
    
              <Field
                placeholder="Reps"
                name="workout.reps"
                type="text"
                component={this.renderField}
              />

                <Field
                placeholder="Time"
                name="workout.time"
                type="text"
                component={this.renderField}
              />
            </div>
        
            <Button type="submit" className="btn btn-outline-primary mt-4">
              Submit
            </Button>
          </form>
        )
      }
}

const mapStateToProps = state => {
    return {
      values: getFormValues('CreateWorkoutForm')(state),
      exercises: state.admin.exercises
    }
  }
  
  export default reduxForm({
    //   validate,
    form: 'CreateWorkoutForm',
    // onSubmitSuccess: afterSubmit,
    initialValues
  })(
    connect(
      mapStateToProps,
      { signUpUser, fetchExercises, createNewPlan }
    )(CreateWorkoutForm)
  )