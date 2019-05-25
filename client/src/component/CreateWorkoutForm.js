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
import { signUpUser, fetchExercises, createNewWorkout } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container } from 'reactstrap'
import Select from 'react-select'
import Creatable from 'react-select'

const afterSubmit = (result, dispatch) => dispatch(reset('CreateWorkoutForm'))

class CreateWorkoutForm extends Component {
  constructor(props) {
    super(props)

    // this.toggle = this.toggle.bind(this)

    this.state = {
      tooltipOpen: false
    }
  }

  componentDidMount = () => {
    this.props.fetchExercises()
  }

  renderSelectField = field => {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col-md-3">
        <select
          width="100%"
          value="lift"
          placeholder={field.placeholder}
          className={className + ' list-inline-item'}
          style={{ backgroundColor: '#e7e7e7' }}
          type={field.type}
          onChange={value => {
            // console.log(value)
            field.input.onChange(value.label)
          }}
          {...field.input}
        >
          <option value="lift">Strength Training</option>
          <option value="cardio">Aerobic</option>
          <option value="none">HIIT</option>
          <option value="none">Recovery</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderSelectActivityLevel = field => {
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
          <option value={'upper_body'}>Upper Body</option>
          <option value={'lower_body'}>Lower Body</option>
          <option value={'full_body'}>Full Body</option>
          <option value={'functional'}>Functional Fitness</option>
          <option value={'cross_fit'}>CrossFit</option>
        </Input>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderWorkoutSelect = field => {
    return (
      <Select
        options={field.items}
        className="workout-selector__field form-group col-md-4"
        classNamePrefix="workout-selector"
        onChange={value => {
          console.log(value)
          field.input.onChange(value.label)
        }}
      />
    )
  }

  renderField = field => {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col ">
        <input
          placeholder={field.placeholder}
          className={className}
          type={field.type}
          style={{ backgroundColor: '#e7e7e7', textAlign:'center' }}
          {...field.input}
        />
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderWorkoutList = ({ fields, meta: { error, submitFailed }, values }) => {
    console.log(this.props.values)
    return (
      <Col md="10">
        {fields.map((workout, index) => (
          <React.Fragment>
            <div className="row justify-content-center">
              <Field
                placeholder="exercise"
                name={`${workout}.name`}
                items={this.formatExercises(this.props.exercises)}
                type="text"
                component={this.renderWorkoutSelect}
              />
              <Field
                placeholder="Category"
                name={`${workout}.category`}
                type="text"
                component={this.renderSelectField}
              />
              <Field
                placeholder="sets"
                name={`${workout}.sets`}
                type="text"
                component={this.renderField}
              />
              <Field
                placeholder="reps"
                name={`${workout}.reps`}
                type="text"
                component={this.renderField}
              />
              <Field
                placeholder="tempo/note"
                name={`${workout}.note`}
                type="text"
                component={this.renderField}
              />
            </div>
          </React.Fragment>
        ))}
        <Row className="justify-content-center">
          <Col>
            <Button
              // className="add-week-button"
              raised
              onClick={() => fields.push({})}
            >
              Add exercise
            </Button>
          </Col>
        </Row>
      </Col>
    )
  }

  async onSubmit(values) {
    console.log(values, 'NEW WORKOUT')
    this.props.createNewWorkout(values)

  }

  formatExercises = exerciseArray => {
    let format = exerciseArray.map(e => {
      return {
        value: e.name,
        label: e.name.replace(/\b\w/g, l => l.toUpperCase())
      }
    })

    return format
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <form
        className="p-4 bg-light col-md-10"
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        style={{ margin: 0, borderRadius: '5px' }}
      >
        {/* <FontAwesomeIcon icon="user-plus" size={'3x'} /> */}
        <h2>Create New Workout </h2>
        <div className="row justify-content-center">
          <Col md="3">
            <label>{'Workout Title'}</label>
            <Field
              placeholder="Title"
              name="workout.title"
              type="text"
              component={this.renderField}
            />
          </Col>
          <Col md="3">
            <Field
              placeholder="Type"
              name="workout.type"
              type="text"
              label={'Workout Type'}
              component={this.renderSelectActivityLevel}
            />
          </Col>

          <FieldArray
            name={'workout.list'}
            component={this.renderWorkoutList}
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
  onSubmitSuccess: afterSubmit,
  // initialValues
})(
  connect(
    mapStateToProps,
    { signUpUser, fetchExercises, createNewWorkout }
  )(CreateWorkoutForm)
)
