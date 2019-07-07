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
  Collapse
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
  let hr = parseInt(mealTime.split(':')[0])
  let min = parseInt(mealTime.split(':')[1])
  let now = new Date()
  now.setHours(hr, min)
  if (hr > 12) {
    hr = hr - 1
  }

  return now


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
      selected: [],
      time: null,
      barData: [0,0,0]
    }
  }

  componentDidMount = async () => {
    await this.props.fetchProfile()
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
  calculateTotals = () => {
 
    this.state.products.splice(-1)
    let carbs = 0
    let prot = 0
    let fats = 0
    let cals = 0
    let nutritionCals = 0
    for (let i = 0; i < this.props.profile.nutritionSchedule.length; i++) {
      this.props.profile.nutritionSchedule[i].items.map(item=>{
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
    // this.forceUpdate()
  }

  addItemButton = () => {
    return (
      <Button
        className="my-2"
        color={'primary'}
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
          console.log(this.state.products)
          // this.forceUpdate()
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
        <h6 className="text-white">
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
        className="my-2"
        color="danger"
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
        className="my-2"
        color="warning"
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
        className="my-2"
        color="success"
        size="lg" block
        disabled={this.state.time && this.state.products.length > 1? false: true}
        onClick={async () => {
          this.state.products.splice(-1)
          await this.props.updateProfile({
            keys: ['nutritionSchedule'],
            nutritionSchedule: {items:this.state.products, time:this.state.time}
          })
          // await this.props.updateFoodItem({ index: this.state.index })
          // this.calculateTotals()
          this.setState({ products: this.state.resetProducts, time:null })
        }}
      >
        Add Meal
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

  updateMacros = async newValue => {
    let i = this.state.index
    let newRow = this.state.products[i]

    console.log('correct', newValue)
    newRow.fats = (
      this.state.products[i].baseFats *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.carb = (
      this.state.products[i].baseCarb *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.protein = (
      this.state.products[i].baseProtein *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.calories = (
      this.state.products[i].baseCal *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.serving = newValue

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

    this.props.profile.nutritionSchedule.map(meal=>{ 
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
        meals.push(
          <CardText key={i} className="row justify-content-center">
            <React.Fragment>
              <Col md="6"className="truncate text-center">
                <Badge color="light">{item.name}</Badge>
              </Col>
              <Col md="6" className="text-center">
                <Badge color="warning">
                  {item.serving + 'oz'}
                </Badge>
              </Col>
            </React.Fragment>
          </CardText>
        )

        //Count up macros through each iter
        cals = cals+parseInt(item.calories)
        protein = protein + parseInt(item.protein)
        carb = carb + parseInt(item.carb)
        fats = fats + parseInt(item.fats)
      })

      // //Update state
      // // this.updateBar(fats, carb, protein)
      // this.setState((prevState, props) => {
      //   // console.log(props, 'WTF IS PROPS?')
      //   if (prevState.planProtein !== this.state.planProtein) {
      //     return {
      //       planProtein: prevState.planProtein + protein,
      //       planCarb: prevState.planCarb + carb,
      //       planFats: prevState.planFats + fats
      //     }
      //   }
      // })

      //Add calories to meal card
      meals.push(
          <CardText className="row justify-content-center" >
            <Col md='6' className="truncate text-center text-dark">Total Calories:</Col>
            <Col md='6' className="truncate text-center text-dark">{cals}</Col>
          </CardText>
        )
      
      return meals
    }

    return (
      <Row>
        <Col md="12" className="text-left schedule-col">
          <Collapse isOpen={this.state.openMeals}>
            <CardGroup>
             { this.props.profile.nutritionSchedule.map((meal , index) => {
              //  console.log(meal, 'TWO')
                    return (
                      <Card
                        body
                        key={index}
                        className="m-1 meal-card"
                        inverse
                        color="light"
                      >
                        <CardTitle
                          style={{
                            fontWeight: 'bold',
                            textAlign: 'center',
                            color: 'black'
                          }}  
                        >
                        
                        {/* Needs times */}
                          {formatMealTime(meal.time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          {/* {meal.time} */}
                        </CardTitle>
                        {parseMeals(meal)}

                        <Button
                          color="primary"
                          onClick={() => removeMeal(index)}
                          className="m-2"
                        >
                          Remove Meal
                        </Button>
                      </Card>
                    )
                  })
                }
            </CardGroup>
          </Collapse>
        </Col>
      </Row>
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
          type: Type.SELECT,
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
          cellEdit={cellEditFactory({
            mode: 'dbclick',
            blurToSave: true,
            autoSelectText: true,
            beforeSaveCell: async (oldValue, newValue, row, column) => {
              // console.log(newValue, row, 'before save log')


              if (!isNaN(newValue) && newValue !== ' ') {
                this.updateMacros(newValue)
              } else {
                // console.log('send to save')
                await this.props.updateFoodItem({
                  index: this.state.index,
                  replace: row
                })
              }
            },
            onStartEdit: (row, column, rowIndex, columnIndex) => { 
              if (rowIndex !== this.state.index) {
                this.setState({index:rowIndex})
              }
             }
          })}
          selectRow={this.selectRow}
        />
      )
  }

  rowClasses = (row, rowIndex) => {
    if (
      rowIndex === this.state.index &&
      this.state.rowSelected &&
      row.name !== 'Total'
    ) {
      return 'selected-row'
    }
  }

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
        this.rowClasses(rowIndex)
        this.setState({ index: rowIndex, rowSelected: true })
      }
    }
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      // console.log(rowIndex, 'selected')
      if (row.name !== 'Total')
        this.setState({ index: rowIndex, rowSelected: true })
    }
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
              Nutrition Schedule
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
              Nutrition Plan
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
                <Col md='3'><h6 className='text-white mb-0'>Set a meal time</h6>
                  <Input style={{marginBottom:'15px'}} onChange={e => {
                  this.setState({ time: e.target.value })
                  }} placeholder="Set Time" type="time"/>
                </Col>
              </Row>
            </Col>
            {this.renderTable()}
            {this.addMealButton()}
          </TabPane>
          <TabPane tabId="1">
            {this.props.profile.nutritionSchedule.length > 0 ? (
              <React.Fragment>
                <Row className="my-3">
                  <Col md="12">{this.renderMealSchedule()}</Col>
                </Row>
                <Row>
                  {/* <Col md="12">{this.makeSchedule()}</Col> */}
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
        <Col md="8" className=" my-2 text-black bg-white">
          <h5 style={{fontFamily:'Fira Sans, sans-serif'}}>
          Recommended Daily Intake:{' '}
                    {(
                      Number(this.props.profile.calories) +
                      this.props.profile.currentGoal.value
                    ).toFixed()+'cal'} // 
          Your Planned Daily Intake: {this.state.nutritionCals}cal</h5>
          <Bar
            legend={{ position: 'bottom' }}
            data={{
                labels: ['Carbs', 'Protein', 'Fats'],
                datasets: [
                  {
                    data: this.getMealMacros(),
                    backgroundColor: 'rgb(122, 212, 234, 0.4)', //'rgba(255,99,132,0.2)',
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
    // console.log(this.props.profile)
    return this.props.profile ? this.renderNutritionTabs() : null
  }
}

const mapStateToProps = state => {
  return {
    terms: state.nutrition.searchList,
    foodSelected: state.nutrition.foodSelected,
    profile: state.auth.userProfile
  }
}

export default windowSize(
  connect(
    mapStateToProps,
    actions
  )(NutritionDash)
)
