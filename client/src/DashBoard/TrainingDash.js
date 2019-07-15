import React, { Component } from 'react'
// import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
// import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './TrainingDash.scss'
import {COLLAPSE_TRIGGER_WIDTH, FULL_LAYOUT_WIDTH} from '../constants/Layout'
import windowSize from 'react-window-size'
import Calendar from 'react-calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Collapse,
  Input,
  Button,
  Media, ButtonGroup,
  Jumbotron, Card, CardImg, CardTitle, CardText, CardColumns,
  CardSubtitle, CardBody
} from 'reactstrap'

// const localizer = momentLocalizer(moment)
const DAYS_ENUM = {'Monday':1, 'Tuesday':2, 'Wednesday':3, 'Thursday':4, 'Friday':5, 'Saturday':6, 'Sunday':0}
const SELECTED_DAYS_INIT = {'Monday': false, 'Tuesday': false, 'Wednesday': false, 'Thursday': false, 'Friday': false, 'Saturday': false, 'Sunday': false}

class TrainingDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: -1, // Allows us to index the plan from the store and get its information. Negative because no plan selected.
      planningStage: 0, // There are currently 3 stages to create a training plan. Selecting the plan, selecting available days, submitting the plan.
      daysSelected: SELECTED_DAYS_INIT,
      numDaysSelected: 0,
      anyDaySelected: false,
      initPlanDays: [],
      result:[]
    }
  }

  componentDidMount() {
    this.props.fetchPlanTemps()
  }

  componentDidUpdate(prevProps, prevState) {
    /*
    if (this.state.daysSelected.length !== prevState.daysSelected.length) {
      console.log('REG CHANGE', prevState.daysSelected.length, this.state.daysSelected.length)
      let result = []
      this.state.daysSelected.map(dayKey=>{
        let start = moment('2019-07-15'), // July. 15th
        end   = moment('2019-09-13'), // Sept. 13th
        day   = dayKey                    // Monday
  
        console.log(dayKey, 'KEY')
        let current = start.clone()
  
        while (current.day(7 + day).isBefore(end)) {
          result.push({title:day,start: new Date(current.clone()), 
            allDay:true, end: new Date(current.day(0+day))})
        }
      })
      this.setState({result:result})
    }*/
  }

  /**
   * Get a value of the number of days selected within the object.
   */
  getNumberOfDaysSelected = () => {
    let count = 0
    for(let key in Object.keys(this.state.daysSelected)){
      if(this.state.daysSelected[key])
        count++
    }

    return count
  }

  /**
   * Toggle a selected day.
   */
  toggleSelectedDay = (day) => {
    // Sanity Check
    if(!(day in SELECTED_DAYS_INIT))
      return

    let daysSelected = {...this.state.daysSelected}
    // Keep track of number of selected, count.
    let numDaysSelected = daysSelected[day] ? this.state.numDaysSelected - 1 : this.state.numDaysSelected + 1

    // Now toggle the day
    daysSelected[day] = !daysSelected[day]

    // Go to the stage 2 if the number of days matches the training plan days
    let nextStage = this.state.planningStage
    if(this.props.plans[this.state.activeIndex]['workoutData'].length <= numDaysSelected)
      nextStage = 2
    else
      nextStage = 1

    this.setState({daysSelected, numDaysSelected, planningStage: nextStage, anyDaySelected: false})
  }

  /**
   * Toggle all days.
   */
  toggleAllDays = () => {
    let daysSelected = {...this.state.daysSelected}
    let planningStage = this.state.anyDaySelected ? 1 : 2 // Go to previous stage or next stage.
    let numDaysSelected = this.state.anyDaySelected ? 0 : Object.keys(this.state.daysSelected).length

    if(this.state.anyDaySelected){
      for(let day of Object.keys(daysSelected)){
        daysSelected[day] = false
      }
    }
    else{
      for(let day of Object.keys(daysSelected)){
        daysSelected[day] = true
      }
    }

    this.setState({anyDaySelected: !this.state.anyDaySelected, daysSelected, planningStage, numDaysSelected})

  }

  /**
   * Generate a training split message.
   * Each workout is set to specific split. Like a 3-day split requires at leasts 3 days selected etc...
   */
  buildTrainingSplitMessage = (activePlanIndex) => {
    // Sanity check
    if (activePlanIndex < 0)
      return <span></span>

    let trainingPlan = this.props.plans[activePlanIndex]

    let category = trainingPlan['category']
    let name = trainingPlan['name']
    let numWorkouts = trainingPlan['workoutData'].length
    
    return <span>{`${name} is a training plan that requires at least `} <b> {`${numWorkouts} days`} </b> per week.</span>
  }

  renderCalendar = () => {
    return (
      <Col md={12}>
        <Calendar
          // onChange={this.onChange}
          style={{width:'100%'}}
          minDetail={'month'}
          value={new Date()}
          tileContent={({ date, view }) => {
            for (let day of this.state.result) {
              if (date.getDay() === day.start.getDay()) {
                return <p>Training</p>
              }
              else return null
            }
          }}
        />
      </Col>
    )
  }

  renderAvailableDays = () => {
    let daySplitMessage = this.buildTrainingSplitMessage(this.state.activeIndex)

    return (
      <Collapse isOpen={this.state.planningStage >= 1}>
        <Row className='justify-content-center'>
        <Label size='lg' >
          {daySplitMessage}<br/>
          What days can you workout?
        </Label>
        <ButtonGroup size={'lg'} className='m-3'
          vertical={!(this.props.windowWidth > FULL_LAYOUT_WIDTH)}>
          <Button active={this.state.anyDaySelected} color={'dark'} onClick={this.toggleAllDays}>Any day</Button>
          {Object.keys(DAYS_ENUM).map((day,i)=>{
            return (
                  // <Col key={i}>
                    <>
                    {/* <Label >{day}</Label> */}
                    <Button active={this.state.daysSelected[day]} color={'dark'} onClick={() => this.toggleSelectedDay(day)}>{day}</Button>
                    </>
                    //  {/* <Input type="checkbox" onChange={(e)=>{
                    //         // let arr = this.state.daysSelected
                    //         // arr.push(days[day])
                    //         console.log(e.target.value, 'BEFORE') 
                    //         if (!this.state.daysSelected.includes(day)) {
                    //           this.setState({daysSelected:[...this.state.daysSelected, days[day]]})
                    //         }
                    //         else {
                    //           let newArr = this.state.daysSelected
                    //           let index = newArr.indexOf(days[day])
                    //           newArr.splice(index,1)
                    //           this.setState({daysSelected:newArr})
                    //         }
                    //       }}  
                            // name={day} bsSize="lg"  /> */}
                  //  </Col>
                  )
          })}
          </ButtonGroup>
        </Row>
      </Collapse>
    )
  }

  renderTrainingPlanSchedule = () => {
    return(
      <Collapse className='training-plan-schedule' isOpen={this.state.planningStage >= 2 }>
        
        {/* TODO: Below are hidden for beta testing but still need to be finished for launch */}
        {/* <Row>
          <Label for="examplePassword">What time?</Label>
          <Input
            type="time"
            name="time"
            // id="examplePassword"
            placeholder="time"
          />
        </Row>

        <Row>
          <Label for="exampleSelect">When do you want to start?</Label>
          <Input type="date" name="date" id="exampleSelect" />
        </Row> */}
        {this.renderCalendar()}

        <Button className='m-4' color={'dark'}> Set Training Plan</Button>
      </Collapse>
    )
  }

 

  planWall = () => {
    let plans = []
    this.props.plans.map((plan,i)=>{
      plans.push(
        <Card key={i} className={i === this.state.activeIndex? 'active': null}>
        { plan.image? <CardImg top width="100%" src="" alt="Card image cap" /> : null}
        <CardBody onClick={()=> {

          if(i === this.state.activeIndex){
            this.setState({activeIndex: -1, planningStage: 0})
          }
          else{
            this.setState({activeIndex: i, planningStage: 1})
          } }} >
          <CardTitle>{plan.planName}</CardTitle>
          <CardSubtitle>{plan.category}</CardSubtitle>
          <CardText>8 Week Plan</CardText>
          {/* <Button>Button</Button> */}
        </CardBody>
      </Card>
      )
    })

    return (
      <>
        <Label size='lg' >
          Select a training plan.
        </Label>
        <CardColumns className='plan-wall bg-black p-3'>
          {plans}
        </CardColumns>
      </>
    )

  }

  render() {
    // console.log(this.props,this.state)
    return (
      <Col md="10"
        style={{minHeight: this.props.windowWidth > FULL_LAYOUT_WIDTH ? '100vh' : null,
        padding: '10px',
        marginLeft: this.props.windowWidth > FULL_LAYOUT_WIDTH ? this.props.sidebarWidth : 0}}
      >
        <Jumbotron>

          {this.props.profile ? this.planWall() : null}
          {this.renderAvailableDays()}
          {this.renderTrainingPlanSchedule()}
        </Jumbotron>
      </Col>
    )
  }
}

/**
 * Quick validator to not render and invalid training plans. If you don't have this then the application will crash, unless you put
 * a bunch of conditionals around the code to check for appropriate existence of fields like workoutData.
 */
const validateTrainingPlan = (trainingPlan) => {
    if(!trainingPlan || !trainingPlan['workoutData'] || trainingPlan['workoutData'].length === 0 || !trainingPlan['name'] || !trainingPlan['category'])
      return false
    return true
}

/**
 * Validate all training plans.
 */
const onlyValidTrainingPlans = (trainingPlans) => {
  let validTrainingPlans = []
  for (let plan of trainingPlans ){
    if(validateTrainingPlan(plan))
      validTrainingPlans.push(plan)
  }

  return validTrainingPlans
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    plans: onlyValidTrainingPlans(state.plans.planTemps),
    profile: state.auth.userProfile,
    sidebarWidth: state.layout.sideBarWidth
  }
}

export default windowSize(
   connect(
  mapStateToProps,
  actions
)(TrainingDash))
