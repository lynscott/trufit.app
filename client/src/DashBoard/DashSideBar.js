// import * as icons from 'Constants/SVGIcons'
import React from 'react'
import { Link } from 'react-router-dom'
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
      changeMessage: 'Enter some text as a reminder why you won\'t quit!',
      updateMessage: '',
      update: false
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
          {this.state.changeMessage}
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
                console.log(
                  this.state.updateMessage,
                  'text value',
                  e.target.value
                )
                this.setState({ updateMessage: e.target.value })
              }}
              id="inputAF"
              placeholder={this.state.changeMessage}
            />
          </Form>
          <Button
            color="info"
            style={{ marginBottom: '5px' }}
            onClick={() => {
              this.setState({
                changeMessage: this.state.updateMessage,
                update: false
              })
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
    return (
      <Col className="sidebar-col" md="3">
        <Card>
          <CardHeader tag="h3">
            {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          <CardBody>
            <CardTitle>{new Date().toLocaleDateString()}</CardTitle>
            <CardText style={{ padding: '10px' }}>
              {this.affirmationChange()}
            </CardText>
            <ListGroup flush>
              <Link to="/dashboard/overview" style={{ textDecoration: 'none' }}>
                <ListGroupItem tag="button">Overview</ListGroupItem>
              </Link>
              <Link
                to="/dashboard/nutrition"
                style={{ textDecoration: 'none' }}
              >
                <ListGroupItem active tag="button">Nutrition</ListGroupItem>
              </Link>
              <Link to="/dashboard/plans" style={{ textDecoration: 'none' }}>
                <ListGroupItem tag="button">My Plans</ListGroupItem>
              </Link>
              <Link
                to="/dashboard/account-settings"
                style={{ textDecoration: 'none' }}
              >
                <ListGroupItem tag="button">Account Settings</ListGroupItem>
              </Link>
            </ListGroup>
          </CardBody>
        </Card>
      </Col>
    )
  }
}
export default DashSideBar
