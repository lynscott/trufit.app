import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container, Jumbotron, ButtonGroup, Collapse,
  Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupAddon } from 'reactstrap'
import CreatePlanForm from './CreatePlanForm'
import CreateWorkoutForm from './CreateWorkoutForm'
import {FULL_LAYOUT_WIDTH, COLLAPSE_TRIGGER_WIDTH} from '../constants/Layout'
import windowSize from 'react-window-size'




class AdminPage extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
        //   tooltipOpen: false
          planModal:false,
          workoutModal: false,
          newBeta: null
        }
      }
    
      componentDidMount = () => {
        // this.props.fetchExercises()
    
        this.props.fetchWorkouts()
      }

      togglePlanModal = () => {
        this.setState(prevState => ({
          planModal: !prevState.planModal
        }))
      }

      toggleWorkoutModal = () => {
        this.setState(prevState => ({
          workoutModal: !prevState.workoutModal
        }))
      }



      renderPlanModal = () => {
        return(
            <Modal fade={true} scrollable={true} size={'lg'} isOpen={this.state.planModal} toggle={this.togglePlanModal} >
              <ModalHeader toggle={this.togglePlanModal}>New Plan</ModalHeader>
              <ModalBody>
                <CreatePlanForm/>
              </ModalBody>
            </Modal>
        )
      }

      renderWorkoutModal = () => {
        return(
          <Modal fade={true} scrollable={true} size={'lg'} isOpen={this.state.workoutModal} toggle={this.toggleWorkoutModal}>
            <ModalHeader toggle={this.toggleWorkoutModal}>New Workout</ModalHeader>
            <ModalBody>
              <CreateWorkoutForm/>
            </ModalBody>
          </Modal>
        )
      }

      submitBeta = async () =>{
        await this.props.submitBeta({email:this.props.newBeta})
        this.setState({newBeta:null})
      }

      renderBetaList = () => {
        return(
          <>
            <InputGroup style={{maxWidth:'300px', margin:'10px'}}>
              <InputGroupAddon value={this.state.newBeta} addonType="append"><Button onClick={this.submitBeta}>Submit</Button></InputGroupAddon>
              <Input onChange={(e)=>this.setState({newBeta:e.target.value})} type='text'/>
            </InputGroup>
            <Collapse>
              {this.props.betaList.map(user=>{
                return <span>{user.email}</span>
              })}
            </Collapse>
          </>
        )
      }

      renderPanel = () => {
          return(
            <Col md='10'
              style={{marginLeft: this.props.windowWidth > FULL_LAYOUT_WIDTH ? this.props.sidebarWidth : 0}}
            >
                <Jumbotron>
                  <h1 className="display-5">Welcome back King.</h1>
                  <ButtonGroup vertical={this.props.windowWidth > FULL_LAYOUT_WIDTH ? false : true}>
                  <Button color="primary" size="lg" onClick={this.togglePlanModal}>Make a new training plan</Button>
                  {/* <Button color="secondary" size="lg" >Edit Beta User Access List</Button> */}
                  <Button color="info" size="lg" onClick={this.toggleWorkoutModal}>Make a new workout</Button>
                  </ButtonGroup>
                    {/* List of current plans and user stats */}
                  
                  {/* {this.renderBetaList()} */}
                    {/* <h1 className="display-3">Hello, world!</h1>
                    <p className="lead">This is a simple hero unit, a simple Jumbotron-style component for calling extra attention to featured content or information.</p>
                    <hr className="my-2" />
                    <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
                    <p className="lead">
                    <Button color="primary">Learn More</Button>
                    </p> */}
                </Jumbotron>
                {this.renderWorkoutModal()}
                {this.renderPlanModal()}
            </Col>
          )
      }

      render() {
        console.log(this.state, this.props)
          return this.renderPanel()
      }
}

const mapStateToProps = state => {
  return {
    workouts: state.admin.workouts,
    sidebarWidth: state.layout.sideBarWidth,
    betaList: state.admin.betaList
  }
}

export default windowSize(connect(mapStateToProps,actions)(AdminPage))
