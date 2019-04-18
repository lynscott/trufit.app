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
  ListGroup, Collapse, NavbarToggler,
  ListGroupItem, Nav, NavItem, NavLink
} from 'reactstrap'
import './Sidebar.scss'

class DashSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'Course-List',
      updateMessage: '',
      update: false,
      currentTab: 'overview',
      collapsed: false,
    }
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
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
    // console.log(this.props)
    return (
      // <div>
        <Nav vertical navbar className="sidebar-col col-md-2" >

          <CardHeader tag="h3">
            {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          <CardTitle>{new Date().toLocaleDateString()}</CardTitle>

          {/* <NavbarToggler onClick={this.toggleNavbar} className="mr-2" /> */}
          <Button className='d-sm-block d-md-none' onClick={this.toggleNavbar} >Nav Button</Button>
          <Collapse isOpen={!this.state.collapsed} navbar>

          <NavItem active={this.state.currentTab === 'overview' ? true : false}>
            <Link style={{textDecoration:'none'}} to="/dashboard/overview">
              <NavLink active={this.state.currentTab === 'overview' ? true : false} onClick={() => this.setState({ currentTab: 'overview' })} >
                    Overview
              </NavLink>
            </Link>
          </NavItem >

          <NavItem active={this.state.currentTab === 'nutrition' ? true : false}>     
            <Link style={{textDecoration:'none'}} to="/dashboard/nutrition">
              <NavLink  onClick={() => this.setState({ currentTab: 'nutrition' })} >
                  Nutrition
              </NavLink>
            </Link>
          </NavItem>

          <NavItem active={this.state.currentTab === 'training' ? true : false}>
            <Link style={{textDecoration:'none'}} to="/dashboard/plans">
              <NavLink  onClick={() => this.setState({ currentTab: 'training' })} >
                  Training
              </NavLink>
            </Link>
          </NavItem>

          <NavItem active={this.state.currentTab === 'settings' ? true : false}>
            <Link style={{textDecoration:'none'}} to="/dashboard/settings">
              <NavLink  onClick={() => this.setState({ currentTab: 'settings' })} >
                  Settings
              </NavLink>
            </Link>
          </NavItem> 
          </Collapse>     
        </Nav>
        // </div>
    )
  }
}

export default connect(
  null,
  actions
)(DashSideBar)
