import React, { Component } from 'react'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = BigCalendar.momentLocalizer(moment)

class DashCalendar extends Component {
  render() {
    return (
    //   <div>
        <BigCalendar
          localizer={localizer}
          events={[{
            title: 'First Workout',
            start: new Date('2/3/2019'),
            end: new Date('2/3/2019'),
            allDay: false,
            resource: '',
          }
          ]}
          date= {new Date()}
          startAccessor= 'start' //{new Date()}
          endAccessor= 'end' //{new Date('4/6/2019')}
        />
    //   </div>
    )
  }
}

export default DashCalendar
