import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Card, Button, CardTitle, CardText, Row, Col } from 'reactstrap'

const localizer = BigCalendar.momentLocalizer(moment)
const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]

class DashCalendar extends Component {
  constructor(props){
    super(props)

    this.state = {
      nextWorkout: null
    }
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


  nextWorkoutCard = () => {
    return (
      <Card body className="text-center">
        <CardTitle>Upcoming Session: {this.state.nextWorkout.title}</CardTitle>
        <CardText>{new Date(this.state.nextWorkout.start).toDateString()}</CardText>
        <Button color='danger' className='my-3'>Mark Completed</Button>
        <Button color='warning'>Skip</Button>
      </Card>
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
    // console.log()
    return (
      // <Row className='justify-content-around'>
      <React.Fragment>
        <Col md='4'>
          <BigCalendar
            localizer={localizer}
            events={this.props.plan ? this.formatDate(): []}
            startAccessor="start"
            endAccessor="end"
            // components={{
            //   event: this.eventCard,
            // }}
            // date={new Date()}
          />
        </Col>
        <Col md='4' className='align-self-center'>
        <Button color='info'>Edit Workout Schedule</Button>
          {this.state.nextWorkout? this.nextWorkoutCard() : null}
        </Col>
        </React.Fragment>

      // </Row>
    )
  }
}

export default DashCalendar
