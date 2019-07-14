// import * as icons from 'Constants/SVGIcons'
import React, { useLayoutEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
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
import SlackFeedback,  { themes } from 'react-slack-feedback'
import keys from '../config/keys'
import {COLLAPSE_TRIGGER_WIDTH} from '../constants/Layout'

class DashSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      // page: 'Course-List',
      updateMessage: '',
      update: false,
      collapsed: this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH ,
      expanded: true // Not in use
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
            if( this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH && !this.state.collapsed) {
              this.toggleNavbar()
            } else if (this.props.windowWidth > COLLAPSE_TRIGGER_WIDTH && this.state.collapsed) {
              this.toggleNavbar()
            }
            
          })
    }


    if (this.props.sidebarWidth !== document.getElementById('dash-sidebar').offsetWidth)
      this.props.setSideBarWidth(document.getElementById('dash-sidebar').offsetWidth)
  }


  renderAdminLink = () => {
    if (this.props.profile.isAdmin)
      return(
          <>
            <hr/>
            <NavItem active={this.props.currentTab === 'admin'}>
            <Link style={{textDecoration:'none'}} to="/dashboard/admin">
              <NavLink  onClick={() => {
                        if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                            this.toggleNavbar()
                        }
                      }} >
                  Admin 
              </NavLink>
            </Link>
            </NavItem>
          </>
      )
    else return null
  }



  render() {
    return (
        <Nav vertical navbar id='dash-sidebar' className={this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH ? 
          'sticky-top sidebar-col col-md-2 bg-dark': 'desktop sidebar-col col-md-2 bg-dark'} >
          <CardHeader style={{backgroundColor:'transparent', fontFamily:'Fira Sans, sans-serif'}} tag="h4">
           {/* <img src={' https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/tf1.png	'}/>  */}
           {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          {/* <CardTitle style={{fontFamily:'Fira Sans, sans-serif'}}>{new Date().toLocaleDateString()}</CardTitle> */}

          <FontAwesomeIcon icon="bars" className='d-sm-block d-md-none mx-auto' onClick={this.toggleNavbar} size={'2x'} />
          <Collapse isOpen={!this.state.collapsed}>
          <div className='nav-links'>
            <NavItem active={this.props.currentTab === 'overview'}>
              <Link style={{textDecoration:'none'}} to="/dashboard/overview">
                <NavLink
                        onClick={ ()=>{
                          if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                              this.toggleNavbar()
                          }
                        }} >
                      Overview
                </NavLink>
              </Link> 
            </NavItem >

            <NavItem active={this.props.currentTab === 'nutrition'}>     
              <Link style={{textDecoration:'none'}} to="/dashboard/nutrition">
                <NavLink onClick={ ()=>{
                          if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                              this.toggleNavbar()
                          }
                        }} >
                    Nutrition
                </NavLink>
              </Link>
            </NavItem>

            <NavItem active={this.props.currentTab === 'plans'}>
              <Link style={{textDecoration:'none'}} to="/dashboard/plans">
                <NavLink  onClick={()=>{
                          if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                              this.toggleNavbar()
                          }
                        }} >
                    Training
                </NavLink>
              </Link>
            </NavItem>

            {/* TODO: Create settings page */}
            {/* <NavItem active={this.props.currentTab === "settings"}>
              <Link style={{textDecoration:'none'}} to="/dashboard/settings">
                <NavLink  onClick={ ()=>{
                          if (!this.state.collapsed && this.props.windowWidth < COLLAPSE_TRIGGER_WIDTH) {
                              this.toggleNavbar()
                          }
                        }} >
                    Settings
                </NavLink>
              </Link>
            </NavItem> */}

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
          </div>


          <SlackFeedback
            channel="#user-feedback"
            errorTimeout={8 * 1000}
            onClose={() => {}}
            onOpen={() => {}}
            sentTimeout={5 * 1000}
            showChannel={false}
            showIcon={true}
            theme={themes.dark}
            user={this.props.user ? 
              this.props.user.email + ' ' + this.props.user.name
            : null}
            onSubmit={(payload, success, error) => {
              let logPromise =  new Promise(function(resolve, reject) {
                setTimeout(function() {
                  resolve(console.log(payload))
                }, 300)
              })
              if (keys.slackWebHook) {
                return fetch(keys.slackWebHook, {
                  method: 'POST',
                  body: JSON.stringify(payload)
                })
                .then(success)
                .catch(error)
              } else {
               return logPromise.then(success)
              }
            }
            }//TODO: wire up
            onImageUpload={(file, success, error) => {}}
          />

          {this.props.profile ?
            this.renderAdminLink()
           : null}

          </Collapse>     
        </Nav>
    )
  }
}

/**
 * Select the current tab from the router. This will make
 * the state of the sidebar controlled by the router pathname
 */
const tabSelectorFromRoute = (pathname) => {
  switch(pathname){
    case '/dashboard/overview':
      return 'overview'
    case '/dashboard/plans':
      return 'plans'
    case '/dashboard/nutrition':
      return 'nutrition'
    case '/dashboard/settings':
      return 'settings'
    default:
      return 'overview'
  }
}

const mapStateToProps = state => {
  return {
    currentTab: tabSelectorFromRoute(state.router.location.pathname),
    sidebarWidth: state.layout.sideBarWidth
  }
}

export default windowSize(withRouter(connect(
  mapStateToProps,
  actions
)(DashSideBar)))
