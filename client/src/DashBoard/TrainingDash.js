import React, {Component} from 'react'
// import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import {Col, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label,
    Collapse, Input, Button, Media,  Jumbotron } from 'reactstrap'


class TrainingDash extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
         activeIndex: 0,
         collapse: false
      }
    }

    toggle = () => {
      this.setState(prevState => ({
        collapse: !prevState.collapse
      }))
    }

    // renderPlanForm

    renderPlans = () => {
        return(
            <>
            <Media onClick={this.toggle}>
                <Media left href="#">
                    <Media object data-src="holder.js/64x64" alt="Generic placeholder image" />
                </Media>
                <Media body>
                    <Media heading>
                    Weight Loss
                    </Media>
                    Beginning of plan #1
                </Media>
            </Media>
            <Collapse isOpen={this.state.collapse}>
            <Form>
                <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" id="exampleEmail" placeholder="with a placeholder" />
                </FormGroup>
                <FormGroup>
                <Label for="examplePassword">Password</Label>
                <Input type="password" name="password" id="examplePassword" placeholder="password placeholder" />
                </FormGroup>
                <FormGroup>
                <Label for="exampleSelect">Select</Label>
                <Input type="select" name="select" id="exampleSelect">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Input>
                </FormGroup>
            </Form>
          </Collapse>
          </>
        )
    }



    render(){
        return(
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