import React, { Component } from 'react'
import moment from 'moment'

import * as actions from '../actions'
import { connect } from 'react-redux'
import Timer from 'react-compound-timer'

import { Fade, Button, Collapse, CardText, Badge, Col, Input, ListGroupItem, ListGroupItemText, ButtonGroup, Label,
  InputGroup, InputGroupAddon, InputGroupText, ListGroup, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'


const weekArray = [ 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun' ]


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
      workoutName: null
    }
  }

  componentDidMount() {
    //this.props.fetchPlanTemps()
    this.props.fetchActiveTrainingPlan()
  }

  startWorkout = () => {
    this.setState({trackerOpen:!this.state.trackerOpen})
  }



  setNextWorkout = () =>{
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

                  <Button color='light' size='sm' className='mb-2'
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
      <ListGroup>
          <ListGroupItemText className='mb-0'><h3>{this.props.activePlan.days[0][day].title }</h3></ListGroupItemText>
          {eMap}

          <Collapse isOpen={this.state.workoutStarted} tag="h5" className="mt-2">
            <ListGroupItemText>
              <Label>Timer</Label>
              <h4><Badge color="info" id='timer' pill>
                <Timer id='timer'>  <Timer.Hours /> hr : <Timer.Minutes /> min : <Timer.Seconds /> sec </Timer>
              </Badge></h4>
            </ListGroupItemText>
          </Collapse>

          <ButtonGroup  className='justify-content-center'>
            <Button onClick={()=>{
              this.setState({ workoutStarted:true, workoutName:this.props.activePlan.days[0][day].title})
              }} color='success'>Start Workout</Button>
            <Button onClick={()=>this.sendTrackerData()} color='danger'>End Workout</Button>
          </ButtonGroup>
      </ListGroup>
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

    console.log(workoutData)
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
            <ModalBody>
              {/* {For loop here of current workout sets/reps/ note and optional place to fill in weights/reps achieved } */}
              {this.props.activePlan ? this.setNextWorkout() : null}
            </ModalBody>
            <ModalFooter style={{padding:'0.5rem'}}>
              <Button color="secondary" onClick={()=>this.setState({trackerOpen:false})}>Cancel</Button>
            </ModalFooter>
          </Modal>  
    )
  }


  render() {
    // console.log(this.props)
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
