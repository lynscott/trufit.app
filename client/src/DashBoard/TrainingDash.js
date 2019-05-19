import React, { Component } from 'react'
// import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
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
  Media,
  Jumbotron
} from 'reactstrap'

const localizer = BigCalendar.momentLocalizer(moment)
const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]

class TrainingDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      collapse: false,
      daysSelected: []
    }
  }

  toggle = () => {
    this.setState(prevState => ({
      collapse: !prevState.collapse
    }))
  }

  renderCalendar = () => {
    return (
      <BigCalendar
        localizer={localizer}
        events={this.props.plan ? this.formatDate(): []}
        startAccessor="start"
        endAccessor="end"
        style={{display:'none'}}
        // components={{
        //   event: this.eventCard,
        // }}
        // date={new Date()}
      />
    )
  }

  renderPlans = () => {
    console.log(this.state.daysSelected)
    return (
      <>
        <Media onClick={this.toggle}>
          <Media left href="#">
            {/* <Media object data-src="https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/Resize_main.JPG" alt="Generic placeholder image" /> */}
            <img
              style={{ height: '200px', width: '200px' }}
              src="https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/Resize_main.JPG"
            />
          </Media>
          <Media body>
            <Media heading>Weight Loss</Media>
            <p>
              Keep your intensity and focus high! Be sure to warm up properly
              and keep your form strict. 60s rest break between sets. Great
              cardio can be treadmill, stairmaster, a jog/running something to
              keep your body moving at a steady pace for the alloted time.
            </p>
          </Media>
        </Media>
        <Collapse isOpen={this.state.collapse}>
          <Form style={{width:'50%', minWidth:'50%'}}>
            <FormGroup check>
              <Label >
                What days can you workout?
              </Label>
              <Row>
                <Col>
                  <Input type="checkbox" onChange={(e)=>{
                    console.log(e.target.value)
                    this.state.daysSelected.push('mon')
                    }} name="radio1" >
                    {this.state.daysSelected.includes('mon') ? <Input type="time" name="mon_time"/> : null}
                  </Input>Monday<br/> 
                  <Input type="checkbox" name="radio2" />Tuesday<br/>
                  <Input type="checkbox" name="radio2" />Wednesday<br/>
                  <Input type="checkbox" name="radio2" />Thursday<br/>
                </Col>
                <Col>
                  <Input type="checkbox" name="radio1" />Friday<br/> 
                  <Input type="checkbox" name="radio2" />Saturday<br/>
                  <Input type="checkbox" name="radio2" />Sunday<br/>
                  {/* <Input type="radio" name="radio2" />Thursday<br/> */}
                </Col> 
              </Row>
            </FormGroup>

            <FormGroup>
              <Label for="examplePassword">What time?</Label>
              <Input
                type="time"
                name="time"
                id="examplePassword"
                placeholder="password placeholder"
              />
            </FormGroup>
            <FormGroup>
              <Label for="exampleSelect">When do you want to start?</Label>
              <Input type="date" name="date" id="exampleSelect" />
            </FormGroup>
          </Form>
        </Collapse>
      </>
    )
  }

  render() {
    return (
      <Col md="10">
        <Jumbotron>
          {/* <h1 className="display-3">Hello, world!</h1>
                    <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
                    <hr className="my-2" />
                    <p>It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
          {this.props.profile ? this.renderPlans() : null}
        </Jumbotron>
      </Col>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    plans: state.plans.planTemps,
    profile: state.auth.userProfile
  }
}

export default connect(
  mapStateToProps,
  actions
)(TrainingDash)
