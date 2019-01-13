// import * as icons from 'Constants/SVGIcons'
import React from 'react'
import { Link } from 'react-router-dom'
import * as actions from '../actions'
import { connect } from 'react-redux'
import {
  Col,
  Card,
  CardHeader,
  CardTitle,
  CardText,
  CardBody,
  Form,
  Input,
  Button,
  ListGroup,
  ListGroupItem
} from 'reactstrap'
import './Sidebar.scss'

class DashSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'Course-List',
      updateMessage: '',
      update: false,
      currentTab: 'overview'
    }
  }

  affirmationChange = () => {
    if (this.state.update === false) {
      return (
        <p
          className="lead"
          style={{ fontSize: '1.2rem' }}
          onClick={() => this.setState({ update: true })}
        >
          {this.props.profile ? this.props.profile.affirmation : ''}
        </p>
      )
    } else {
      return (
        <React.Fragment>
          <Form>
            <Input
              type="text"
              style={{ marginBottom: '8px' }}
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
            color="info"
            style={{ marginBottom: '5px' }}
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
            style={{ marginBottom: '5px' }}
            color="secondary"
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

  render() {
    console.log(this.props)
    return (
      <Col className="sidebar-col" md="3">
        <Card>
          <CardHeader tag="h3">
            {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          <CardBody>
            <CardTitle>{new Date().toLocaleDateString()}</CardTitle>
            {/* <CardText style={{ padding: '10px' }}> */}
              {this.affirmationChange()}
            {/* </CardText> */}
            <ListGroup flush>
              <Link to="/dashboard/overview" style={{ textDecoration: 'none' }}>
                <ListGroupItem
                  active={this.state.currentTab === 'overview' ? true : false}
                  onClick={() => this.setState({ currentTab: 'overview' })}
                  tag="button"
                >
                  Overview
                </ListGroupItem>
              </Link>
              <Link
                to="/dashboard/nutrition"
                style={{ textDecoration: 'none' }}
              >
                <ListGroupItem
                  active={this.state.currentTab === 'nutrition' ? true : false}
                  onClick={() => this.setState({ currentTab: 'nutrition' })}
                  tag="button"
                >
                  Nutrition
                </ListGroupItem>
              </Link>
              <Link to="/dashboard/plans" style={{ textDecoration: 'none' }}>
                <ListGroupItem
                  active={this.state.currentTab === 'plans' ? true : false}
                  onClick={() => this.setState({ currentTab: 'plans' })}
                  tag="button"
                >
                  My Plans
                </ListGroupItem>
              </Link>
              <Link
                to="/dashboard/account-settings"
                style={{ textDecoration: 'none' }}
              >
                <ListGroupItem
                  active={this.state.currentTab === 'settings' ? true : false}
                  onClick={() => this.setState({ currentTab: 'settings' })}
                  tag="button"
                >
                  Account Settings
                </ListGroupItem>
              </Link>
            </ListGroup>
          </CardBody>
        </Card>
      </Col>
    )
  }
}

export default connect(
  null,
  actions
)(DashSideBar)
