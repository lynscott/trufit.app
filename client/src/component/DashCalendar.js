import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment)
const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]

class DashCalendar extends Component {

  getMonday = () => {
    let d = new Date()
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1), // adjust when day is sunday
        newDate = new Date(d.setDate(diff))
    return newDate
  }


  formatDate = () => {
    // let weekStart = this.getMonday
    let planEvents = []
    for (let i = 0; i < this.props.plan.template.weeks.length; i++) {
      
      for (let j = 0; j < weekArray.length; j++) {
        console.log('array started')
        let weekStart = this.getMonday()
        let event = {
          title: this.props.plan.template.weeks[i].day[weekArray[j]].type,
          start: weekStart.setDate(weekStart.getDate() + j ),
          end: weekStart.setDate(weekStart.getDate() + 0),
          allDay: false,
        }
        console.log(weekStart.getDate(), j)
        planEvents.push(event)
        weekStart = this.getMonday()
        console.log(weekStart)
        
      }
      
    }
    console.log(planEvents)
    return planEvents
  }

  render() {

    return (
      <div>
        <BigCalendar
          localizer={localizer}
          events={this.props.plan ? this.formatDate(): []}
          startAccessor="start"
          endAccessor="end"
          // date={new Date()}
        />
        {/* {this.getMonday()} */}
       </div>
    )
  }
}

export default DashCalendar
