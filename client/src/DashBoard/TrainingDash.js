import React, { Component } from 'react'
// import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
// import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
//import 'react-big-calendar/lib/css/react-big-calendar.css'
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
const DAYS_ENUM = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const SELECTED_DAYS_INIT = {'Monday': false, 'Tuesday': false, 'Wednesday': false, 'Thursday': false, 'Friday': false, 'Saturday': false, 'Sunday': false}

// HACK: HARD CODED VALUES JUST FOR BETA LAUNCH!
const MAX_DATE = new Date(2019, 8, 15)
const MIN_DATE = new Date(2019, 6, 22)

class TrainingDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: -1, // Allows us to index the plan from the store and get its information. Negative because no plan selected.
      planningStage: 0, // There are currently 3 stages to create a training plan. Selecting the plan, selecting available days, submitting the plan.
      daysSelected: SELECTED_DAYS_INIT,
      numDaysSelected: 0,
      lastDaySelected: null,
      anyDaySelected: false,
      initPlanDays: [],
      result:[],
      SUPER_HACK_CALENDAR_RERENDER_STATE: false,
      trainingDates: {},
      changePlan:false
    }

    // Reference to calendar for dumb hacks.
    this.calendar = null
  }

  _SUPER_HACK_RE_RENDER_CALENDAR = () => {
    this.setState({SUPER_HACK_CALENDAR_RERENDER_STATE: true}, () => {
      this.setState({SUPER_HACK_CALENDAR_RERENDER_STATE: false})
    })

  }

  componentDidMount() {
    //this.props.fetchPlanTemps()
    this.props.fetchActiveTrainingPlan()
  }

  componentDidUpdate(prevProps, prevState) {
    // Super hack to re-render the calendar to update its training days appropriately.
    if(this.state.numDaysSelected !== prevState.numDaysSelected){
      this._SUPER_HACK_RE_RENDER_CALENDAR()
    }

    // State restoration from user profile
    // if(prevProps.activePlan !== this.props.activePlan && this.state.changePlan === false){
    //   // TODO: Change the backend to not return an array.
    //   let activeIndex = this.getActiveIndexFromObjectId(this.props.activePlan.template)
    //   let daysSelected = this.props.activePlan.days[0]
    //   let numDaysSelected = this.getNumberOfDaysSelected(daysSelected)
    //   let lastDaySelected = (() => {for(let i = 0; i < 7; i++) if(daysSelected[DAYS_ENUM[i]]) return DAYS_ENUM[i]})() // lol. HACK
    //   let planningStage = 3

    //   this.setState({daysSelected, numDaysSelected, planningStage, activeIndex, lastDaySelected})
    // }

    if (this.state.daysSelected !== prevState.daysSelected) {
      console.log('called')
      this.mapDatesToWorkoutsToDay()
    }

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
    }
    */
  }

  /**
   * Given a mongoose objectId, get the activeIndex
   */
  getActiveIndexFromObjectId = (objectId) => {
    for(let i = 0; i < this.props.plans.length; i++){
      let plan = this.props.plans[i]

      if(plan._id === objectId){
        return i
      } 
    }

    return -1
  }


  mapDatesToWorkoutsToDay = () =>{

    Object.keys(this.state.daysSelected).map(async (dayKey)=>{
      if (this.state.daysSelected[dayKey]) {
        let start = moment(MIN_DATE.toDateString()).day(dayKey), // July. 15th
        end   = moment(MAX_DATE.toDateString()), // Sept. 15th
        day   = start.day()                  // Should always be the same

        console.log(start.toDate(), 'START')
        let current = start.clone()

        let dayToTrainingMap = this.getDaysToTrainingMap()

        //mapper function for grabbing the correct workout
        let mapper = (phase, current) => this.props.plans[this.state.activeIndex]['workoutData'][0][phase][dayToTrainingMap[DAYS_ENUM[current.day()]]]
        
        //Map through days of plan
        // console.log(current.toDate(), 'DATE')
        let i = 0
        while (current.add(7, 'd').isBefore(end)) {
          let phase = ''

          // edge case for the first day occurrence
          if (i === 0) current = start

          //Set the phase to grab workouts from based on date
          if ((current.month() <= 7 && current.date() < 19) || current.month() ===6) {
            phase = 'p1'
          } else if (current.date()=== 5 && current.month() === 7) {
            phase = 'p2'
          } else {
            phase = 'p3'
          }

          console.log( current.toDate(), 'MAIN FUNC', start.toDate())

          
          
          i ++
          //update the state of plans to map
          await this.setState({trainingDates:{...this.state.trainingDates, [current.toDate()]:mapper(phase, current)}})

          // current = current.add(7)
          
        }
      }
    })
  }

  /**
   * Get a value of the number of days selected within the object.
   */
  getNumberOfDaysSelected = (daysSelected) => {
    let count = 0
    for(let key of Object.keys(daysSelected)){
      if(daysSelected[key])
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
    if(numDaysSelected <= 5 && numDaysSelected >= 3)
      // this.props.plans[this.state.activeIndex]['workoutData'].length <= numDaysSelected)
      nextStage = 3
    else
      nextStage = 2

    this.setState({daysSelected, numDaysSelected, planningStage: nextStage, anyDaySelected: false, lastDaySelected: day}, () => {
      // console.log(this.calendar)
    })
  }

  /**
   * Toggle all days.
   * DEPRECATED
   */
  toggleAllDays = () => {
    let daysSelected = {...this.state.daysSelected}
    let planningStage = 2 // this.state.anyDaySelected ? 1 : 2 // Go to previous stage or next stage.
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
   * Check to see whether or not a certain date should be disabled.
   * This is based off the selection of available workout days.
   */
  isDateDisabled = ({activeStartDate, date, view }) => {
    // Sanity check
    // Apparently date might not be instantiated yet?
    if(date === undefined) return true

    /*
    if(this.state.daysSelected[DAYS_ENUM[date.getDay()]] === false){
      console.log('isDateDisabled', date, this.state.daysSelected)
    }s
    else{
      console.log('isDateNotDisabled', date, this.state.daysSelected)
    }*/

    return !this.state.daysSelected[DAYS_ENUM[date.getDay()]]
  }

  /**
   * Helper to only get the active selected days.
   * It generates a mapping from days to workouts
   */
  getDaysToTrainingMap = () => {
    let days = {}
    let count = 0
    for(let day of Object.keys(this.state.daysSelected)){
      if(this.state.daysSelected[day]){
        days[day] = count
        count++
      }
    }
    return days
  }

  /**
   * Populate the calendar with training day and rest days
   * Great movie btw, highly recommend: https://www.imdb.com/title/tt0139654/
   */
  renderCalendarTile = ({date, view}) => {
    // Sanity check
    if(!this.props.plans || this.state.activeIndex < 0 || this.state.numDaysSelected > 5 ) return null

    if(!this.isDateDisabled({date}) && date.getTime() >= MIN_DATE.getTime() && date.getTime() <= MAX_DATE.getTime()){

      // Calculate title of date.
      // WARNING: Subject to change in the future, not efficient.
      let dayToTrainingMap = this.getDaysToTrainingMap()
      let phase = ''
      
      // console.log(date)

      //HACK: Strictly for beta test range and Clean up function into a selector
      if ((date.getMonth() <= 7 && date.getDate() < 19) || date.getMonth() ===6) {
        phase = 'p1'
        let mapper = this.props.plans[this.state.activeIndex]['workoutData'][0][phase][dayToTrainingMap[DAYS_ENUM[date.getDay()]]]
        // this.setState({trainingDates:{...this.state.trainingDates, [date]:mapper}})
        // console.log('p1 map', mapper)
      } else if (date.getDate()=== 5 && date.getMonth() === 7) {
        phase = 'p2'
        let mapper = this.props.plans[this.state.activeIndex]['workoutData'][0][phase][dayToTrainingMap[DAYS_ENUM[date.getDay()]]]
        // this.setState({trainingDates:{...this.state.trainingDates, [date]:mapper}})
        // console.log('p2 map', mapper)
      } else {
        phase = 'p3'
        let mapper = this.props.plans[this.state.activeIndex]['workoutData'][0][phase][dayToTrainingMap[DAYS_ENUM[date.getDay()]]]
        // this.setState({trainingDates:{...this.state.trainingDates, [date]:mapper}})
        // console.log('p3 map', mapper)
      }

      return <p>{this.props.plans[this.state.activeIndex]['workoutData'][0][phase][dayToTrainingMap[DAYS_ENUM[date.getDay()]]].title}</p>
    }
    else if(date.getTime() >= MIN_DATE.getTime() && date.getTime() <= MAX_DATE.getTime()){
      return <p>Rest Day</p>
    }
    return null 
  }

  renderCalendar = () => {
    return (
      <Col md={12}>
        <Calendar
          // onChange={this.onChange}
          ref={node => this.calendar = node}
          maxDate={MAX_DATE}
          minDate={MIN_DATE}
          style={{width:'100%'}}
          minDetail={'month'}
          tileDisabled={this.isDateDisabled}
          tileContent={this.renderCalendarTile}
        />
      </Col>
    )
  }

  /**
   * Render all the workouts for the selected training plan.
   */
  renderWorkouts = () => {
    // Sanity check
    if(!this.props || !(this.state.activeIndex >= 0)) return null

    // type, title, exercises (name, sets, reps, note, category)
    let workoutData = this.props.plans[this.state.activeIndex]['workoutData'][0] //Hack fix data
    let phases = []

    // console.log(workoutData)
    Object.keys(workoutData).reverse().map((phase,i)=>{
      let workouts = []
      let week1 =0
      let week2= 0
      //HACKY: better way to do this
      if (i===0) {
        week1 = 1
        week2 = 2
      } else if (i===1) {
        week1 = 3
        week2 = 4
      } else if (i===2) {
        week1 = 5
        week2 = 6
      } else if (i===3) {
        week1 = 7
        week2 = 8
      }

      workoutData[phase].map((workout,k)=>{
        let exercises = []

        workout.exercises.map((exercise, j)=>{
          if (exercise) //HACK: Accidentally made null exercises in form
            exercises.push(
                    <CardText key={j} style={{borderTopColor: 'black', fontSize: '12pt'}}> 
                      {exercise.name}: {exercise.sets}x{exercise.reps}<br/>
                      {/* exercise.note */}
                    </CardText>
                  )
          })

          workouts.push(
          <Card style={{maxWidth: '300px', margin: '10px', height: '100%'}}>
            <CardBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              <CardTitle><h5>{workout.title}</h5></CardTitle>
              {exercises}
            </CardBody>
          </Card>)

      })

      phases.push(
        <>
          <Label size='lg'><strong>Weeks {week1} and {week2}</strong> </Label>
          {workouts}
        </>
      )
      
    })


    // for(let workout of workoutData){
    //   let exercises = []

    //   for(let exercise of workout.exercises){
    //     
    //   }

    //   workouts.push(
    //     <Card style={{maxWidth: '300px', margin: '10px', height: '100%'}}>
    //       <CardBody style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
    //         <CardTitle><h5>{workout.title}</h5></CardTitle>
    //         {exercises}
    //     </CardBody>
    //   </Card>)
    // }
    

    return phases
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
    let numWorkouts = trainingPlan['workoutData'][0].length
    
    return <span>{`${name} is a training plan that requires `} <b> {'3-5 days'} </b> per week.</span>
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
    
    return <>
    <span>{`${name} is a training plan that requires `} <b> {'3-5 days'} </b> per week.</span><br/>
      <span>{'Select 3-5 days to workout on.'}</span>
    </>
  }

  renderAvailableDays = () => {
    // Sanity check
    if(this.state.activeIndex < 0 || !this.props.plans) return

    let daySplitMessage = this.buildTrainingSplitMessage(this.state.activeIndex)

    return (
        <>
        <Label size='lg' >
          This training plan is comprised of these phases:
        </Label>
        <Row className='justify-content-center' style={{maxHeight:'40vh', overflowY:'scroll'}}>
        {this.renderWorkouts()}
        </Row>
        <Row className='justify-content-center'>
        <Label size='lg' >
          {daySplitMessage}
        </Label>
        <ButtonGroup size={'lg'} className='m-3'
          vertical={!(this.props.windowWidth > FULL_LAYOUT_WIDTH)}>

          {/* NOT IN USE <Button active={this.state.anyDaySelected} color={'dark'} onClick={this.toggleAllDays}>Any day</Button> */}
          {Object.keys(SELECTED_DAYS_INIT).map((day,i)=>{
            return <Button 
              active={this.state.daysSelected[day]} 
              color={'dark'} 
              onClick={async () => {
                if(this.state.numDaysSelected >= 5
                  // this.props.plans[this.state.activeIndex]['workoutData'].length
                  ){
                    // console.log('UNSELECT')
                  await this.toggleSelectedDay(this.state.lastDaySelected)
                  this.toggleSelectedDay(day)
                }
                else{
                  this.toggleSelectedDay(day)
                }
              }}>{day}
            </Button>
            })}
          </ButtonGroup>
        </Row>
        </>
    )
  }

  renderTrainingPlanSchedule = () => {
    return(
      <>
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
        <Label size='lg' >
          This will be your training plan schedule.
        </Label>
        {this.state.SUPER_HACK_CALENDAR_RERENDER_STATE ? null : this.renderCalendar()}

        <Button 
          disabled={this.state.planningStage < 3} 
          color='dark' 
          style={{marginTop: '10px'}}
          onClick={() => {
            // console.log({end_date: MAX_DATE, start_date: MIN_DATE, days: this.state.daysSelected, template: this.props.plans[this.state.activeIndex]._id, mapper:this.state.trainingDates})
            this.props.initTrainingPlan({end_date: MAX_DATE, start_date: MIN_DATE, days: this.state.trainingDates, template: this.props.plans[this.state.activeIndex]._id })
          }}>
            Set Training Plan
        </Button>
        </>
    )
  }

 

  planWall = () => {
    let plans = []
    this.props.plans.map((plan,i)=>{
      plans.push(
        <Card key={i} className={i === this.state.activeIndex? 'active': null}>
        { plan.image? <CardImg top width="100%" src="" alt="Card image cap" /> : null}
        <CardBody onClick={()=> {

          // Reset
          if(i === this.state.activeIndex){
            this.setState({activeIndex: -1, planningStage: 0, daysSelected: SELECTED_DAYS_INIT, anyDaySelected: false, numDaysSelected: 0})
          }
          else{
            this.setState({activeIndex: i, planningStage: 1})
          } }} >
          <CardTitle>{plan.name}</CardTitle>
          <CardSubtitle className='muted'>Category: {plan.category}</CardSubtitle>
          <CardText>Description: 8 Week Plan
            {/* {plan.description} */}
          </CardText>
          {/* <Button>Button</Button> */}
        </CardBody>
      </Card>
      )
    })

    return (
      <>
        <Label size='lg' >
          <strong>Training Manager</strong>
        </Label>
        <Collapse isOpen={this.state.activePlan !==null}>
          <Button className='mb-2' onClick={()=>this.setState({changePlan:true, daysSelected:SELECTED_DAYS_INIT})} color='info'>Change Training Plan</Button>
        </Collapse>
        <CardColumns className='plan-wall bg-black p-3'>
          {plans}
        </CardColumns>
      </>
    )

  }

  render() {
    console.log(this.state.trainingDates, this.state.daysSelected)
    return (
      <Col md="10"
        style={{minHeight: this.props.windowWidth > FULL_LAYOUT_WIDTH ? '100vh' : null,
        padding: '10px',
        marginLeft: this.props.windowWidth > FULL_LAYOUT_WIDTH ? this.props.sidebarWidth : 0}}
      >
        <Jumbotron> 
          {this.props.profile ? this.planWall() : null}
          <Collapse isOpen={this.state.planningStage >= 1}>
            {this.renderAvailableDays()}
          </Collapse>
          <Collapse className='training-plan-schedule' isOpen={this.state.planningStage >= 2}>
            {this.renderTrainingPlanSchedule()}
          </Collapse>
        </Jumbotron>
        {/* <Jumbotron>
          <h4>Training Plan selection will be available starting Wednesday. <br/><br/>
          We want to offer you a variety of quality options to test and try out!</h4>
        </Jumbotron> */}
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
    activePlan: state.activePlan,
    profile: state.auth.userProfile,
    sidebarWidth: state.layout.sideBarWidth
  }
}

export default windowSize(
   connect(
  mapStateToProps,
  actions
)(TrainingDash))
