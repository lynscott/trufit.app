import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signUpUser, fetchExercises, createNewWorkout, fetchWorkouts } from '../actions'
import Alert from 'react-s-alert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Input, Button, Row, Col, Container, Jumbotron,
  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import CreatePlanForm from './CreatePlanForm'
import CreateWorkoutForm from './CreateWorkoutForm'


class AdminPage extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
        //   tooltipOpen: false
          planModal:false,
          workoutModal: false
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

      renderPanel = () => {
          return(
            <Col md='10'>
                <Jumbotron>
                  <h1 className="display-5">Welcome back King.</h1>
                  <Button color="primary" size="lg" onClick={this.togglePlanModal}>Make a new training plan</Button>
                  <br/>
                  <br/>
                  <Button color="info" size="lg" onClick={this.toggleWorkoutModal}>Make a new workout</Button>
                    {/* List of current plans and user stats */}
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
          return this.renderPanel()
      }
}

const mapStateToProps = state => {
  return {
    workouts: state.admin.workouts
  }
}

export default connect(mapStateToProps,{fetchWorkouts})(AdminPage)
