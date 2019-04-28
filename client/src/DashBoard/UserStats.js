import React, {Component} from 'react'
import { Pie, Line } from 'react-chartjs-2'
import { connect } from 'react-redux'
import * as actions from '../actions'
import {Col} from 'reactstrap'

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
        dropOpen: false,
        currentGoal: 'No Goal Selected',
        updateMessage: 'Testing',
        update: false
      }
    }


    renderWeightTrackGraph = () => {
      return (
              <Col md="12" className='p-2'>
                <Line data={wieghtData}
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
                                fontSize: 12
                              }
                            }
                          ]
                        }
                      }}
                 />
              </Col>
      )
    }

    render(){
        return(
            this.renderWeightTrackGraph()
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