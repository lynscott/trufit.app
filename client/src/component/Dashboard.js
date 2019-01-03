import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import PlanList from './PlanList'

import DashCalendar from './DashCalendar'
import NutritionTable from './NutritionTable'
import { scaleRotate as Menu } from 'react-burger-menu'
import CreatePlanForm from './CreatePlanForm'
import { Button, Form, Card, CardHeader, CardFooter, CardBody, Container, Progress,
  CardTitle, CardText,FormGroup, Label, Input, ListGroup, ListGroupItem,FormText, Row, Col } from 'reactstrap'
import './Sidebar.scss'
import './DashBoard.scss'

import ViewPlan from './ViewPlan'

const Block = ({content, colSize, content2=null ,configs=null}) => {

  return (
    <div className='row p-3 justify-content-around'>
      <div className={`col-md-${colSize} ${configs}`}>
        {content}
      </div>
      <div className={`col-md-4`}>
        {/* <div>
          Preview of your current scheduled workout or
          no workouts? Set up a plan.
        </div> */}
        {content2}
      </div>
    </div>
  )
}


const JumboBlock = ({message}) => {

  let date = new Date()

  return (
    <div className="jumbotron">
      <h1 className="display-4">{date.toLocaleDateString()}</h1>
      {/* {date.toLocaleDateString()} */}
      <Row className='justify-content-center'>
       <Col md='8'>
        {message}
       </Col> 
      </Row>     
      <hr className="my-4"/>
      <p></p>
    </div>
  )
}

class Dashboard extends Component {
  constructor(props) {
    super(props)

    // this.toggle = this.toggle.bind(this)

    this.state = { 
      // eslint-disable-next-line quotes
      changeMessage: "Enter some text as a reminder why you won't quit!",
      updateMessage:'',
      update:false 
    }

  }

  affirmationChange = () => {
    if (this.state.update === false) {
      return (<p className="lead" style={{fontSize:'1.2rem'}} onClick={()=>this.setState({update:true})}>{this.state.changeMessage}</p>)
    } else {
      return  (
              <React.Fragment>
                <Form>
                  <Input 
                    type="text"
                    style={{marginBottom:'8px'}}
                    // value={this.state.updateMessage}
                    onChange={(e)=>{
                      console.log(this.state.updateMessage, 'text value', e.target.value)
                      this.setState({updateMessage:e.target.value})
                    }}
                    id='inputAF'  
                    placeholder={this.state.changeMessage} />
                </Form>
                <Button color="primary" onClick={()=>{
                  this.setState({ changeMessage:this.state.updateMessage ,update:false})
                }}>Update Affirmation</Button>{' '}
                <Button color="secondary" onClick={()=>{
                  this.setState({update:false})
                }}>Cancel</Button>{' '}
              </React.Fragment>
      )
    }
  }

  // sideContent = () => {
  //   return (
  //     <div className="card">
  //       {/* <img className="card-img-top" src=".../100px180/?text=Image cap" alt="Card image cap"/> */}
  //       <div className="card-body">
  //         <h5 className="card-title">Next Workout: Legs Week 2</h5>
  //         {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
  //       </div>
  //       <ul className="list-group list-group-flush">
  //         <li className="list-group-item">Start</li>
  //         <li className="list-group-item">End</li>
  //         <li className="list-group-item">Skip</li>
  //       </ul>
  //       <div className="card-body">
  //         <a href="#" className="card-link">Edit Workout</a>
  //         <a href="#" className="card-link">Another link</a>
  //       </div>
  //     </div>
  //   )
  // }

  renderContent() {
    switch (this.props.auth.user) {
      case null:
        return ''
      case false:
        return this.props.history.push('/')
      default:
        return (
          <React.Fragment>
            <Row style={{padding:0}}>
              <Col md='4'>
              <Card body inverse color='secondary' style={{ borderColor: '#333' }}>
                <CardHeader>Current Goal:</CardHeader>
                <CardBody>
                  <CardTitle style={{border:'none', color:'white'}}>Weight Loss</CardTitle>
                  <CardText><Progress animated value={50}>50%</Progress></CardText>
                  {/* <Button>Go somewhere</Button> */}
                </CardBody>
                {/* <CardFooter>Footer</CardFooter> */}
              </Card>
              </Col>
              <Col md='4'>
              <Card body inverse color='secondary' style={{ borderColor: '#333' }}>
                <CardHeader>Upload New Progress Picture</CardHeader>
                <CardBody>
                  {/* <CardTitle style={{border:'none', color:'white'}}>Weight Lost</CardTitle> */}
                  <CardText style={{padding:'10px'}}>
                    <FormGroup style={{marginBottom:0}}>
                    {/* <Label for="exampleFile">Upload</Label> */}
                    <Input type="file" name="file" id="exampleFile" />
                    {/* <FormText color="muted">
                      This is some placeholder block-level help text for the above input.
                      It's a bit lighter and easily wraps to a new line.
                    </FormText> */}
                  </FormGroup>
                  </CardText>
                  {/* <Button>Go somewhere</Button> */}
                </CardBody>
                {/* <CardFooter>Footer</CardFooter> */}
              </Card>
              </Col>
              <Col md='4'>
              <Card body inverse color='secondary' style={{ borderColor: '#333' }}>
                <CardHeader>Plan Completion</CardHeader>
                <CardBody>
                  <CardTitle style={{border:'none', color:'white'}}>Lets Get To Work</CardTitle>
                  <CardText><Progress color='warning' value={30} >30%</Progress></CardText>
                  {/* <Button>Go somewhere</Button> */}
                </CardBody>
                {/* <CardFooter>Footer</CardFooter> */}
              </Card>
              </Col>
            </Row>
            <h2>Week Ahead</h2>
            <DashCalendar plan={this.props.plans[7]} />
            <hr/>
            <h2>Current Macros</h2>
            <Block
              content={<NutritionTable/>}
              colSize={6}
            />
            <hr/>
            <div className="row justify-content-center">
              <div className="col-md-8">
                <PlanList />
              </div>
            </div>
          </React.Fragment>
        )
    }
  }

  componentDidMount() {
    this.props.fetchPlanTemps()
    if (!localStorage.getItem('token')) {
      this.props.fetchUser()
      
    } else {
      let token = localStorage.getItem('token')
      this.props.mountToken(token)
      this.props.fetchUserLocal(token)
      
    }
  }

  render() {
    return (
      // <Container fluid>
      <Row  noGutters>
        <Col className='sidebar-col' md='3'>
        <Card>
          <CardHeader tag="h3">
            User Name
          </CardHeader>
          <CardBody>
            <CardTitle>{new Date().toLocaleDateString()}</CardTitle>
            <CardText style={{padding:'10px'}}>{this.affirmationChange()}</CardText>
            <ListGroup flush>
              <ListGroupItem tag='button' >Overview</ListGroupItem>
              <ListGroupItem tag='button' >Nutrition</ListGroupItem>
              <ListGroupItem tag='button' >My Plans</ListGroupItem>
              <ListGroupItem tag='button' >Messages</ListGroupItem>
              <ListGroupItem tag='button' >Account Settings</ListGroupItem>
            </ListGroup>
            {/* <Button>Go somewhere</Button> */}
          </CardBody>
          {/* <CardFooter className="text-muted">Footer</CardFooter> */}
        </Card>
        </Col>

        <Col className='bg-light' style={{paddingTop:'10px'}} md='9'>
          {this.renderContent()}
        </Col>
      </Row>
    )
  }
}

function mapStateToProps(state, { auth }) {
  return {
     auth: state.auth,
     plans: state.plans.planTemps 
    }
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(Dashboard))
