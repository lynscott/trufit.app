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
import windowSize from 'react-window-size'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class DashSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'Course-List',
      updateMessage: '',
      update: false,
      currentTab: 'overview',
      collapsed: this.props.windowWidth < 500 ? true:false,
    }
  }

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    })
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.windowWidth !== this.props.windowWidth) {
          this.setState(()=>{
            if( this.props.windowWidth < 500 && !this.state.collapsed) {
              this.toggleNavbar()
            } else if (this.props.windowWidth > 500 && this.state.collapsed) {
              this.toggleNavbar()
            }
            
          })
    }
  }



  render() {
    // console.log(this.props)
    return (
      // <div>
        <Nav vertical navbar className="sidebar-col col-md-2" >
          <CardHeader style={{backgroundColor:'transparent'}} tag="h3">
            {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          <CardTitle>{new Date().toLocaleDateString()}</CardTitle>

          {/* <Button className='d-sm-block d-md-none' onClick={this.toggleNavbar} > */}
          <FontAwesomeIcon icon="bars" className='d-sm-block d-md-none mx-auto' onClick={this.toggleNavbar} size={'2x'} />
          {/* </Button> */}
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

          <NavItem>
            <a
              href={'/api/logout'}
              key="2"
              id="title"
              // onClick={()=> localStorage.getItem('token') ? this.props.signUserOut(this.props.history) : null}
              className="nav-item nav-link px-2"
            >
              Sign-out
            </a>
          </NavItem> 
          </Collapse>     
        </Nav>
        // </div>
    )
  }
}

export default windowSize(connect(
  null,
  actions
)(DashSideBar))
