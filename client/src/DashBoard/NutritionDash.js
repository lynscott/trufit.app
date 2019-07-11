import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import {
  Col,
  Input,
  Button,
  Table,
  Row,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Badge,
  ButtonGroup,
  ButtonToolbar,
  ListGroup,
  ListGroupItem,
  Card,
  CardTitle,
  CardText,
  CardGroup,
  Collapse, CardBody
} from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Select from 'react-select'
import './NutritionDash.scss'
import { Type } from 'react-bootstrap-table2-editor'
import cellEditFactory from 'react-bootstrap-table2-editor'
import classnames from 'classnames'
import { Pie, Doughnut, HorizontalBar, Bar } from 'react-chartjs-2'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import windowSize from 'react-window-size'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const barOptions = {
  legend: {
    display: false
  },

  scales: {
    gridLines: {
      color: 'rgb(255, 255, 255, 0.7)'
    },
    yAxes: [
      {
        ticks: {
          //  beginAtZero:true,
          fontColor: 'black',
          fontSize: 15,
          min: 0
        }
      }
    ],
    xAxes: [
      {
        ticks: {
          fontColor: 'black',
          fontSize: 15
        }
      }
    ]
  }
}

export const formatMealTime = (mealTime) => {
  if (mealTime) {
    let hr = parseInt(mealTime.split(':')[0])
    let min = parseInt(mealTime.split(':')[1])
    let now = new Date()
    now.setHours(hr, min)
    if (hr > 12) {
      hr = hr - 1
    }

    return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  else return 'No Time Set.'


}

class NutritionDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serving: 1,
      rowSelected: false,
      index: 0,
      nutritionCals: 0,
      
      activeTab: '1',
      products: [
        {
          name: 'Total',
          serving: '',
          serving_label: '',
          calories: 0,
          fats: 0,
          protein: 0,
          carb: 0
        }
      ],
      resetProducts: [
        {
          name: 'Total',
          serving: '',
          serving_label: '',
          calories: 0,
          fats: 0,
          protein: 0,
          carb: 0
        }
      ],
      planProtein:0,
      planCarb:0,
      planFats:0,
      items: [],
      openMeals: true,
      mealsSelected: [],
      time: null,
      barData: [0,0,0]
    }
  }

  componentDidMount = async () => {
    await this.props.fetchProfile()
    await this.props.fetchMeals()
    this.calculateTotals()
  }

  componentWillUnmount = () => {
    if (this.state.nutritionCals !== 0 && this.state.nutritionCals !== this.props.profile.nutritionCals) {
      this.props.updateProfile({keys:['nutritionCalories'], nutritionCalories:this.state.nutritionCals})
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.nutritionCals !== this.state.nutritionCals) {
      this.forceUpdate()
    }

    if (prevProps.windowWidth !== this.props.windowWidth) {
      this.forceUpdate()
    }
  }

  /****************************************
   * HELPER FUNCTIONS *********************
   ****************************************/
  /**
   * Calculate the total macros by iterating through the products.
   */
  calculateTotals = () => {
    // Remove the total row
    this.state.products.splice(-1)


    let carbs = 0
    let prot = 0
    let fats = 0
    let cals = 0
    let nutritionCals = 0
    for (let i = 0; i < this.props.userMeals.length; i++) {
      this.props.userMeals[i].items.map(item=>{
        // fats = Number(item.fats) + Number(fats)
        // carbs = Number(item.carb) + Number(carbs)
        // prot = Number(item.protein) + Number(prot)
        nutritionCals = Number(item.calories) + Number(nutritionCals)
      })
    }

    for (let i = 0; i < this.state.products.length; i++) {
      // console.log(this.state.products[i])
      fats = Number(this.state.products[i].fats) + Number(fats)
      carbs = Number(this.state.products[i].carb) + Number(carbs)
      prot = Number(this.state.products[i].protein) + Number(prot)
      cals =
        Number(this.state.products[i].calories) + Number(cals)
      
    }

    //TODO: Add recommended macros to user macros
    // (((this.props.profile.macros.protein / 100) *
    //                     (parseInt(this.props.profile.calories) +
    //                       this.props.profile.currentGoal.value)) /
    //                   4
    //                 ).toFixed(2)

    // console.log('ACTIVE', fats, carbs, prot, cals, this.state.products)
    
    // Replace the total row with the new calculations
    this.state.products.push({
      name: 'Total',
      serving: '',
      serving_label: '',
      calories: Math.round(cals),
      fats: Math.round(fats),
      protein: Math.round(prot),
      carb: Math.round(carbs)
    })

    this.setState({nutritionCals:Math.round(nutritionCals)})
  }

  addItemButton = () => {
    return (
      <Button
        className="my-2 nutrition-btn"
        // color={'primary'}
        disabled={this.props.foodSelected ? false : true}
        onClick={async () => {
          // await this.props.updateProfile({
          //   keys: ['nutritionItems'],
          //   nutritionItems: this.props.foodSelected
          // })
          this.setState(() => {
            this.state.products.unshift(this.props.foodSelected)
            this.calculateTotals()
          })

        }}
      >
        Add Food Item
      </Button>
    )
  }

  selectFoodItem = () => {
    return (
      <React.Fragment>
        <Select
          options={this.props.terms}
          placeholder="Search for a food item"
          className="workout-selector__field form-group col"
          classNamePrefix="workout-selector"
          onChange={value => {
            // console.log(value)
            this.props.foodSelect(value.value)
          }}
          onInputChange={value => {
            // console.log(value)
            this.props.foodSearch(value)
          }}
        />
        <h6 className="text-black">
          Nutrition Data Provided by the USDA Food Database
        </h6>
      </React.Fragment>
    )
  }

  manualEntryButton = () => {
    let emtpyItem = {
      name: 'Enter a name for the item',
      serving_label: 'Enter a serving',
      serving: 0,
      calories: 0,
      fats: 0,
      carb: 0,
      protein: 0,
      id: 'manual'
    }

    return (
      <Button
        className="my-2 nutrition-btn"
        // color="danger"
        onClick={async () => {
          await this.props.updateProfile({
            keys: ['nutritionItems'],
            nutritionItems: emtpyItem
          })
          // this.forceUpdate()
        }}
      >
        Manual Entry
      </Button>
    )
  }

  removeItemButton = () => {
    return (
      <Button
        className="my-2 nutrition-btn"
        // color="warning"
        disabled={!this.state.rowSelected}
        onClick={async () => {
          await this.props.updateFoodItem({ index: this.state.index })
          this.calculateTotals()
          this.setState({ rowSelected: false })
        }}
      >
        Remove Item
      </Button>
    )
  }

  addMealButton = () => {
    return (
      <Button
        className="my-2 "
        color="dark"
        size="lg" block
        disabled={this.state.products.length > 1? false: true}
        onClick={async () => {
          this.state.products.splice(-1)
          // await this.props.updateProfile({
          //   keys: ['nutritionSchedule'],
          //   nutritionSchedule: {items:this.state.products, time:this.state.time}
          // })
          await this.props.createNewMeal({items:this.state.products})
          // await this.props.updateFoodItem({ index: this.state.index })
          // this.calculateTotals()
          this.setState({ products: this.state.resetProducts, time:null })
        }}
      >
        Create Meal
      </Button>
    )
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }


  /******************
   * UPDATE MACROS  *
   ******************/

   /**
    * Update the macro for the state
    */
  updateMacros = (newValue, rowIndex) => {
    let i = rowIndex
    let newProducts = {... this.state.products }

    console.log('correct', newValue)
    newProducts[i].fats = ( newProducts[i].baseFats * (Number(newValue) / 3.5)).toFixed(2)
    newProducts.carb = ( newProducts[i].baseCarb * (Number(newValue) / 3.5)).toFixed(2)
    newProducts.protein = ( newProducts[i].baseProtein * (Number(newValue) / 3.5)).toFixed(2)
    newProducts.calories = ( newProducts[i].baseCal * (Number(newValue) / 3.5)).toFixed(2)
    newProducts.serving = newValue

    this.setState({ rowSelected: false })
    this.calculateTotals()
  }


  updateBar = (fats, carb, protein) => {
    this.setState({},() => {
      this.state.planProtein = this.state.planProtein + protein
      this.state.planCarb = this.state.planCarb + carb
      this.state.planFats = this.state.planFats + fats
      // console.log(this.state.planProtein, this.state.planCarb)
    })
  }

  getMealMacros = () => {
    let cals = 0
    let protein = 0
    let carb = 0
    let fats = 0

    this.props.userMeals.map(meal=>{ 
      meal.items.map(item=>{
        //Count up macros through each iter
        cals = cals+parseInt(item.calories)
        protein = protein + parseInt(item.protein)
        carb = carb + parseInt(item.carb)
        fats = fats + parseInt(item.fats)
      })
    })
    
    return (
      [
        Math.round(carb),
        Math.round(protein),
        Math.round(fats),
      ]
    )
  }


  renderMealSchedule = () => {

    let removeMeal = async i => {
      await this.props.updateFoodItem({ removeSchedule: i })
    }


    let parseMeals = (meal) => {
      let meals = []
      let cals = 0
      let protein = 0
      let carb = 0
      let fats = 0

      //Parse macro info from meals
      meal.items.forEach((item, i) => {
        meals.push(<ListGroupItem className='meal-item' key={i}>{item.name + ' '+ item.serving + ' OZ'}</ListGroupItem>)

        //Count up macros through each iter
        cals = cals+parseInt(item.calories)
        protein = protein + parseInt(item.protein)
        carb = carb + parseInt(item.carb)
        fats = fats + parseInt(item.fats)
      })

      //Add calories to meal card
      meals.push( <ListGroupItem className='meal-item'>Total Calories: {cals}</ListGroupItem>)
      
      return <ListGroup>{meals}</ListGroup>
    }

    return (
      // <Row>
      //   <Col md="12" className=" schedule-col">
            <CardGroup className=" schedule-col">
             { this.props.userMeals.map((meal , index) => {
              //  console.log(meal, 'TWO')
                    return (
                      <Card
                        body
                        key={index}
                        className={this.state.selectedMeal === index? "m-1 meal-card selected" : "m-1 meal-card "}
                        // onClick={()=>this.setState({selectedMeal:index})}
                        // inverse
                        // color="light"
                      >
                        <CardTitle
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'black'
                          }}  
                        >
                        
                        {/* Needs times */} <span> Meal {index+1}</span>
                          {/* {formatMealTime(meal.time)} */}
                        </CardTitle>
                        {parseMeals(meal)}

                        <Button
                          color="danger"
                          outline
                          size='sm'
                          // onClick={() => removeMeal(index)}
                          className="m-2"
                        >
                          Delete Meal
                        </Button>
                        <Button
                          color="success"
                          outline
                          size='sm'
                          onClick={() => this.setState({mealsSelected:[...this.state.mealsSelected,{meal, index:'Meal '+ (index+1)}] })}
                          className="m-2"
                        >
                          Add to Plan
                        </Button>
                      </Card>
                    )
                  })
                }
            </CardGroup>
    )
  }

  renderTable = () => {
    let makeArray = () => {
      let list = [...Array(12).keys()].map(value => {
        // console.log(value, 'here')
        return {
          value: value + 1,
          label: value + 1
        }
      })
      return list
    }

    let columns = [
      {
        dataField: 'name',
        text: 'Food Item',
        editable: (cell, row, rowIndex, colIndex) => {
          // console.log(cell, colIndex)
          if (row.name === 'Total') {
            return false
          }
          return true
        }
      },
      // {
      //   dataField: 'serving_label',
      //   text: 'Serving',
      //   editable: (cell, row, rowIndex, colIndex) => {
      //     if (rowIndex === this.row.name === 'Total'.length) {
      //       return false
      //     }
      //     return true
      //   }
      // },
      {
        dataField: 'serving',
        text: 'Amount(oz)',
        editor: {
          type: Type.TEXT,
          options: makeArray()
        },
        editable: (cell, row, rowIndex, colIndex) => {
          // console.log(row)
          if (row.name === 'Total') {
            return false
          }
          return true
        }
      },
      {
        dataField: 'calories',
        text: 'Calories',
        editable: (cell, row, rowIndex, colIndex) => {
          // console.log(cell, row)
          if (row.id === 'manual') {
            return true
          }
          return false
        }
      },
      {
        dataField: 'fats',
        text: 'Fats (g)',
        editable: (cell, row, rowIndex, colIndex) => {
          return false
        }
      },
      {
        dataField: 'carb',
        text: 'Carbs (g)',
        editable: (cell, row, rowIndex, colIndex) => {
          return false
        }
      },
      {
        dataField: 'protein',
        text: 'Protein (g)',
        editable: (cell, row, rowIndex, colIndex) => {
          return false
        }
      }
    ]

      return (
        <BootstrapTable
          keyField="name"
          bordered={true}
          hover={true}
          condensed={false}
          bootstrap4={true}
          data={this.state.products}
          columns={columns}
          rowClasses={this.rowClasses}
          classes={
            this.props.windowWidth < 500 === true
              ? 'table-mobile bg-light'
              : 'bg-light'
          }
          cellEdit={
            cellEditFactory({
            mode: 'dbclick',
            blurToSave: true,
            autoSelectText: true,
            beforeSaveCell: (oldValue, newValue, row, column) => {
              console.log('beforeSaveCell', oldValue, newValue, row, 'before save log')

              // User did not select any value, preserver the old value.
              if(newValue === "") newValue = oldValue

              /*
              if (!isNaN(newValue) && newValue !== ' ') {
                this.updateMacros(newValue, this.state.index)
              } */
              
              /*
              else {
                // console.log('send to save')
                await this.props.updateFoodItem({
                  index: this.state.index,
                  replace: row
                })
              }*/
            },
             afterSaveCell: (oldValue, newValue, row, column) => {
               console.log('afterSaveEdit', row)
            },
            onStartEdit: (row, column, rowIndex, columnIndex) => { 
              console.log('onStartEdit', row, rowIndex)
              if (rowIndex !== this.state.index) {
                this.setState({index:rowIndex})
              }
             }
          })}
          selectRow={this.selectRow}
        />
      )
  }

  /**
   * Builds the corresponding CSS class name for the selected row.
   */
  rowClasses = (row, rowIndex) => {
    if (
      rowIndex === this.state.index &&
      this.state.rowSelected &&
      row.name !== 'Total'
    ) {
      return 'selected-row'
    }
  }

  /**
   * Dictates the behavior of a row when it has been selected.
   */
  selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectColumn: true,
    clickToEdit: true,
    nonSelectable: [
      // this.props.profile ? this.row.name === 'Total'.length : ''
    ],
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log(rowIndex, 'INDEX')
      if (row.name !== 'Total') {
        this.setState({ index: rowIndex, rowSelected: true })
      }
    }
  }

  /**
   * Not currently being used.
   */
  rowEvents = {
    onClick: (e, row, rowIndex) => {
      // console.log(rowIndex, 'selected')
      if (row.name !== 'Total')
        this.setState({ index: rowIndex, rowSelected: true })
    }
  }

  removeMealFromPlan = (i) => {
    console.log(this.state.mealsSelected, i)
    let fullArr = this.state.mealsSelected
    fullArr.splice(i,1)
    this.setState({ mealsSelected:
      [...fullArr]
    })
  }

  renderNutritionPlans = () => {
    console.log(this.state.mealsSelected)
    return(
      <>
        <h1>Plans</h1>
        <Card className='bg-secondary'>
          <CardBody>
            + Add Plan
            <ListGroup>
              {this.state.mealsSelected.map((meal,i) => {
                return <ListGroupItem><span className='mx-3'>{meal.index } Set a time:</span> 
                <input className='mx-3' type='time' /> 
                <FontAwesomeIcon className='mx-3' onClick={()=>this.removeMealFromPlan(i)} icon="minus-circle" size={'1x'} /></ListGroupItem>
              })}
            </ListGroup>
          </CardBody>
        </Card>
        <Button color='dark'>Save Meal</Button>
      </>
    )
  }


  renderNutritionTabs = () => {
    return (
      <Col className="bg-light" style={{ paddingTop: '10px', maxHeight: this.props.windowWidth < 500 ? '80vh' : '100vh',
      overflowY: 'scroll' }} md="10">
        {this.displayMacros()}
        <Nav tabs className='tab-nav'>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
              style={{ textTransform: 'none' }}
            >
              Plan Builder
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => {
                this.toggle('2')
              }}
              style={{ textTransform: 'none' }}
            >
              Meal Builder
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane className="mt-4" tabId="2">
            <Col md="12">
              <Row className="justify-content-center">
                <Col md="6">{this.selectFoodItem()}</Col>
              </Row>
              <Row className="align-items-center justify-content-center">
                <Col md="3">{this.addItemButton()}</Col>
                <Col md="3">{this.manualEntryButton()}</Col>
                <Col md="3">{this.removeItemButton()}</Col>
                {/* <Col md='3'><h6 className='text-white mb-0'>Set a meal time</h6>
                  <Input style={{marginBottom:'15px'}} onChange={e => {
                  this.setState({ time: e.target.value })
                  }} placeholder="Set Time" type="time"/>
                </Col> */}
              </Row>
            </Col>
            {this.renderTable()}
            {this.addMealButton()}
          </TabPane>
          <TabPane tabId="1" className='text-left'>
            {this.props.userMeals.length > 0 ? (
              <React.Fragment>
               <Button color={'dark'} className='mt-4' onClick={()=>this.setState({openMeals:!this.state.openMeals})}
                  >{this.state.openMeals ? 'Hide Meals':'Show Meals'}</Button>
                <Row className="my-3 justify-content-center">
                
                <Collapse isOpen={this.state.openMeals}>
                  <Col className='meal-side' >{this.renderMealSchedule()}</Col>
                </Collapse>
                  <Col className='plan-side' >{this.renderNutritionPlans()}</Col>
                </Row>
                
              </React.Fragment>
            ) : (
              <Row className="my-3">
                <Col md="12">
                  <h1 className='no-meals-badge'>
                    <Badge color="info">
                      Create a nutrition plan to schedule some meals!
                    </Badge>
                  </h1>
                </Col>
              </Row>
            )}
          </TabPane>
        </TabContent>
      </Col>
    )
  }

  displayMacros = () => {
    return (
      <Row className="justify-content-center py-2 bg-white">
        {/* <Col md="6" className="align-self-center text-white my-2">
  
          <CardText style={{margin:0}}>
          Body-Type you identified as: {this.props.profile.baseSomaType.type}
          </CardText>
  

          <h5 style={{fontFamily:'Fira Sans, sans-serif'}}>Recommended Daily Intake:{' '}
                    {(
                      Number(this.props.profile.calories) +
                      this.props.profile.currentGoal.value
                    ).toFixed()+'cal'}
                </h5>
          <ButtonToolbar>
            <ButtonGroup>
              <Button>
                <h5>
                  <Badge color="primary">
                    Protein:{' '}
                    {(
                      ((this.props.profile.macros.protein / 100) *
                        (parseInt(this.props.profile.calories) +
                          this.props.profile.currentGoal.value)) /
                      4
                    ).toFixed(2)}
                    g
                  </Badge>
                </h5>
              </Button>
              <Button>
                <h5>
                  <Badge color="primary">
                    Carbs:{' '}
                    {(
                      ((this.props.profile.macros.carb / 100) *
                        (parseInt(this.props.profile.calories) +
                          this.props.profile.currentGoal.value)) /
                      4
                    ).toFixed(2)}
                    g
                  </Badge>
                </h5>
              </Button>
              <Button>
                <h5>
                  <Badge color="primary">
                    Fats:{' '}
                    {(
                      ((this.props.profile.macros.fat / 100) *
                        (parseInt(this.props.profile.calories) +
                          this.props.profile.currentGoal.value)) /
                      9
                    ).toFixed(2)}
                    g
                  </Badge>
                </h5>
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </Col> */}
        <Col md="6" className=" my-2 text-black bg-white">
          <h5 style={{fontFamily:'Fira Sans, sans-serif'}}>
          Recommended Daily Intake:{' '}
                    {(
                      Number(this.props.profile.calories) +
                      this.props.profile.currentGoal.value
                    ).toFixed()+'cal'} <br/> 
          Your Planned Daily Intake: {this.state.nutritionCals}cal</h5>
          <Bar
            legend={{ position: 'bottom' }}
            data={{
                labels: ['Carbs', 'Protein', 'Fats'],
                datasets: [
                  {
                    data: this.getMealMacros(),
                    backgroundColor: 'rgb(0, 0, 0, 0.4)', //'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,255,255,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.2)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    label: '(g)'
                  }
                ]
            }}
            options={barOptions}
          />
        </Col>
      </Row>
    )
  }


  render() {
    // console.log(this.props.userMeals)
    return this.props.profile ? this.renderNutritionTabs() : null
  }
}

const mapStateToProps = state => {
  return {
    terms: state.nutrition.searchList,
    foodSelected: state.nutrition.foodSelected,
    profile: state.auth.userProfile,
    userMeals: state.nutrition.userMeals
  }
}

export default windowSize(
  connect(
    mapStateToProps,
    actions
  )(NutritionDash)
)
