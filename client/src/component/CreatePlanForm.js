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
import { signUpUser, fetchExercises } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container } from 'reactstrap'
import Select from 'react-select'
import Creatable from 'react-select'

const afterSubmit = (result, dispatch) => dispatch(reset('CreatePlanForm'))


const initialValues = {
    plan:{
        weeks:[{
            day:{
                mon:{
                  type:null, 
                  val:false
                },
                tue:{
                  type:null, 
                  val:false
                },
                wed:{
                  type:null, 
                  val:false
                },
                thu:{
                  type:null, 
                  val:false
                },
                fri:{
                  type:null, 
                  val:false
                },
                sat:{
                  type:null, 
                  val:false
                },
                sun:{
                  type:null, 
                  val:false
                }
            }
        }]
    }
}

const initWeek = {
  day:{
      mon:{
        type:null, 
        val:false
      },
      tue:{
        type:null, 
        val:false
      },
      wed:{
        type:null, 
        val:false
      },
      thu:{
        type:null, 
        val:false
      },
      fri:{
        type:null, 
        val:false
      },
      sat:{
        type:null, 
        val:false
      },
      sun:{
        type:null, 
        val:false
      }
  }
}

class CreatePlanForm extends Component {
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

  toggle = () => {
    console.log('tooltip hover')
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  };

