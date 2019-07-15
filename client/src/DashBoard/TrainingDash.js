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
const days = {'Monday':1, 'Tuesday':2, 'Wednesday':3, 'Thursday':4, 'Friday':5, 'Saturday':6, 'Sunday':0}

class TrainingDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      collapse: false,
      daysSelected: [],
      initPlanDays: [],
      result:[]
    }
  }

  componentDidMount() {
    this.props.fetchPlanTemps()
  }

  componentDidUpdate(prevProps, prevState) {
    
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
  }

  toggle = (index) => {
    this.setState(prevState => ({
      collapse: !prevState.collapse,
      index:index
    }))
  }

  renderCalendar = () => {

    
    // let oldState = this.state.daysSelected
    // console.log(oldState)
   
    
    

    // console.log(result.map(m => m.start.format('LLLL')))
    // console.log(result)
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


  renderPlanInit = () => {

    return(
      <Collapse isOpen={this.state.collapse}>
        <Form >
            <Row className='justify-content-center'>
            <Label size='lg' >
              What days can you workout?
            </Label>
            <ButtonGroup size={'lg'} className='m-3'
              vertical={this.props.windowWidth > FULL_LAYOUT_WIDTH ? false:true}>
              {Object.keys(days).map((day,i)=>{
                return (
                      // <Col key={i}>
                        <>
                        {/* <Label >{day}</Label> */}
                        <Button color={'dark'}>{day}</Button>
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
        </Form>
      </Collapse>
    )
  }

 

  planWall = () => {
    let plans = []
    this.props.plans.map((plan,i)=>{
      plans.push(
        <Card key={i} className={i === this.state.index? 'active':null}>
        { plan.image? <CardImg top width="100%" src="" alt="Card image cap" /> : null}
        <CardBody onClick={()=> this.toggle(i)}>
          <CardTitle>{plan.planName}</CardTitle>
          <CardSubtitle>{plan.category}</CardSubtitle>
          <CardText>8 Week Plan</CardText>
          {/* <Button>Button</Button> */}
        </CardBody>
      </Card>
      )
    })

    return (
      <CardColumns className='plan-wall bg-black p-3'>
        {plans}
      </CardColumns>
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
          {this.renderPlanInit()}
        </Jumbotron>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    plans: state.plans.planTemps,
    profile: state.auth.userProfile,
    sidebarWidth: state.layout.sideBarWidth
  }
}

export default windowSize(
   connect(
  mapStateToProps,
  actions
)(TrainingDash))
