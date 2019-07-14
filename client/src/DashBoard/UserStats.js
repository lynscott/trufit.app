import React, {Component} from 'react'
import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import {Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap'


class Stats extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
        // eslint-disable-next-line quotes
        activeTab: '1',
        activePage: 'overview',
        update: false,
        checkInModal: false,
        checkInWeight: null,
        mostRecentWeighIn: null
      }
    }

    componentDidMount = () => {
      if (this.props.profile.weighIns.length > 0) {
        this.setState({mostRecentWeighIn:new Date(this.props.profile.weighIns[this.props.profile.weighIns.length-1].date)})
      }
    }

    toggle = () => {
      this.setState(prevState => ({
        checkInModal: !prevState.checkInModal
      }))
    }

    renderCheckInModal = () => {
      return (  
          <Modal isOpen={this.state.checkInModal} toggle={this.toggle} className={this.props.className}>
            <ModalHeader toggle={this.toggle}>Weekly Check-In</ModalHeader>
            <ModalBody>
              Enter your current weight in lbs
            <Input className='mx-auto' 
            onChange={(event)=>{
              // console.log(event.target.value)
              this.setState({checkInWeight:event.target.value})
            }}
            style={{maxWidth:'fit-content', backgroundColor:'lightgrey'}} type="number" name="weight"/>
              {/* <p style={{marginTop:'20px'}}>Upload an accompanying progress picture (coming soon)</p>
            <Input className='mx-auto' type="file" name="file" /> */}
            </ModalBody>
            <ModalFooter>
              <Button color="dark" onClick={()=> {
                if (this.state.checkInWeight) {
                  this.props.updateProfile({keys:['weighIns'], weighIns:{weight:this.state.checkInWeight, date:new Date()}})
                  this.toggle()
                }
                else {
                  return 'error'
                }
                
                }}>Submit</Button>{' '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
      )
    }

    renderButton = () => {
      if (this.state.mostRecentWeighIn) {
        // console.log(this.state.mostRecentWeighIn.getDate(),  'ORIG')
        let tempDate = new Date(this.props.profile.weighIns[this.props.profile.weighIns.length-1].date)
        // console.log(tempDate.getDate(), 'COPY')
        tempDate.setDate(tempDate.getDate() + 7)
        // console.log(tempDate, new Date(), 'LEG')
        return (
          <>
            {tempDate > new Date() ? 
              <p style={{fontSize:'15px'}}>Check back in a week for your next check in!</p>: null}
            <Button color="dark" disabled={ new Date(tempDate) > new Date() ? true: false} onClick={this.toggle}>
              Check-In
            </Button>
          </>
        )
      } else {
        return (
          <Button color="dark" onClick={this.toggle}>Check-In</Button>
        )
      }
    }


    renderFirstCheckIn = () => {

      return (
            <Col md="12" className='p-2'>
              {this.renderCheckInModal()}
              <p>Your first weight check in! Click below to get started.</p>
              {this.renderButton()}
            </Col>
        )
    }


    renderWeightTrackGraph = () => {
      //Weight arr formatted for max and min values by 10
      let weightArr = this.props.profile.weighIns.map(item=> Math.round(0.1*parseInt(item.weight, 10))/0.1)
 

      return (
              <Col md="12" className='p-2'>
              {this.renderCheckInModal()}
                <Line data={{
                          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                          datasets: [
                            {
                              label: 'Weight tracking (lbs)',
                              fill: false,
                              lineTension: 0.1,
                              backgroundColor: 'rgba(255,255,255,0.8)', //'rgba(75,192,192,0.4)',
                              borderColor: 'black', //'rgba(75,192,192,1)',
                              borderCapStyle: 'butt',
                              borderDash: [],
                              borderDashOffset: 0.0,
                              borderJoinStyle: 'miter',
                              pointBorderColor: 'rgba(244, 123, 40, 1)',//'rgba(75,192,192,1)',
                              pointBackgroundColor: '#fff',
                              pointBorderWidth: 1,
                              pointHoverRadius: 5,
                              pointHoverBackgroundColor: 'rgba(241, 97, 74, 1)',
                              pointHoverBorderColor: 'rgba(220,220,220,1)',
                              pointHoverBorderWidth: 2,
                              pointRadius: 1,
                              pointHitRadius: 10,
                              data: this.props.profile.weighIns.map((data)=>{
                                return data ? {y:data.weight, x:new Date(data.date)} : []
                              })
                            }
                          ],
                        }}
                      options={{
                        legend: {
                          display: false,
                        },             
                        scales: {
                          // scaleLabel:{
                          //   display: true
                          // },
                          gridLines: {
                            color: 'rgb(255, 255, 255, 0.7)'
                          },
                          yAxes: [
                            {
                              ticks: {
                                //  beginAtZero:true,
                                fontColor: 'black',
                                fontSize: 13,
                                // steps: 5,
                                stepSize: 10,
                                max: Math.max(...weightArr)+10,
                                min: Math.min(...weightArr)-10
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Weight (lbs)',
                                fontColor: 'black'
                              }
                            }
                          ],
                          xAxes: [
                            {
                              ticks: {
                                fontColor: 'black',
                                fontSize: 12,
                                source: 'auto'
                              },
                              type: 'time',
                              time: {
                                unit:'month',
                                min: new Date('4/1/2019'),
                                unitStepSize: 1,
                                displayFormats: {
                                  quarter: 'MMM YYYY'
                                }

                              }
                            }
                          ]
                        }
                      }}
                 />
                 
                {this.renderButton()} 
              </Col>
      )
    }

    render(){
        return(
            this.props.profile.weighIns.length > 0 ? this.renderWeightTrackGraph() : this.renderFirstCheckIn()
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
)(Stats)