import React, { Component } from 'react'
// import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
// import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import './TrainingDash.scss'
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
  Jumbotron, Card, CardImg, CardTitle, CardText, CardColumns,
  CardSubtitle, CardBody
} from 'reactstrap'

const localizer = BigCalendar.momentLocalizer(moment)
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

class TrainingDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeIndex: 0,
      collapse: false,
      daysSelected: []
    }
  }

  toggle = (index) => {
    this.setState(prevState => ({
      collapse: !prevState.collapse,
      index:index
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


  renderPlanInit = () => {

    return(
      <Collapse isOpen={this.state.collapse}>
        <Form >
            <Row>
            <Label >
              What days can you workout?
            </Label>
              {days.map((day,i)=>{
                return (
                      <Col key={i}>
                        <Label size="lg" >{day}</Label>
                        <Input type="checkbox" onChange={(e)=>{
                                this.state.daysSelected.push(day) }}  
                                name={day} bsSize="lg"  />
                      </Col>
                      )
              })}
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

          <Button className='m-4' type={'submit'}>Set Training Plan</Button>
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
          <CardText>Description</CardText>
          {/* <Button>Button</Button> */}
        </CardBody>
      </Card>
      )
    })

    return (
      <CardColumns className='plan-wall bg-dark p-3'>
        {plans}
      </CardColumns>
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
    profile: state.auth.userProfile
  }
}

export default connect(
  mapStateToProps,
  actions
)(TrainingDash)
