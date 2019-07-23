import React, { Component } from 'react'
import moment from 'moment'

import * as actions from '../actions'
import { connect } from 'react-redux'
import { formatMealTime} from './NutritionDash'

import { Card, Button, CardTitle, CardText, Row, Col,
   Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]

class TrainingTracker extends Component {
  constructor(props){
    super(props)

    this.state = {
      nextWorkout: null
    }
  }

  componentDidMount() {
    //this.props.fetchPlanTemps()
    this.props.fetchActiveTrainingPlan()
  }

  getMonday = () => {
    let d = new Date()
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1), // adjust when day is sunday
        newDate = new Date(d.setDate(diff))
    return newDate
  }


  eventCard = ({ event })  => {
    return (
      <span className='text-center event-card-div' style={{textAlign:'center', backgroundColor:'green'}}>
        <strong>{event.title}</strong>
        {/* {event.desc && ':  ' + event.desc} */}
      </span>
    )
  }

  clock = () => {
      let list = []
      let dates = Object.keys(this.props.activePlan.days[0])
      

      let gooday = dates.map(date=>{
        let today = moment()
        // console.log(moment(date), 'DATE')
        if (moment(date).isBetween(today, today.add(7, 'days'))) {
          return date
        }
      })
      console.log(gooday)
      return gooday
      // Map the difference between now and meal time for every meal
      // dates.map((date, i)=>{
      //   list.push( Math.abs(formatMealTime(date, false) - new Date()) )
      // })

      // // Find the index of the minimum difference, which is the next meal
      // if (formatMealTime(dates[list.indexOf(Math.min(...list))], false) > new Date()) {
      //   let index = list.indexOf(Math.min(...list))
      //   return formatMealTime(dates[index], false)
        
      // } else {
      //   let index = list.length -1//list.indexOf(Math.min(...list)) 
      //   return formatMealTime(dates[index], false)
      // }
      
    
  }


  nextWorkout = () => {
    return (
          <Modal isOpen={this.state.startWorkout} toggle={this.startWorkoutTrigger}>
            <ModalBody>

            </ModalBody>
            <ModalFooter style={{padding:'0.5rem'}}>
              <Button color="dark" onClick={this.signup}>End Workout</Button>
            </ModalFooter>
          </Modal>  
    )
  }


  formatDate = () => {
    // let weekStart = this.getMonday
    let planEvents = []
    for (let i = 0; i < this.props.plan.template.weeks.length; i++) {
      
      for (let j = 0; j < weekArray.length; j++) {
        // console.log('array started')
        let weekStart = this.getMonday()
        let event = {
          title: this.props.plan.template.weeks[i].day[weekArray[j]].type,
          start: weekStart.setDate(weekStart.getDate() + j ),
          end: weekStart.setDate(weekStart.getDate() + 0),
          allDay: false,
          workout: this.props.plan.template.weeks[i].day[weekArray[j]]
        }
        // console.log(event)
        planEvents.push(event)
        weekStart = this.getMonday()
        if (new Date(event.start).getDate() === new Date().getDate()) {
          this.state.nextWorkout = event
        }
        
      }

      
    }
    // this.state.nextWorkout = planEvents[0]
    // console.log(planEvents)
    return planEvents
  }

  render() {
    console.log(this.props)
    return (
      <React.Fragment>
        {this.props.activePlan ? this.clock(): null}
      </React.Fragment>

    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    activePlan: state.activePlan,
  }
}


export default connect(
  mapStateToProps,
  actions
)(TrainingTracker)
