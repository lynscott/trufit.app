import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import classnames from 'classnames'

import DashCalendar from './DashCalendar'
import NutritionTable from './NutritionTable'
// import CreatePlanForm from './CreatePlanForm'
import {
  Button,
  Form,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Container,
  Progress,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  CardText,
  Jumbotron,
  Label,
  Input,
  Row,
  Col, CardGroup, CardDeck, Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
  CardColumns, CardImg, CardSubtitle
} from 'reactstrap'
import './Sidebar.scss'
import './DashBoard.scss'
import { Pie, Line } from 'react-chartjs-2'
import ViewPlan from './ViewPlan'

const Block = ({ content, colSize, content2 = null, configs = null }) => {
  return (
    // <div className="row px-0 justify-content-around">
      <div className={`col-md-${colSize} ${configs}`}>{content}</div>
      // {/* <div className={'col-md-6'}>{content2}</div> */}
    // </div>
  )
}

const data = {
  labels: ['Carbs', 'Protein', 'Fats'],
  datasets: [
    {
      data: [100, 250, 75],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]
}

export const data2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Weight tracking (lbs)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(75,192,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [200, 180, 150, 130, 200, 190, 140]
    }
  ]
}

class Dashboard extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // eslint-disable-next-line quotes
      activeTab: '1',
      activePage: 'overview',
      dropOpen: false,
      currentGoal: 'No Goal Selected',
      updateMessage: 'Testing',
      update: false,
    }
  }

  componentDidMount = async () => {
    await this.props.fetchProfile()
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  toggleDrop = () => {
    this.setState(prevState => ({
      dropOpen: !prevState.dropOpen
    }))
  }

  affirmationChange = () => {
    if (this.state.update === false) {
      return (
        <p
          className="lead"
          style={{ fontSize: '1.2rem' }}
          onDoubleClick={() => this.setState({ update: true })}
          
        >
          {this.props.profile ? this.props.profile.affirmation !== '' ? this.props.profile.affirmation : 'Tap to fill out' : ''}
        </p>
      )
    } else {
      return (
        <React.Fragment>
          <Form className='row'>
            <Input
              type="text"
              style={{ marginBottom: '8px', backgroundColor:'lightgrey' }}
              onChange={e => {
                this.setState({ updateMessage: e.target.value })
              }}
              id="inputAF" placeholder={this.props.profile ? this.props.profile.affirmation : ''}
            />
          </Form>
          <Button className='m-3'
            color="info"  onClick={async () => {
              await this.props.updateProfile({keys: ['affirmation'], affirmation: this.state.updateMessage })
              this.setState({ update: false })
            }}
          >
            Update Affirmation
          </Button>{' '}
          <Button className='m-3' color="secondary"
            onClick={() => {
              this.setState({ update: false })
            }}
          >
            Cancel
          </Button>{' '}
        </React.Fragment>
      )
    }
  }

  renderOverviewWall = () => {
    return (
      <CardColumns className='card-wall mt-4'>
        <Card>
          {/* <CardImg top width="100%" src="https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/gym.jpg" alt="Card image cap" /> */}
          <CardBody>
            <CardTitle>Next Workout</CardTitle>
            <CardSubtitle>Stay on track.</CardSubtitle>
            {/* <CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText>
            <Button>Button</Button> */}
            <DashCalendar plan={this.props.plans[7]} />
          </CardBody>
        </Card>
        
        <Card>
          <CardBody>
            <CardTitle>Next Meal</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            {/* <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText> */}
            <NutritionTable />
            {/* <Button>Button</Button> */}
          </CardBody>
        </Card>
        <Card body inverse style={{ backgroundColor: '#333', borderColor: 'white' }}>
          <CardTitle>Current Goal:</CardTitle>
          <CardText>{this.props.profile.currentGoal.text}</CardText>
          {/* <Button>Button</Button> */}
          <Dropdown isOpen={this.state.dropOpen} direction={'right'} toggle={this.toggleDrop}>
                <DropdownToggle caret>
                Change Goal
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={()=>this.props.updateProfile({keys: ['currentGoal'], currentGoal:{text:'Weight Loss', value:-400}})}>Weight Loss</DropdownItem>
                  {/* <DropdownItem onClick={()=>this.props.updateProfile({keys: ['currentGoal'], currentGoal:{text:'Strength & Mass', value:600}})} >Strength Gain</DropdownItem> */}
                  {/* <DropdownItem disabled>Action (disabled)</DropdownItem> */}
                  {/* <DropdownItem divider /> */}
                  <DropdownItem onClick={()=>this.props.updateProfile({keys: ['currentGoal'], currentGoal:{text:'Weight Gain', value:400}})}>Weight Gain</DropdownItem>
                  {/* <DropdownItem onClick={()=>this.props.updateProfile({keys: ['currentGoal'], currentGoal:{text:'Tone Up', value:-400}})}>Tone Up</DropdownItem> */}
                  {/* <DropdownItem>Quo Action</DropdownItem> */}
                </DropdownMenu>
              </Dropdown>
        </Card>
        <Card>
          {/* <CardImg top width="100%" src="https://placeholdit.imgix.net/~text?txtsize=33&txt=256%C3%97180&w=256&h=180" alt="Card image cap" /> */}
          <CardBody>
            <CardTitle>Training Plan Progress</CardTitle>
            <CardSubtitle>Keep it up!</CardSubtitle>
            <CardText>
            <Progress color="info" value={30}>
                  30%
                </Progress>
            </CardText>
            {/* <Button>Button</Button> */}
          </CardBody>
        </Card>
        <Card body inverse color="primary">
          <CardTitle>Special Title Treatment</CardTitle>
          <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
          <Button color="secondary">Button</Button>
        </Card>
      </CardColumns>
    )
  }

  renderOverviewTabs = () => {
    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
              style={{ textTransform: 'none' }}
            >
              Overview
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2')
              }}
              style={{ textTransform: 'none' }}
            >
              Stats
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            {/* <h2>Week Ahead</h2> */}
            {this.renderOverviewWall()}
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col md="10">
                <h4>Weight Tracking</h4>
                <Line data={data2} />
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </React.Fragment>
    )
  }

  renderDashTopStats = () => {
    return (
      // <Row style={{ padding: 0, marginBottom: '10px' }}>
      // {/* {this.affirmationChange()} */}
      <Jumbotron className='text-left' style={{width:'100%'}} >
        {/* <p>It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
        {/* <h1 className="display-3">Hello, world!</h1> */}
        {this.affirmationChange()}
        <hr className="my-2" />
        {/* <p>It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
        {/* <p className="lead">
          <Button color="primary">Learn More</Button>
        </p> */}
        <Row>
          <Col>
            Most recent check-in weight: None
          </Col>
          <Col>
            Meals tracked: 0
          </Col>
          <Col>
            Calories over today: 0
          </Col>
        </Row>
      </Jumbotron>
      // </Row>
    )
  }

  render() {
    // console.log(this.props)
    return (
      <Col className="bg-dark" style={{ paddingTop: '10px' }} md="10">
        {this.props.profile? this.renderDashTopStats():null}
        {this.renderOverviewTabs()}
      </Col>
    )
  }
}

function mapStateToProps(state, { auth }) {
  return {
    user: state.auth.user,
    plans: state.plans.planTemps,
    profile: state.auth.userProfile
  }
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(Dashboard))
