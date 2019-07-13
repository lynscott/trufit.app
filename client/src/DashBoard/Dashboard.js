import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
import classnames from 'classnames'
import Stats from './UserStats'
import DashCalendar from './DashCalendar'
import PoseNet from '../component/PoseNet'
import NutritionTable from './NutritionTable'
import {COLLAPSE_TRIGGER_WIDTH} from '../constants/Layout'

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
  CardText,
  Jumbotron,
  Label,
  Input,
  Row,
  Col,
  CardGroup,
  CardDeck,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardColumns,
  CardImg,
  CardSubtitle
} from 'reactstrap'
import './Sidebar.scss'
import './DashBoard.scss'
import { Pie, Bar } from 'react-chartjs-2'
import ViewPlan from './ViewPlan'
import windowSize from 'react-window-size'

const BarChart = ({ display, calories, planned }) => {
  return (
    <Col md="12" className="p-2">
      <Bar
        data={{
          labels: ['Planned','Actual', 'Deficit/Excess'],
          datasets: [
            {
              label: 'Intake',
              backgroundColor: 'rgba(0,0,0,0.6)',
              borderColor: 'rgba(130, 128, 128,1)',
              borderWidth: 1,
              hoverBackgroundColor: ' rgba(117, 200, 171, 0.4)', //'rgba(130, 128, 128,0.4)',
              hoverBorderColor: 'rgba(117, 200, 171, 1)',
              data: [ planned, 592, -800]
            }
          ]
        }}
        options={{
          legend: {
            display: false
          },

          scales: {
            yAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 12,
                  display: display
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Calories',
                  fontColor: 'black'
                }
              }
            ],
            xAxes: [
              {
                ticks: {
                  fontColor: 'black',
                  fontSize: 12,
                  display: display
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Average Intake',
                  fontColor: 'black'
                }
              }
            ]
          }
        }}
      />
    </Col>
  )
}

//TODO: Move to const folder
const WL =
  'Focus primarily on weight loss, which will reduce muscle as well as fat.'
const WG =
  'Focus on gaining lean muscle mass. Body fat increases may be accumulated in the process but we will work to keep them minimal.'
const BR =
  'Body recomposition focuses on decreasing body fat while simultaneously increasing muscle mass.'
