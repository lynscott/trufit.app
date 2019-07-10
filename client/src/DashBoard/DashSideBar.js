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
import SlackFeedback,  { themes } from 'react-slack-feedback'
import keys from '../config/keys'


class DashSideBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      page: 'Course-List',
      updateMessage: '',
      update: false,
      currentTab: 'overview',
      collapsed: this.props.windowWidth < 500 ? true:false,
      expanded: true
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


  renderAdminLink = () => {
    
    if (this.props.profile.isAdmin)
      return(
          <>
            <hr/>
            <NavItem active={this.state.currentTab === 'admin' ? true : false}>
            <Link style={{textDecoration:'none'}} to="/dashboard/admin">
              <NavLink  onClick={() => this.setState({ currentTab: 'admin' },()=>{
                        if (!this.state.collapsed && this.props.windowWidth < 500) {
                            this.toggleNavbar()
                        }
                      })} >
                  Admin 
              </NavLink>
            </Link>
            </NavItem>
          </>
      )
    else return null
  }



  render() {
    console.log(this.props)
    return (
        <Nav vertical navbar className="sidebar-col col-md-2 bg-dark" >
          <CardHeader style={{backgroundColor:'transparent', fontFamily:'Fira Sans, sans-serif'}} tag="h3">
           {/* <img src={' https://cloud-cube.s3.amazonaws.com/fsh57utbg0z9/public/tf1.png	'}/>  */}
           {this.props.user ? this.props.user.name : ''}
          </CardHeader>
          {/* <CardTitle style={{fontFamily:'Fira Sans, sans-serif'}}>{new Date().toLocaleDateString()}</CardTitle> */}

          <FontAwesomeIcon icon="bars" className='d-sm-block d-md-none mx-auto' onClick={this.toggleNavbar} size={'2x'} />
          <Collapse isOpen={!this.state.collapsed} navbar>
          <div className='nav-links'>
            <NavItem active={this.state.currentTab === 'overview' ? true : false}>
              <Link style={{textDecoration:'none'}} to="/dashboard/overview">
                <NavLink active={this.state.currentTab === 'overview' ? true : false} 
                        onClick={() => this.setState({ currentTab: 'overview' },()=>{
                          if (!this.state.collapsed && this.props.windowWidth < 500) {
                              this.toggleNavbar()
                          }
                        })} >
                      Overview
                </NavLink>
              </Link>
            </NavItem >

            <NavItem active={this.state.currentTab === 'nutrition' ? true : false}>     
              <Link style={{textDecoration:'none'}} to="/dashboard/nutrition">
                <NavLink onClick={() => this.setState({ currentTab: 'nutrition' },()=>{
                          if (!this.state.collapsed && this.props.windowWidth < 500) {
                              this.toggleNavbar()
                          }
                        })} >
                    Nutrition
                </NavLink>
              </Link>
            </NavItem>

            <NavItem active={this.state.currentTab === 'training' ? true : false}>
              <Link style={{textDecoration:'none'}} to="/dashboard/plans">
                <NavLink  onClick={() => this.setState({ currentTab: 'training' },()=>{
                          if (!this.state.collapsed && this.props.windowWidth < 500) {
                              this.toggleNavbar()
                          }
                        })} >
                    Training
                </NavLink>
              </Link>
            </NavItem>

            <NavItem active={this.state.currentTab === 'settings' ? true : false}>
              <Link style={{textDecoration:'none'}} to="/dashboard/settings">
                <NavLink  onClick={() => this.setState({ currentTab: 'settings' },()=>{
                          if (!this.state.collapsed && this.props.windowWidth < 500) {
                              this.toggleNavbar()
                          }
                        })} >
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
            }
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

export default windowSize(connect(
  null,
  actions
)(DashSideBar))