  renderField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`

    let colSize = field.colSize ? field.colSize : ''
    return (
      <div className={"form-group col" + colSize}>
        <input
          placeholder={field.placeholder}
          className={className + ' list-inline-item'}
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

  renderSelectField(field) {
    console.log(field, 'select f')
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`
    return (
      <div className="form-group col-md-4">
        <select
          width="100%"
          value="lift"
          placeholder={field.placeholder}
          className={className + ' list-inline-item'}
          style={{ backgroundColor: '#e7e7e7' }}
          type={field.type}
          onChange = {(value) => {
            console.log(value)
            field.input.onChange(value)
          }}
          {...field.input}
        >
          <option value="cardio">Cardio</option>
          <option value="lift">Lift</option>
          <option value="none">Rest</option>
        </select>
        <div className="invalid-feedback">
          {field.meta.touched ? field.meta.error : ''}
        </div>
      </div>
    )
  }

  renderWorkoutSelect =(field) => {
    return (
      <Select
        options = {field.items}
        className='workout-selector__field form-group col'
        classNamePrefix='workout-selector'
        onChange = {(value) => {
            console.log(value)
            field.input.onChange(value)
        }}
      />
    )
  }

  renderWorkoutArray = ({ fields, meta: { error, submitFailed }, values }) => {

    let formatExercises = (exerciseArray) => {
      let formmated = exerciseArray.map(e => {
        return {value:e.name, label:e.name.replace(/\b\w/g, l => l.toUpperCase())} 
      })

      return formmated
    }

    return (
      <React.Fragment>
        {fields.map((workout, index) => (
          <React.Fragment>
            <div className="row justify-content-center">
              <Field
                placeholder="exercise"
                name={`${workout}.name`}
                items ={formatExercises(this.props.exercises)}
                type="text"
                component={this.renderWorkoutSelect}
              />
              <Field
                placeholder="reps"
                name={`${workout}.reps`}
                type="text"
                colSize ={'-2'}
                component={this.renderField}
              />
              <Field
                placeholder="sets"
                name={`${workout}.sets`}
                type="text"
                colSize ={'-2'}
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
        <Row className='justify-content-center'>
          <Col>
        <Button
          className="add-week-button"
          raised
          onClick={() => fields.push({})}
        >
          Add another workout
        </Button>
        </Col>
        </Row>
      </React.Fragment>
    )
  };

  renderDayType = fields => {
    
    // console.log(fields.type)
    let activityType = () => {
      if (fields.dayType == 'cardio') {
        return (
            <Field
              placeholder="cardio"
              name={fields.names[0]}
              type="text"
              colSize={'-4'}
              component={this.renderField}
            />
        )
      } else if (fields.dayType==='lift') {
        return (
            <React.Fragment>
              <Field
                placeholder="Section Title"
                name={`plan.weeks[${fields.index}].day[${fields.day}].title`}
                type="text"
                colSize ={'-4'}
                component={this.renderField}
                />
              <FieldArray
                name={`plan.weeks[${fields.index}].day[${fields.day}].workout`}
                component={this.renderWorkoutArray}
              />
            </React.Fragment>
        )
      } else if (fields.dayType==='none') {
          return null
      }
    }

    return (
      <React.Fragment>
      {activityType()}
      </React.Fragment>
    )
        
  
  };

  renderDayCheckbox = field => {

    let checkBox= this.props.values.plan.weeks[field.index].day[field.label.toLowerCase()].val
    
    // console.log(dayType,'type bih')

    let renderOptions = () => {
      if (checkBox) {
        return (
          // <Col >
          <Fields
          names={[
            
            `plan.weeks[${
              field.index
            }].day[${field.label.toLowerCase()}].cardio`,
            `plan.weeks[${field.index}].day[${field.label.toLowerCase()}].rest`
          ]}
          shortNames={['same_time', 'start_time', 'end_time']}
          className="test"
          index={field.index}
          dayType={field.dayType}
          day={field.label.toLowerCase()}
          component={this.renderDayType}
        />
        // </Col>
        )
      } else {
        return null
      }
    }

    return (
      <Container>
      <Row className='justify-content-left'>
        <Col md='1'>
        <h5>{field.label}</h5>
        </Col>
        <Col md='1'>
        <Input
          {...field.input}
          label={field.label}
          onChange={changeEvent => {
            field.input.onChange(changeEvent)
          }}
          // name={field.name}
          type="checkbox"
          // labelBefore={field.labelBefore} type={field.type} id={field.id}
        />
        </Col>
        { checkBox ?
        <div className='col'>
        <Field
          placeholder="type"
          name={`plan.weeks[${field.index}].day[${field.label.toLowerCase()}].type`}
          type="text"
          component={this.renderSelectField}
        />
        </div>
        : null}
        
      </Row>
      <Row className='justify-content-center m-3'>
        <Col>
        {renderOptions()}
        </Col>
      </Row>
      </Container>
    )
  };

  renderWeeksFields = ({ fields, meta: { error, submitFailed }, values }) => {
    // let dayType = this.props.values.plan.weeks[field.index].day[field.label.toLowerCase()].type
    return (
      <React.Fragment>
        {fields.map((week, index) => (
          <React.Fragment>
            <h2>Week {index+1}</h2>
            <Field
              id={`mon-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.mon.val`}
              className="weekday-checkbox"
              index={index}
              component={this.renderDayCheckbox}
              labelBefore
              dayType={this.props.values.plan.weeks[index].day['mon'].type}
              label={'Mon'}
            />
            <Field
              id={`tue-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.tue.val`}
              className="weekday-checkbox"
              index={index}
              component={this.renderDayCheckbox}
              labelBefore
              dayType={this.props.values.plan.weeks[index].day['tue'].type}
              label={'Tue'}
            />
            <Field
              id={`wed-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.wed.val`}
              className="weekday-checkbox"
              index={index}
              component={this.renderDayCheckbox}
              labelBefore
              dayType={this.props.values.plan.weeks[index].day['wed'].type}
              label={'Wed'}
            />
            <Field
              id={`thu-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.thu.val`}
              className="weekday-checkbox"
              index={index}
              component={this.renderDayCheckbox}
              labelBefore
              dayType={this.props.values.plan.weeks[index].day['thu'].type}
              label={'Thu'}
            />
            <Field
              id={`fri-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.fri.val`}
              className="weekday-checkbox"
              index={index}
              dayType={this.props.values.plan.weeks[index].day['fri'].type}
              component={this.renderDayCheckbox}
              labelBefore
              label={'Fri'}
            />
            <Field
              id={`sat-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.sat.val`}
              className="weekday-checkbox"
              index={index}
              dayType={this.props.values.plan.weeks[index].day['sat'].type}
              component={this.renderDayCheckbox}
              labelBefore
              label={'Sat'}
            />
            <Field
              id={`sun-select-${index}`}
              placeholder="example"
              type="checkbox"
              name={`${week}.day.sun.val`}
              className="weekday-checkbox"
              index={index}
              dayType={this.props.values.plan.weeks[index].day['sun'].type}
              component={this.renderDayCheckbox}
              labelBefore
              label={'Sun'}
            />
          </React.Fragment>
        ))}
        <Button
          className="add-week-button"
          raised
          onClick={() => fields.push(initWeek)}
        >
          Add another week
        </Button>
      </React.Fragment>
    )
  };

  async onSubmit(values) {
    console.log(values)
    try {
      // await this.props.signUpUser(values)
      //   this.props.closeForm()
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
    console.log(this.props.values)
    const { handleSubmit } = this.props

    return (
      <form
        className="p-4"
        onSubmit={handleSubmit(this.onSubmit.bind(this))}
        style={{ margin: 0, borderRadius: '5px' }}
      >
        {/* <FontAwesomeIcon icon="user-plus" size={'3x'} /> */}
        <h2>Create New Training Plan</h2>
        <div className='row justify-content-center'>
        <Field
          placeholder="Title"
          name="plan.title"
          type="text"
          component={this.renderField}
        />

        <Field
          placeholder="Category"
          name="plan.category"
          type="text"
          component={this.renderField}
        />

        <Field
          placeholder="Logo"
          name="plan.logo"
          type="text"
          component={this.renderField}
        />
        </div>

        <FieldArray name="plan.weeks" component={this.renderWeeksFields} />

        <Button type="submit" className="btn btn-outline-primary">
          Submit
        </Button>
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

const mapStateToProps = state => {
  return {
    values: getFormValues('CreatePlanForm')(state),
    exercises: state.admin.exercises
  }
}

export default reduxForm({
  //   validate,
  form: 'CreatePlanForm',
  onSubmitSuccess: afterSubmit,
  initialValues
})(
  connect(
    mapStateToProps,
    { signUpUser, fetchExercises }
  )(CreatePlanForm)
)
