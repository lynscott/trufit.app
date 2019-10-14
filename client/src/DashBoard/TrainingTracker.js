import React, { Component } from 'react'
import moment from 'moment'

import * as actions from '../actions'
import { connect } from 'react-redux'
import Timer from 'react-compound-timer'

import { Row, Button, Collapse, CardText, Badge, Col, Input, ListGroupItem, ListGroupItemText, ButtonGroup, Label,
  InputGroup, InputGroupAddon, InputGroupText, ListGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]

/**
 * startTimer = () => {
  this.setState({
    timerOn: true,
    timerTime: this.state.timerTime,
    timerStart: Date.now() - this.state.timerTime
  });
  this.timer = setInterval(() => {
    this.setState({
      timerTime: Date.now() - this.state.timerStart
    });
  }, 10);
};

state = {
  timerOn: false,
  timerStart: 0,
  timerTime: 0
};

 */


class TrainingTracker extends Component {
  constructor(props){
    super(props)

    this.state = {
      nextWorkout: null,
      trackerData: {},
      trackerOpen: false,
      tracker: null,
      workoutStarted: false,
      workoutEnded: false,
      workoutTime: 0,
      workoutName: null,
      activeDay: null,
      timerOn: false,
      timerStart: 0,
      timerTime: 0
    }
  }

  componentDidMount() {
    //this.props.fetchPlanTemps()
    this.props.fetchActiveTrainingPlan()
  }

  startWorkout = () => {
    this.setState({trackerOpen:!this.state.trackerOpen})
  }


  getWorkoutDayOrUndefined = () => {
    return Object.keys(this.props.activePlan.days[0]).find(date => new Date(date).toDateString() === new Date().toDateString())
  }

  startTimer = async (workoutName) => {
    await this.setState({
      timerOn: true,
      workoutStarted: true,
      workoutName: workoutName,
      timerTime: this.state.timerTime,
      timerStart: Date.now() - this.state.timerTime//moment().subtract( 'seconds', this.state.timerTime.getSecon)
    })

    this.timer = setInterval(() => {
      this.setState({
        timerTime: Date.now() - this.state.timerStart//moment().subtract('seconds', this.state.timerStart.seconds()).format('HH:mm')
      })
    }, 10)
  }

  setNextWorkout = () =>{ //TODO: Refactor to include modal 
    let eMap = []
    let day = Object.keys(this.props.activePlan.days[0]).find(date => new Date(date).toDateString() === new Date().toDateString())

    let updateData = (workout, value, type, set) => { //Assumes you won't do the same exercise twice in a workout
      let name = workout.split(' ').join('_')
      let trackerData = this.state.trackerData
      if (!trackerData[name]) trackerData[name] = {}
      if (!trackerData[name][set]) trackerData[name][set] = {}
      trackerData[name][set][type] = value
      this.setState({trackerData})
    }

    if (!day) return <h5>Rest Up!</h5>
    else {
      this.props.activePlan.days[0][day].exercises.map((e,k)=>{
        if (e) {
          eMap.push(
            <>
              
                <ListGroupItem style={{borderRadius:'10px'}} className='bg-dark text-white m-2'>

                  <h6><strong>{e.name}</strong>{ ': ' + e.sets + ' x ' + e.reps}</h6>
                  { e.note?  <p className='mb-0'>Exercise note: {e.note}</p> : null }

                  <Button color={this.state.tracker === k ? 'warning' : 'light'} size='sm' className='mb-2'
                    onClick={()=>this.setState({tracker: this.state.tracker === k?null:k})}>Track Stats</Button>

                  <Collapse isOpen={this.state.tracker===k}>
                    {[...Array(parseInt(e.sets)).keys()].map(i=>{
                      return(  
                        <>
                          <Label className='m-0'><strong>Set #{i+1}</strong></Label>
                          <InputGroup className='my-2'>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>Weight Used(lb)</InputGroupText>
                            </InputGroupAddon>
                            <Input onChange={(event)=> updateData(e.name, event.target.value, 'weight',i+1)} placeholder='(optional)'/>
                          </InputGroup>
                          <InputGroup className='mb-3'>
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>Reps Achieved </InputGroupText>
                            </InputGroupAddon>
                            <Input onChange={(event)=> updateData(e.name, event.target.value, 'reps', i+1)} placeholder='(optional)'/> 
                          </InputGroup>
                        </>)
                    })}
                  </Collapse> 
                  
                </ListGroupItem>
                
            </>
          )
        }
      })
    }

    return(
      <ListGroup style={{maxHeight:'50vh', overflowY:'scroll'}}>
          {eMap}
      </ListGroup>
    )
  }

  renderWorkoutStart = () => {
    let day = Object.keys(this.props.activePlan.days[0]).find(date => new Date(date).toDateString() === new Date().toDateString())
    return (
      <Row>
        <Collapse isOpen={this.state.workoutStarted} tag="h5" className="mt-2 col-md">
            <ListGroupItemText>
              <Label>Timer</Label>
              <h4><Badge color="info" id='timer' pill>
                {/* <Timer id='timer'>  <Timer.Hours /> hr : <Timer.Minutes /> min : <Timer.Seconds /> sec </Timer> */}
                {moment(this.state.timerTime).format('HH:mm')}
              </Badge></h4>
            </ListGroupItemText>
          </Collapse>

          <ButtonGroup  className='justify-content-center col-md'>
            <Button onClick={()=>{
              this.startTimer(this.props.activePlan.days[0][day].title)
              // this.setState({  workoutName:this.props.activePlan.days[0][day].title})
              }} color='success'>Start Workout</Button>
            <Button disabled={!this.state.timerOn} onClick={()=>this.sendTrackerData()} color='danger'>End Workout</Button>
          </ButtonGroup>
      </Row>
    )
  }


  sendTrackerData = async () => {
    let totalTime = document.getElementById('timer').innerText //HACK:
    let workoutData = {
      workoutName: this.state.workoutName,
      date: new Date(),
      totalTime,
      trackerData: this.state.trackerData
    }

    // console.log(workoutData)
    await this.props.sendWorkoutTrackerData(workoutData)
    alert('Workout completed!')
    this.setState({trackerOpen:false})
  }


  /**
   *
   *
   * @memberof TrainingTracker
   */
  renderTracker = () => {
    return (
          <Modal isOpen={this.state.trackerOpen} toggle={this.startWorkout}>
            {/* <ModalHeader toggle={this.startWorkout}>{<h3>{this.props.activePlan.days[0][this.getWorkoutDayOrUndefined()].title }</h3>}</ModalHeader> */}
            <ModalBody>
              {/* {For loop here of current workout sets/reps/ note and optional place to fill in weights/reps achieved } */}
              {this.props.activePlan ? this.setNextWorkout() : null}
            </ModalBody>
            <ModalFooter style={{padding:'0.5rem'}}>
              {this.getWorkoutDayOrUndefined() ? this.renderWorkoutStart() : null}
              {/* <Button color="secondary" onClick={()=>this.setState({trackerOpen:false})}>Cancel</Button> */}
            </ModalFooter>
          </Modal>  
    )
  }


  render() {
    console.log(this.state)
    return (
      <React.Fragment>
        {this.renderTracker()}
        <Button onClick={()=>this.setState({trackerOpen:true})}>View Workout</Button>
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