const MA =
  'Maintenance'

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
      assessment: false
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
          className="lead affirmation"
          style={{ fontSize: '1.2rem' }}
          onDoubleClick={() => this.setState({ update: true })}
        >
          {this.props.profile
            ? this.props.profile.affirmation !== ''
              ? this.props.profile.affirmation
              : 'Tap to fill out'
            : ''}
        </p>
      )
    } else {
      return (
        <React.Fragment>
          <Form className="row">
            <Input
              type="text"
              style={{ marginBottom: '8px', backgroundColor: 'lightgrey' }}
              onChange={e => {
                this.setState({ updateMessage: e.target.value })
              }}
              id="inputAF"
              placeholder={
                this.props.profile ? this.props.profile.affirmation : ''
              }
            />
          </Form>
          <Button
            className="m-3"
            color="info"
            onClick={async () => {
              await this.props.updateProfile({
                keys: ['affirmation'],
                affirmation: this.state.updateMessage
              })
              this.setState({ update: false })
            }}
          >
            Update Affirmation
          </Button>{' '}
          <Button
            className="m-3"
            color="dark"
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

  dropDownToggle = () => {
    return (
      <Dropdown
        isOpen={this.state.dropOpen}
        direction={'right'}
        toggle={this.toggleDrop}
        // color='dark'
      >
        <DropdownToggle color='dark' caret>Change Goal</DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            onClick={() =>
              this.props.updateProfile({
                keys: ['currentGoal'],
                currentGoal: { text: 'Weight Loss', value: -300 }
              })
            }
          >
            Weight Loss
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              this.props.updateProfile({
                keys: ['currentGoal'],
                currentGoal: { text: 'Weight Gain', value: 300 }
              })
            }
          >
            Weight Gain
          </DropdownItem>
          <DropdownItem
            onClick={() =>
              this.props.updateProfile({
                keys: ['currentGoal'],
                currentGoal: { text: 'Recomposition', value: 200 }
              })
            }
          >
            Body Recomposition
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    )
  }

  renderOverviewWall = () => {
    let { protein, fat, carb } = this.props.profile.macros
    return (
      <CardColumns className="card-wall mt-4">
      
      {this.state.assessment?
        <Card >
          <CardHeader>Assessment</CardHeader>
           <PoseNet/>
        </Card>
        : null}

        <Card  style={{ color: '#333', borderColor: '#cc370a', paddingBottom:'15px' }}>
          <CardHeader style={{ margin: 0, backgroundColor: '#cc370a', color:'white' }}>
            Current Goal & Training Plan
          </CardHeader>
          <CardText style={{ margin: 0, color:'black' }}>
            {this.props.profile ? this.props.profile.currentGoal.text : null}
          </CardText>
          <CardText style={{ padding: '15px', fontSize:'15px', color:'black' }}>
            {this.props.profile.currentGoal.text === 'Weight Loss'
              ? WL
              : this.props.profile.currentGoal.text === 'Weight Gain'
              ? WG
              : this.props.profile.currentGoal.text === 'Recomposition'
              ? BR
              : null}
          </CardText>
          {this.dropDownToggle()}
          
        </Card>

        <Card>
          <CardHeader >Recommended Macros</CardHeader>
          <CardSubtitle className="pt-2">
            {parseInt(this.props.profile.calories) + this.props.profile.currentGoal.value}cal
          </CardSubtitle>
          <CardBody className="p-1">
            <Pie
              data={{
                labels: ['Carbs', 'Protein', 'Fat'],
                datasets: [
                  {
                    data: [carb, protein, fat],
                    backgroundColor: ['#3acbe8', '#3ae89c', '#FFCE56'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#e89c3a']
                  }
                ]
              }}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader >Nutrition Schedule</CardHeader>
          <CardBody>
            <NutritionTable />
          </CardBody>
        </Card>

        <Card>
          <CardHeader >Training Schedule</CardHeader>
          <CardBody>
            {/* <CardTitle>Training Schedule</CardTitle> */}
            {/* <DashCalendar /> */}
            <CardText>No workouts scheduled! Select a plan and create a schedule.</CardText>

          </CardBody>
        </Card>
        

        <Card>
          <CardHeader >Weight Check-ins</CardHeader>
          <Stats />
        </Card>


        <Card >
          <CardHeader >Caloric Intake Tracking</CardHeader>

          <BarChart
            display={this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH ? false : true}
            calories={this.props.profile.calories}
            planned={this.props.profile.nutritionCalories}
            />
        </Card>
      </CardColumns>
    )
  }


  renderDashTopStats = () => {
    return (
      // <Row style={{ padding: 0, marginBottom: '10px' }}>
      // {/* {this.affirmationChange()} */}
      <Jumbotron className="text-left" style={{ width: '100%' }}>
        {/* <h1 className="display-3">Hello, world!</h1> */}
        {this.affirmationChange()}
        <hr className="my-2" />
        {/* <p>It uses utility classes for typography and spacing to space content out within the larger container.</p> */}
        {/* <p className="lead">
          <Button color="primary">Learn More</Button>
        </p> */}
        <Row>
          <Col md='4'>
           {/* {this.props.user.isAdmin?  */}
           {/* <Button onClick={()=> this.setState({assessment:true})}>Start Initial Assessment</Button> */}
           {/* : null} */}
            <CardSubtitle
              style={{
                textAlign: 'left',
                paddingLeft: '15px',
                marginTop: '10px'
              }}
            >
              Plan Completion
            </CardSubtitle>
            <Progress color="dark" className="mx-3" value={30}>
              0%
            </Progress>
          </Col>
          <Col>
           {/* {this.props.user.isAdmin?  */}
           {/* <Button color='info' onClick={()=> this.setState({assessment:false})}>End Assessment</Button> */}
           {/* : null} */}
          </Col>
        </Row>
      </Jumbotron>
      // </Row>
    )
  }

  render() {
    // console.log(this.props.profile)
    return (
      <Col
        className="bg-white"
        style={{ // backgroundColor: '#b3b3b3' 
        }}
        md="10"
      >
        {this.props.profile ? (
          <>
            {this.renderDashTopStats()}
            {this.renderOverviewWall()}
          </>
        ) : null}
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

export default windowSize(
  connect(
    mapStateToProps,
    actions
  )(withRouter(Dashboard))
)
