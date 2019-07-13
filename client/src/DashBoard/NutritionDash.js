import React, { Component } from 'react'
import PropTypes from 'prop-types';
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
  CardText, ListGroupItemHeading, ListGroupItemText,
  CardGroup, Label, InputGroupAddon,
  Collapse, CardBody, InputGroup
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

const EMPTY_FOOD_ENTRY = {
  name: '',
  serving: '',
  calories: 0,
  fats: 0,
  protein: 0,
  carb: 0
}

const TOTAL_EMPTY_ENTRY = {
  name: 'Total',
  serving: '',
  serving_label: '',
  calories: 0,
  fats: 0,
  protein: 0,
  carb: 0
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

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

export const formatMealTime = (mealTime, reformat=true) => {
  if (mealTime) {
    let hr = parseInt(mealTime.split(':')[0])
    let min = parseInt(mealTime.split(':')[1])
    let now = new Date()
    now.setHours(hr, min)
    if (hr > 12) {
      hr = hr - 1
    }

    if( !reformat) return now
    else return now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  else return 'No Time Set.'


}

/**
 * Used for a custom cell edit in NutritionDash.
 * Only allow integer entries into the cell.
 */
class NumbersOnlyEntry extends Component {
  static propTypes = {
    value: PropTypes.number,
    onUpdate: PropTypes.func.isRequired
  }

  static defaultProps = {
    value: 0
  }

  getValue() {
    return parseFloat(this.text.value)
  }

  render() {
    const { value, onUpdate, ...rest } = this.props

    return [
      <input
        { ...rest }
        style={{textAlign: 'center', width: '100%', height: '100%'}}
        key="text"
        ref={ node => this.text = node }
        min={0}
        type="number"
      />,
    ]
  }
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
      products: [ TOTAL_EMPTY_ENTRY ],
      resetProducts: [ TOTAL_EMPTY_ENTRY ],
      planProtein:0,
      planCarb:0,
      planFats:0,
      items: [],
      openMeals: true,
      mealsSelected: [],
      newPlan: {day:null, name:null},
      time: null,
      barData: [0,0,0],
      manualEntry: false,
      manualItem: {},
      deleteMeals: false,
      makeNewPlan: false,
      showMealsFor: null,
      deletePlan: null,
      submitPlanDisabled: true,
    }
  }

  componentDidMount = async () => {
    await this.props.fetchProfile()
    await this.props.fetchMeals()
    await this.props.fetchNutritionPlans()
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

    
    //Check if a day, name and all meal times are set before enabling plan submission
    if ( this.state.newPlan.day && this.state.newPlan.name  && this.state.mealsSelected.length > 0 && this.state.submitPlanDisabled) {
        let allTimesSet = true
        for (let meal of this.state.mealsSelected) {
          console.log(meal)
          if (!meal.time) {
            allTimesSet = false
          }
        }
        if (allTimesSet) {
          this.setState({submitPlanDisabled:false})
        }
        
    }

    //Recheck submit conditions if a meal is added or removed from the plan
    if (prevState.mealsSelected.length !== this.state.mealsSelected.length) {
      this.setState({submitPlanDisabled:true})
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

    let newProducts = [...this.state.products]
    newProducts.splice(-1)

    let carbs = 0
    let prot = 0
    let fats = 0
    let cals = 0
    let nutritionCals = 0
    for (let i = 0; i < this.props.userMeals.length; i++) {
      this.props.userMeals[i].items.map(item=>{
        nutritionCals = Number(item.calories) + Number(nutritionCals)
      })
    }

    for (let i = 0; i < newProducts.length; i++) {
      // console.log(this.state.products[i])
      fats = Number(newProducts[i].fats) + Number(fats)
      carbs = Number(newProducts[i].carb) + Number(carbs)
      prot = Number(newProducts[i].protein) + Number(prot)
      cals =
        Number(newProducts[i].calories) + Number(cals)
    }

    //TODO: Add recommended macros to user macros
    // (((this.props.profile.macros.protein / 100) *
    //                     (parseInt(this.props.profile.calories) +
    //                       this.props.profile.currentGoal.value)) /
    //                   4
    //                 ).toFixed(2)

    // console.log('ACTIVE', fats, carbs, prot, cals, this.state.products)
    
    // Replace the total row with the new calculations
    newProducts.push({
      name: 'Total',
      serving: '',
      serving_label: '',
      calories: Math.round(cals),
      fats: Math.round(fats),
      protein: Math.round(prot),
      carb: Math.round(carbs)
    })

    this.setState({products: newProducts, nutritionCals:Math.round(nutritionCals)})
  }

  /**
   * Add a product into a table and perform necessary updates. Or any other
   * side-effect logic.
   */
  addProduct = (product) => {
    // Add the selected product to the list of products
    let newProducts = [...this.state.products]
    newProducts.unshift(product)

    console.log('addProduct', product, newProducts)
    this.setState({products: newProducts}, () => {
      this.calculateTotals()
    })
  }


  /**
   * Check to see if the product already exists.
   * This is a SHALLOW check against only the name
   */
   isOkayToAddProduct = (product) => {
    //console.log('isOkayToAddProduct', product)
    if(!product) return false

    // Existence check
    for(let p of this.state.products){
      if(p.name === product.name) return false
    }

    return true
  }

  addItemButton = () => {
    return (
      <Button
        className="my-2 nutrition-btn"
        disabled={!this.isOkayToAddProduct(this.props.foodSelected)}
        onClick={async () => {
          this.addProduct(this.props.foodSelected)
        }
      }
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

  /**
   * Validate any manual entry appropriately.
   * Name should be alphanumeric
   * Numbers should only be floats.
   */
  manualEntryIsInvalid = (key, value) => {
    //console.log('manualEntryValidate', key, value, typeof(value))
    if(value == undefined || value == null || value === '') return true
    if(key != 'name' && isNaN(value)) return true

    return false
  }

  manualEntryButton = () => {
    return (
      <Button className="my-2 nutrition-btn"
        onClick={async () => this.setState({manualEntry:!this.state.manualEntry})}
      >Manual Entry
      </Button>
    )
  }

  manualItemEditor = () => {
    let fields = []

    // Create input form from empty item keys
    Object.keys(EMPTY_FOOD_ENTRY).map((key,i)=>{
      fields.push(
        <>
          {this.props.windowWidth < 500 ? <Label>{key}</Label> : null}

          <Input key={i} invalid={this.manualEntryIsInvalid(key, this.state.manualItem[key])} value={this.state.manualEntry ? this.state.manualItem[key] : ''}
            onChange={(e)=>addKey(e, key)} placeholder={key} type={key != 'name' ? 'number' : null} min={0} name={key} />
        </>
          )
    })

    // Update object key in state
    let addKey = (e,key) => {
      // Do not allow alphabet for non-name entries
      if(key != 'name' && isNaN(e.target.value)) return

      // Update the item.
      let newItem = this.state.manualItem

      if(key == 'name') newItem[key] = e.target.value
      else newItem[key] = parseFloat(e.target.value)
      this.setState({manualItem:newItem})
    }

    return (
      <>
        <InputGroup className='m-2'>{fields}</InputGroup>
        <Button onClick={()=>{
          let manualItem = this.state.manualItem
          manualItem.manualEntry = true
          this.addProduct(manualItem)
          this.setState({manualEntry:false, manualItem:{}})
        }} color='dark'
         disabled={Object.keys(this.state.manualItem).length != 6 || !this.isOkayToAddProduct(this.state.manualItem)} 
         className='mb-2'>Add To Table</Button>
      </>
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

          // Remove the product.
          let newProducts = [...this.state.products]
          newProducts.splice(this.state.index, 1)

          this.setState({ products: newProducts, rowSelected: false }, () => {
            this.calculateTotals()
          })
        }}
      >
        Remove Item
      </Button>
    )
  }

  /**
   * Button to save meal to user data
   *
   * @memberof NutritionDash
   */
  addMealButton = () => {
    return (
      <Button
        className="my-2 "
        color="dark"
        size="lg" block
        disabled={this.state.products.length > 1? false: true}
        onClick={async () => {
          // Remove the total empty entry from the list of products
          this.state.products.splice(-1)
          await this.props.createNewMeal({items:this.state.products})
 
          this.setState({ products: [ TOTAL_EMPTY_ENTRY ], time:null }, () => {
            // Update the list of meals.
            this.props.fetchMeals()
          })
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
    * Update the macro for the state.
    */
  updateMacros = (newValue, rowIndex) => {
    let i = rowIndex
    let newProducts = [...this.state.products]

    if(newProducts[i].manualEntry)
      return //No updates for manual items

    newProducts[i].fats = ( newProducts[i].baseFats * (Number(newValue) / 3.5)).toFixed(2)
    newProducts[i].carb = ( newProducts[i].baseCarb * (Number(newValue) / 3.5)).toFixed(2)
    newProducts[i].protein = ( newProducts[i].baseProtein * (Number(newValue) / 3.5)).toFixed(2)
    newProducts[i].calories = ( newProducts[i].baseCal * (Number(newValue) / 3.5)).toFixed(2)
    newProducts[i].serving = newValue

    console.log('updateMacros', newValue, rowIndex, newProducts[i])

    this.setState({ products: newProducts, rowSelected: false }, () => {
      this.calculateTotals()
    })
  }

  //TODO: Fix hacky setstate call
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
      await this.props.deleteMeal({ id: i })
      await this.props.fetchMeals()
    }


    let parseMeals = (meal) => {
      let meals = []
      let cals = 0
      let protein = 0
      let carb = 0
      let fats = 0

      //Parse macro info from meals
      meal.items.forEach((item, i) => {
        meals.push(<ListGroupItem className='meal-item truncate' key={i}>{item.name + ' ' +item.serving + ' OZ'}</ListGroupItem>)

        //Count up macros through each iter
        cals = cals+parseInt(item.calories)
        protein = protein + parseInt(item.protein)
        carb = carb + parseInt(item.carb)
        fats = fats + parseInt(item.fats)
      })

      //Add calories to meal card
      meals.push( <ListGroupItem className='meal-item '>Total Calories: {cals}</ListGroupItem>)
      
      return <ListGroup>{meals}</ListGroup>
    }

    return (
              <Row>
                {this.props.userMeals.map((meal , index) => {
                    return (
                      <Col md='6'>
                        <Card body key={index} outline color="dark"
                          className={'m-1 meal-card '}>

                          <CardTitle
                            style={{ fontWeight: 'bold', textAlign: 'center', color: 'black'}} >
                            <span> Meal {index+1}</span>
                            {/* {formatMealTime(meal.time)} */}
                          </CardTitle>

                          {parseMeals(meal)}

                          <Collapse className='text-center' isOpen={this.state.deleteMeals} >
                            <Button color="danger" outline size='sm'
                              onClick={() => removeMeal(meal._id)}
                              className="m-2"> Delete Meal
                            </Button>
                          </Collapse>

                          <Collapse isOpen={this.state.makeNewPlan}> 
                            <Button color="success" outline size='sm'
                              onClick={() => this.setState({mealsSelected:[...this.state.mealsSelected,{meal, index:'Meal '+ (index+1)}] })}
                              className="m-2"
                            >Add to Plan
                            </Button>
                          </Collapse>

                        </Card>
                      </Col>
                    )
                  })
                }
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
        editor: Type.TEXT,
        editable: (cell, row, rowIndex, colIndex) => {
          // console.log(cell, colIndex)
          if (row.name === 'Total') {
            return false
          }
          return true
        }
      },
      {
        dataField: 'serving',
        text: 'Amount(oz)',
        editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => {
          if(row.name === 'Total') return null
          else return <NumbersOnlyEntry { ...editorProps } value={ value } onUpdate={() => {}}/>
        },
        editable: (cell, row, rowIndex, colIndex) => {
          // console.log(row)
          if (row.name === 'Total' || row.manualEntry) {
            return false
          }
  
          return true
        }
      },
      {
        dataField: 'calories',
        text: 'Calories',
        editable: (cell, row, rowIndex, colIndex) => {
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
              console.log('beforeSaveCell', oldValue, newValue, row, column, 'before save log')

              // User did not select any value, preserve the old value.
              if(newValue === '') newValue = oldValue
              if(column.dataField === 'serving' && !isNaN(newValue)) this.updateMacros(newValue, this.state.index)
 
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
    let fullArr = this.state.mealsSelected
    fullArr.splice(i,1)
    this.setState({ mealsSelected:
      [...fullArr]
    })
  }

  /**
   *Renders and creates nutrition plans from meals 
   *
   * @memberof NutritionDash
   */
  renderNutritionPlans = () => {
    let setTime = (e, i) => {
      let newMeal = this.state.mealsSelected[i]
      let newArr = this.state.mealsSelected
      newMeal.time = e.target.value
      newArr[i] = newMeal
      return newArr

    }

    let setValue = (e,key) => {
      let plan = this.state.newPlan
      plan[key] = e.target.value
      this.setState({newPlan:plan})
    }

    let setPlanForDeletion = (i) => {

    }


    let plans = () => {
      //Initial state
      if(this.props.userNutritionPlans.length === 0)
        return (
          <ListGroupItem>
            <ListGroupItemHeading className='text-center'>No nutrition plans created. Create one!</ListGroupItemHeading>
          </ListGroupItem>
        )

      let plans = []
      this.props.userNutritionPlans.map((plan,i)=>{
        plans.push(
          <ListGroupItem key={i}>

            <Collapse isOpen={this.props.profile.activeNutritionPlan === plan._id}>
              <FontAwesomeIcon icon="star" size={'1x'} />
            </Collapse>

            <ListGroupItemHeading className='text-center'>{plan.name} - {plan.day? plan.day: 'N/A'}</ListGroupItemHeading>

            <ButtonGroup size="sm" style={{display:'block', textAlign:'center', marginBottom:'10px'}}>

            <Button className='text-center' color={'dark'}>Set as active plan</Button>

              <Button className='text-center' onClick={()=>{
                this.state.showMealsFor !==null ? this.setState({showMealsFor:null}):
                this.setState({showMealsFor:i})}} >Show Meals</Button>

              <Button onClick={()=>{
                this.setState({deletePlan: this.state.deletePlan === null ? i : this.state.deletePlan !== i ? i : null})
                }} color='warning'> <FontAwesomeIcon icon="trash-alt" size={'1x'} /></Button>
            </ButtonGroup>

            <Collapse className='text-center' isOpen={this.state.deletePlan !== null && this.state.deletePlan===i}>
              <Button onClick={async ()=>{
                await this.props.deleteNutritionPlan({id:plan._id})
                this.props.fetchNutritionPlans()
                }} className='my-2' size='sm' color='danger'>Delete Plan</Button>
            </Collapse>

            <Collapse isOpen={this.state.showMealsFor === i}>
              {plan.scheduleData.map((meal,i)=>{
                return( 
                  <div key={i} style={{border:'1px solid black', borderRadius:'5px', fontSize:'smaller'}}>
                    <ListGroupItemText className='text-center text-black'>{meal.index} - Time: {formatMealTime(meal.time)}</ListGroupItemText>
                    {meal.meal.items.map((item,i)=>{
                      return(
                        <ListGroupItemText className='text-center bg-white text-black' key={i}>
                          {item.name + ' - Serving(oz): '+ item.serving +' - Total Calories: '+ item.calories}
                        </ListGroupItemText>
                      )
                    })}
                    
                  </div>
                )
              })}
            </Collapse>

          </ListGroupItem>
        )
      })
      return plans
      
    }

    return(
      <>
        <h1>Plans</h1>
        <Card className='bg-secondary'>
          <CardBody>

            <ListGroup className='m-3'>
              {plans()}
            </ListGroup>

            <Button color={'dark'} className='text-center' block style={{display:'block'}}
              onClick={()=>this.setState({makeNewPlan:!this.state.makeNewPlan})} >Create New Plan+</Button>

            <Collapse isOpen={this.state.makeNewPlan}>
              <ListGroup className='m-3'>
                <InputGroup className='mb-3'>
                  {/* <Label className='text-white'>Name & Day for Plan (optional)</Label>  */}
                  <Input className='plan-name-input' value={this.state.newPlan.name} onChange={(e)=>setValue(e, 'name')} name={'name'} placeholder='Plan Name*' type='text' />
                  <Input name='day' placeholder='Plan Day' value={this.state.newPlan.day} onChange={(e)=>setValue(e, 'day')} type='select' >
                    <option value={null} >Select a day</option>
                    <option>Daily</option>
                    {days.map((day,i)=>{
                      return <option key={i}>{day}</option>
                    })}
                  </Input>
                </InputGroup>
                {this.state.mealsSelected.map((meal,i) => {
                  return <ListGroupItem><ListGroupItemHeading className='text-center' >{meal.index } </ListGroupItemHeading>
                    <ListGroupItemText>
                      <InputGroup>
                      <Label>Set a time:*</Label> 
                      <Input onChange={(e)=>{this.setState({mealsSelected:setTime(e,i)})}} type='time' />
                        <InputGroupAddon addonType="append">
                          <Button color="danger" onClick={()=>this.removeMealFromPlan(i)}>Remove</Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </ListGroupItemText>
                  </ListGroupItem>
                })}
              </ListGroup>
              <Button className='text-center d-block mt-3 mx-auto' onClick={async()=>{
                await this.props.createNutritionPlan({items:this.state.mealsSelected, ...this.state.newPlan})
                this.setState({newPlan:{}, mealsSelected:[], makeNewPlan:false, submitPlanDisabled:true},
                  ()=>this.props.fetchNutritionPlans())
              }} color='dark' disabled={this.state.submitPlanDisabled} size='lg'>Save Nutrition Plan</Button>
            </Collapse>

          </CardBody>
        </Card>

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
              </Row>
              <Collapse isOpen={this.state.manualEntry}>
                <Row className="align-items-center justify-content-center">
                  {this.manualItemEditor()}
                </Row>
              </Collapse>
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
                
                  <Collapse className='col-md-6 text-center' isOpen={this.state.openMeals}>

                    <Button color={'danger'} outline={this.state.deleteMeals ? false:true} className='my-3' 
                      onClick={()=>this.setState({deleteMeals:!this.state.deleteMeals})} >
                      <FontAwesomeIcon icon="trash-alt" size={'1x'} /></Button>
                    {this.renderMealSchedule()}
                  </Collapse>

                  <Col className='plan-side' md='6'>{this.renderNutritionPlans()}</Col>
                </Row>
                
              </React.Fragment>
            ) : (
              <Row className="my-3">
                <Col md="12">
                  <h1 className='no-meals-badge'>
                    <Badge color="dark">
                      Build some meals to create a nutrition plan!
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
    // console.log(this.state)
    return this.props.profile ? this.renderNutritionTabs() : null
  }
}

const mapStateToProps = state => {
  return {
    terms: state.nutrition.searchList,
    foodSelected: state.nutrition.foodSelected,
    profile: state.auth.userProfile,
    userMeals: state.nutrition.userMeals,
    userNutritionPlans: state.nutrition.userNutritionPlans
  }
}

export default windowSize(
  connect(
    mapStateToProps,
    actions
  )(NutritionDash)
)
