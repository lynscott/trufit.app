import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as actions from '../actions'
// import PlanList from './PlanList'
import classnames from 'classnames'

import DashCalendar from './DashCalendar'
import NutritionTable from './NutritionTable'
// import { scaleRotate as Menu } from 'react-burger-menu'
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
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  FormText,
  Row,
  Col
} from 'reactstrap'
import './Sidebar.scss'
import './DashBoard.scss'
import { Pie, Line } from 'react-chartjs-2'
import ViewPlan from './ViewPlan'

const Block = ({ content, colSize, content2 = null, configs = null }) => {
  return (
    <div className="row px-0 justify-content-around">
      <div className={`col-md-${colSize} ${configs}`}>{content}</div>
      <div className={'col-md-5'}>{content2}</div>
    </div>
  )
}

const data = {
  labels: ['Carbs', 'Protien', 'Fats'],
  datasets: [
    {
      data: [100, 250, 75],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]
}

const data2 = {
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
      activePage: 'overview'
    }
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
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
            <h2>Week Ahead</h2>
            <DashCalendar plan={this.props.plans[7]} />
            <hr />
            <h2>Current Macros</h2>
            <Block
              content={<NutritionTable />}
              content2={<Pie data={data} />}
              colSize={7}
            />
            <hr />
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col md="12">
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
      <Row style={{ padding: 0, marginBottom: '10px' }}>
        <Col md="4" className="py-3">
          <Card body inverse color="secondary" style={{ borderColor: '#333' }}>
            <CardHeader>Current Goal:</CardHeader>
            <CardBody>
              <CardTitle style={{ border: 'none', color: 'white' }}>
                Weight Loss
              </CardTitle>
              <CardText>
                <Progress animated value={50}>
                  50%
                </Progress>
              </CardText>
              {/* <Button>Go somewhere</Button> */}
            </CardBody>
            {/* <CardFooter>Footer</CardFooter> */}
          </Card>
        </Col>
        <Col md="4" className="py-3">
          <Card body inverse color="secondary" style={{ borderColor: '#333' }}>
            <CardHeader>Upload New Progress Picture</CardHeader>
            <CardBody>
              {/* <CardTitle style={{border:'none', color:'white'}}>Weight Lost</CardTitle> */}
              <CardText style={{ padding: '10px' }}>
                <FormGroup style={{ marginBottom: 0 }}>
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
        <Col md="4" className="py-3">
          <Card body inverse color="secondary" style={{ borderColor: '#333' }}>
            <CardHeader>Plan Completion</CardHeader>
            <CardBody>
              <CardTitle style={{ border: 'none', color: 'white' }}>
                Lets Get To Work
              </CardTitle>
              <CardText>
                <Progress color="warning" value={30}>
                  30%
                </Progress>
              </CardText>
              {/* <Button>Go somewhere</Button> */}
            </CardBody>
            {/* <CardFooter>Footer</CardFooter> */}
          </Card>
        </Col>
      </Row>
    )
  }

  render() {
    console.log(this.props.user)
    return (
      <Col className="bg-light" style={{ paddingTop: '10px' }} md="9">
        {this.renderDashTopStats()}
        {this.renderOverviewTabs()}
      </Col>
    )
  }
}

function mapStateToProps(state, { auth }) {
  return {
    user: state.auth.user,
    plans: state.plans.planTemps
  }
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(Dashboard))
