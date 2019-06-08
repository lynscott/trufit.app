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
import { signUpUser, fetchExercises, createNewPlan, fetchWorkouts } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container } from 'reactstrap'
import Select from 'react-select'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'

const afterSubmit = (result, dispatch) => dispatch(reset('CreatePlanForm'))


// fake data generator
const getItems = count =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    id: `item-${k}`,
    title: `item ${k}`,
  }))

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const grid = 8

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 ${grid}px 0 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : 'grey',

  // styles we need to apply on draggables
  ...draggableStyle,
  position:'initial',

})

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  display: 'flex',
  padding: grid,
  overflow: 'visible',
  minHeight: '75px',
})


const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
}



class CreatePlanForm extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)

    this.state = {
      tooltipOpen: false,
      items: this.props.workouts,
      selected: []
    }

    this.onDragEnd = this.onDragEnd.bind(this)
  }


  /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
      droppable: 'items',
      droppable2: 'selected'
  };

  getList = id => this.state[this.id2List[id]];


  onDragEnd(result) {
    // dropped outside the list
    const { source, destination } = result

    // dropped outside the list
    if (!destination) {
        return
    }
    console.log(destination)

    if (source.droppableId === destination.droppableId) {
        const items = reorder(
            this.getList(source.droppableId),
            source.index,
            destination.index
        )

        let state = { items }

        if (source.droppableId === 'droppable2') {
            state = { selected: items }
        }

        this.setState(state)
    } else {
        const result = move(
            this.getList(source.droppableId),
            this.getList(destination.droppableId),
            source,
            destination
        )

        this.setState({
            items: result.droppable,
            selected: result.droppable2
        })
    }
  }

  componentDidMount = () => {
    this.props.fetchExercises()

    this.props.fetchWorkouts()
  }

  toggle = () => {
    console.log('tooltip hover')
    this.setState({ tooltipOpen: !this.state.tooltipOpen })
  }

  renderField(field) {
    const className = `form-control ${
      field.meta.touched && field.meta.error ? 'is-invalid' : ''
    }`

    let colSize = field.colSize ? field.colSize : ''
    return (
      <div className={'form-group col' + colSize} style={{marginLeft:'auto', marginRight:'auto'}}>
        <input
          placeholder={field.placeholder}
          className={className + ' list-inline-item'}
          type={field.type}
          spellCheck ={true}
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
    // console.log(field, 'select f')
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
          style={{ backgroundColor: '#e7e7e7'}}
          type={field.type}
          onChange = {(value) => {
            console.log(value)
            field.input.onChange(value.label)
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
            field.input.onChange(value.label)
        }}
      />
    )
  }


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
                name={`plan.weeks[${fields.index}].day[${fields.day}].workout.title`}
                type="text"
                colSize ={'-4'}
                style={{marginLeft:'auto', marginRight:'auto'}}
                component={this.renderField}
                />
              <FieldArray
                name={`plan.weeks[${fields.index}].day[${fields.day}].workout.exercises`}
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
        
  }


  renderCreateWorkout = (fields) => {
    return (
      <React.Fragment>
          <Field
            placeholder="Section Title"
            name={`plan.weeks[${fields.index}].day[${fields.day}].title`}
            type="text"
            colSize ={'-4'}
            style={{marginLeft:'auto', marginRight:'auto'}}
            component={this.renderField}
            />
          <FieldArray
            name={`plan.weeks[${fields.index}].day[${fields.day}].workout`}
            component={this.renderWorkoutArray}
          />
        </React.Fragment>
    )
  }

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
        <Col style={{marginLeft:'auto', marginRight:'auto'}}>
        {renderOptions()}
        </Col>
      </Row>
      </Container>
    )
  };



  async onSubmit(values) {
    // console.log(values)
    let weeks = this.props.values.plan.weeks
    let dayKeys = Object.keys(weeks[0].day)
    console.log(dayKeys)
    let workouts = []
    console.log(weeks)
    for (let i = 0; i < weeks.length; i++) {
      // console.log(weeks[i])
      for (let j = 0; j < dayKeys.length; j++) {
        // console.log(weeks[i].day[dayKeys[j]])
        if (weeks[i].day[dayKeys[j]].workout) {
          workouts.push(weeks[i].day[dayKeys[j]].workout)
        }   
      }
      
    }
    let newValues = {
      ...values,
      workouts
    }
    console.log(newValues, 'Altered with workouts!')
    try {
      await this.props.createNewPlan(newValues)
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
    console.log(this.props, 'PROPS')
    const { handleSubmit } = this.props

    return (
      <form
        className="p-4 bg-light"
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

        <DragDropContext onDragEnd={this.onDragEnd}>
        <label>Track One:</label>
        <Droppable droppableId="droppable" direction="horizontal" >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.state.items.map((item, index) => (
                // console.log(item)
                <Draggable key={item.title} draggableId={index+item.title} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      {item.title}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <label>Track Two:</label>
        <Droppable droppableId="droppable2" direction="horizontal">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}>
                    {this.state.selected.map((item, index) => (
                        <Draggable
                            key={item.title}
                            draggableId={index+item.title}
                            index={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                        snapshot.isDragging,
                                        provided.draggableProps.style
                                    )}>
                                    {item.title}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
      </DragDropContext>


        <Button type="submit" className="btn btn-outline-primary mt-4">
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
    exercises: state.admin.exercises,
    workouts: state.admin.workouts
  }
}

export default reduxForm({
  //   validate,
  form: 'CreatePlanForm',
  // onSubmitSuccess: afterSubmit,
  // initialValues
})(
  connect(
    mapStateToProps,
    { signUpUser, fetchExercises, createNewPlan, fetchWorkouts }
  )(CreatePlanForm)
)
