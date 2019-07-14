import React, { Component } from 'react'
// import BootstrapTable from 'react-bootstrap-table-next'
// import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import Moment from 'react-moment'
import * as actions from '../actions'
import { formatMealTime} from './NutritionDash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Card,
  CardTitle,
  CardText,
  CardGroup,
  Button,
  Badge,
  Col, ListGroup, ListGroupItem,
  ListGroupItemHeading, ListGroupItemText,
} from 'reactstrap'


class NextMeal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activePlan: null,
      todaysLog: [],
    }
  }

  async componentDidMount()  {
    await this.props.fetchNutritionPlans()
  }


  renderNextMeal = () => {
  
    let meals = this.props.userNutritionPlans[0].scheduleData //HACK: Set to first plan for developing
    let index = 0

    if (this.props.userNutritionPlans.length > 0) {

      // console.log(this.props)

      meals.sort((a, b) =>
        Math.abs(formatMealTime(a.time, false) - new Date()) > Math.abs(formatMealTime(b.time, false) - new Date())
          ? 1 : Math.abs(formatMealTime(b.time, false )- new Date()) > Math.abs(formatMealTime(a.time, false) - new Date())
          ? -1
          : 0
      )

      let clock = () => {
        let list = []
        // Map the difference between now and meal time for every meal
        meals.map((meal, i)=>{
          list.push( Math.abs(formatMealTime(meal.time, false) - new Date()) )
        })

        // Find the index of the minimum difference, which is the next meal
        if (formatMealTime(meals[list.indexOf(Math.min(...list))].time, false) > new Date()) {
          index = list.indexOf(Math.min(...list))
          return formatMealTime(meals[index].time, false)
          
        } else {
          index = list.length -1//list.indexOf(Math.min(...list)) 
          return formatMealTime(meals[index].time, false)
        }
        
      }


      let logger = () =>{
        let day = new Date()
        for (let log of  this.props.userNutritionPlans[0].log) {
          if (new Date(log.timestamp).toDateString() === day.toDateString() && log.id === meals[index].meal._id) {
              // let todaysLog = this.state.todaysLog
              // todaysLog.push(log)
              // this.setState({todaysLog:todaysLog})
              return <FontAwesomeIcon style={{color:'limegreen', marginTop:'10px'}} icon="check-circle" size={'3x'} />
          } 

        }
          

        return (
          <Button color="dark" className="m-2"
            // disabled={()=>}
            onClick={async () => {
              await this.props.logMealComplete({
                log:{id:meals[index].meal._id, timestamp:new Date()},
                id:this.props.userNutritionPlans[0]._id
              })
              await this.props.fetchNutritionPlans() 
              }} >
            Mark Complete
          </Button>
        )
      }




      // console.log(meals[index])
      let sortedMeals = meals

      return (
        <>
          <Col md="12">
          <h6>Next Meal Time: <Moment format="LT">{clock()}</Moment></h6>
            <ListGroup >
              <ListGroupItemHeading>{meals[index].index}</ListGroupItemHeading>
              {sortedMeals[index].meal.items.map((item, i) => {
                return (
                  <ListGroupItem key={i} style={{fontSize:'15px', padding:'10px', marginBottom:0}}>
                    <ListGroupItemText className='mb-0'>
                      {item.serving}oz of {item.name}
                    </ListGroupItemText>
                  </ListGroupItem>
                )
              })}
            </ListGroup>
          </Col>
          {logger()}
        </>
      )
    } 
    else {
      return (
        (
          <CardText className="row">
            <Col >
                  {' '}
                  Looks like you haven't created a nutrition plan yet?<br/>
                 <Link to='/dashboard/nutrition'><Button color={'dark'}> Lets go make one!</Button></Link>
            </Col>
          </CardText>
        )
      )
    }
  }

  render() {
    console.log(this.state)
    return this.props.userNutritionPlans.length > 0 ? this.renderNextMeal() : null
  }
}

const mapStateToProps = state => {
  return {
    profile: state.auth.userProfile,
    userNutritionPlans: state.nutrition.userNutritionPlans
  }
}

export default connect(
  mapStateToProps,
  actions
)(NextMeal)
