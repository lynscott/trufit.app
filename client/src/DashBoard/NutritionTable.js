import React, { Component } from 'react'
// import BootstrapTable from 'react-bootstrap-table-next'
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { connect } from 'react-redux'
import Moment from 'react-moment'
import * as actions from '../actions'
import {
  Card,
  CardTitle,
  CardText,
  CardGroup,
  Button,
  Badge,
  Col
} from 'reactstrap'

const products = [
  { meal: 'Meal 1', fats: 20, carb: 50, protein: 100, total: 300 },
  { meal: 'Meal 2', fats: 30, carb: 70, protein: 200, total: 300 },
  { meal: 'Meal 3', fats: 10, carb: 10, protein: 100, total: 300 }
]
const columns = [
  {
    dataField: 'meal',
    text: 'Meal'
  },
  {
    dataField: 'fats',
    text: 'Fats (g)'
  },
  {
    dataField: 'carb',
    text: 'Carbs (g)'
  },
  {
    dataField: 'protein',
    text: 'Protein (g)'
  },
  {
    dataField: 'total',
    text: 'Total'
  }
]

class NextMeal extends Component {
  componentDidUpdate = (prevProps, prevState) => {
    // if (this.pr) {
    // }
  }

  renderNextMeal = () => {
    let times = this.props.profile.nutritionSchedule
    let index = 0

    if (this.props.profile.nutritionSchedule.length > 0) {
      for (let i = 0; i < times.length; i++) {
        let oldTime = new Date(times[i].time)
        let todayTime = new Date()
        todayTime.setHours(oldTime.getHours(), oldTime.getMinutes())
        times[i].time = todayTime
        // console.log(this.props.profile.nutritionSchedule[i].time)
      }
      times.sort((a, b) =>
        Math.abs(a.time - new Date()) > Math.abs(b.time - new Date())
          ? 1
          : Math.abs(b.time - new Date()) > Math.abs(a.time - new Date())
          ? -1
          : 0
      )
      // console.log(times)

      let clock = timeArray => {
        if (timeArray[0].time > new Date()) {
          index = 0
          return timeArray[0].time
        } else {
          index = timeArray.length - 1
          return timeArray[timeArray.length - 1].time
        }
      }
      return (
        <React.Fragment>
          <h6 style={{ margin: 0, fontSize:'15px' }}>
            Next Meal Time: <Moment format="LT">{clock(times)}</Moment>
          </h6>
          {/* // </CardTitle> */}
          <Col md="12">
          {this.props.profile.nutritionSchedule[index].items.map((item, i) => {
            return (
              <CardText key={i} style={{fontSize:'15px', padding:'10px', marginBottom:0}}>
                  {item.serving}oz of {item.name}
              </CardText>
            )
          })}
          </Col>
          <Button
            color="primary"
            // onClick={() => removeMeal(index)}
            className="m-2"
          >
            Mark Complete
          </Button>
        </React.Fragment>
      )
    } else {
      return (
        <CardText className="row">
          <Col md="6">
            <h5>
              <Badge color="dark" style={{ whiteSpace: 'normal' }}>
                {' '}
                No Meals Scheduled Yet!
              </Badge>
            </h5>
          </Col>
          <Col md="6">
            <h5>
              <Badge color="info" style={{ whiteSpace: 'normal' }}>
                Have you created a nutrition plan?
              </Badge>
            </h5>
          </Col>
        </CardText>
      )
    }
  }

  render() {
    // console.log(this.props.profile)
    return this.props.profile ? this.renderNextMeal() : null
  }
}

const mapStateToProps = state => {
  return {
    profile: state.auth.userProfile
  }
}

export default connect(
  mapStateToProps,
  actions
)(NextMeal)
