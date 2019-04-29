import React, {Component} from 'react'
import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import {Col, Modal, ModalHeader, ModalBody, ModalFooter, Input, Button } from 'reactstrap'

const wieghtData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Weight tracking (lbs)',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(255,255,255,0.8)', //'rgba(75,192,192,0.4)',
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
  ],
}

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
            <ModalHeader toggle={this.toggle}>Weekly Check-in</ModalHeader>
            <ModalBody>
              Enter your current weight in lbs
            <Input className='mx-auto' 
            onChange={(event)=>{
              // console.log(event.target.value)
              this.setState({checkInWeight:event.target.value})
            }}
            style={{maxWidth:'fit-content', backgroundColor:'lightgrey'}} type="number" name="weight"/>
              <p style={{marginTop:'20px'}}>Upload an accompanying progress picture (coming soon)</p>
            <Input className='mx-auto' type="file" name="file" />
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={()=> {
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
        
        return (
          <>
            {this.state.mostRecentWeighIn.setDate(this.state.mostRecentWeighIn.getDate() + 7) > new Date() ? 
              'Check back in a week for your next check in!': null}
            <Button color="secondary" disabled={this.state.mostRecentWeighIn.setDate(this.state.mostRecentWeighIn.getDate() + 7) >
              new Date() ? true: false} onClick={this.toggle}>
              Check-In
            </Button>
          </>
        )
      } else {
        return (
          <Button color="secondary" onClick={this.toggle}>Check-In</Button>
        )
      }
    }


    renderWeightTrackGraph = () => {
      // let mostRecentWeighIn = this.props.profile.weighIns.length > 0 ?  : []

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
                                fontColor: 'white',
                                fontSize: 13
                              },
                              scaleLabel: {
                                display: true,
                                labelString: 'Weight (lbs)',
                                fontColor: 'white'
                              }
                            }
                          ],
                          xAxes: [
                            {
                              ticks: {
                                fontColor: 'white',
                                fontSize: 12,
                                source: 'auto'
                              },
                              type: "time",
                              time: {
                                unit:'month',
                                min: new Date('1/1/2019'),
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
            this.props.profile ? this.renderWeightTrackGraph() : null
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