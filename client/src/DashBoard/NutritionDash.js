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
  Container,
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
import { Pie, Doughnut, HorizontalBar } from 'react-chartjs-2'
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd'
import windowSize from 'react-window-size'

const recommendedMacros = 1800


// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone

  return result
}

class NutritionDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serving: 1,
      rowSelected: false,
      index: 0,
      horizontalBarData: {
        labels: ['Carbs', 'Protein', 'Fats'],
        datasets: [
          {
            data: [100, 250, 75],
            backgroundColor: 'rgba(255,99,132,0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            hoverBorderColor: 'rgba(255,99,132,1)',
            label: '(g)',
          }
        ]
      },
      doughnutData: {
        labels: ['Carbs', 'Protein', 'Fats'],
        datasets: [
          {
            data: [100, 250, 75],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      },
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
      items: [],
      openMeals: true,
      selected: [],
      time: null
    }
  }

  componentDidMount = async () => {
    await this.props.fetchProfile()
    this.calculateTotals()
  }

  componentDidUpdate = (prevProps, prevState) => {
    //TODO: replace this with new nutrition list props
    let names = this.props.profile
      ? this.props.profile.nutritionSchedule.map(item => {
          return item.items
        })
      : null
    if (prevProps.profile !== this.props.profile) {
      this.setState(() => {
        this.state.items = this.props.profile.nutritionItems.filter(
          (item, index) => {
            let isMatch = false
            if (names.length > 0) {
              for (let i = 0; i < names.length; i++) {
                for (let j = 0; j < names[i].length; j++) {
                  if (names[i][j].id === item.id) {
                    isMatch = true // skip
                    continue
                  }
                }
              }
              if (isMatch) {
                return false
              }
              return true
            } else {
              return true
            }
          }
        )
      })
      // this.forceUpdate()
      this.calculateTotals()
    }

    if (prevProps.windowWidth !== this.props.windowWidth) {
      this.forceUpdate()
    }
  }

  updateMacros = async newValue => {
    let i = this.state.index
    let newRow = this.props.profile.nutritionItems[i]

    console.log('correct', newValue)
    newRow.fats = (
      this.props.profile.nutritionItems[i].baseFats *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.carb = (
      this.props.profile.nutritionItems[i].baseCarb *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.protein = (
      this.props.profile.nutritionItems[i].baseProtein *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.calories = (
      this.props.profile.nutritionItems[i].baseCal *
      (Number(newValue) / 3.5)
    ).toFixed(2)
    newRow.serving = newValue

    await this.props.updateFoodItem({
      index: this.state.index,
      replace: newRow
    })
    this.setState({rowSelected:false})
    this.calculateTotals()
  }

  id2List = {
    foodlist: 'items',
    schedule_1: 'selected'
  }

  getList = id => this.state[this.id2List[id]]

  onDragEnd = result => {
    const { source, destination } = result
    // console.log(source.index, source)

    // dropped outside the list
    if (!destination) {
      return
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        this.getList(source.droppableId),
        source.index,
        destination.index
      )

      let state = { [this.id2List[source.droppableId]]: items }

      this.setState(state)
    } else {
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )
      // console.log(result)

      this.setState({
        [this.id2List[source.droppableId]]: result[source.droppableId],
        [this.id2List[destination.droppableId]]: result[destination.droppableId]
      })
    }
  }

  makeSchedule = () => {
    // console.log(this.state)

    let getItemStyle = (isDragging, draggableStyle) => ({
      // some basic styles to make the items look a bit nicer
      userSelect: 'none',
      padding: 5,
      margin: `0 0 ${8}px 0`,
      color: 'white',
      borderRadius: '5px',
      boxShadow: 'grey 3px 5px 2px 3px',
      border: '2px solid white',

      // change background colour if dragging
      background: isDragging
        ? 'lightgreen'
        : 'linear-gradient(135deg, grey, #008ed6 70%)',
      // backgroundImage: 'linear-gradient(to top, rgba(0, 0, 0, 0, 1), #008ed6)',

      // styles we need to apply on draggables
      ...draggableStyle
    })

    let draggableFoodItems = () => {
      let names = this.props.profile
        ? this.props.profile.nutritionSchedule.map(item => {
            return item.items
          })
        : null
      return this.props.profile
        ? this.state.items
            .filter((item, index) => {
              let isMatch = false
              if (names.length > 0) {
                for (let i = 0; i < names.length; i++) {
                  for (let j = 0; j < names[i].length; j++) {
                    if (names[i][j].id === item.id) {
                      isMatch = true // skip
                      continue
                    }
                  }
                }
                if (isMatch) {
                  return false
                }
                return true
              } else {
                return true
              }
            })
            .map((item, index) => (
              <Draggable key={index} draggableId={item.name} index={index}>
                {(provided, snapshot) => (
                  // <Row>
                  // <ListGroupItem color='dark' tag="button" action>
                  <div
                    className="col-md-12 p-2 my-2"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.draggableProps.style
                    )}
                  >
                    <p>{item.name}</p>
                    <p style={{ display: 'inline' }}>
                      {'Serving: ' + item.serving + 'oz'}
                    </p>
                  </div>
                  // </ListGroupItem>
                  // </Row>
                )}
              </Draggable>
            ))
        : null
    }

    let saveMealTime = async time => {
      let makeTime = timeString => {
        let date = new Date()
        date.setHours(timeString.split(':')[0])
        date.setMinutes(timeString.split(':')[1])
        return date
      }

      await this.props.updateFoodItem({
        schedule: {
          time: makeTime(this.state.time),
          items: this.state.selected
        }
      })
      this.setState({ selected: [], meal: null })
    }

    let foodList = () => {
      return (
        // <Col md="6" className='py-2'>
        <Droppable droppableId="foodlist">
          {(provided, snapshot) => (
            // <Row>
            <Col md="6" className="py-2">
              <div //className='col-md-6 py-2'
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? 'blue'
                    : 'lightgrey',
                  borderRadius: '8px'
                }}
                {...provided.droppableProps}
              >
                <h5 style={{fontWeight:'lighter'}}>Select Items For Meal:</h5>
                {draggableFoodItems()}
                {provided.placeholder}
              </div>
            </Col>
          )}
        </Droppable>
        // </Col>
      )
    }

    let schedule = () => {
      return (
        <Col md="6" className="py-2">
          <Droppable droppableId="schedule_1">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  backgroundColor: snapshot.isDraggingOver
                    ? 'lightblue'
                    : 'grey',
                  borderRadius: '8px'
                }}
                {...provided.droppableProps}
              >
                <Row className="align-items-center py-2">
                  <Col md="6">
                    
                    <Button
                      onClick={() => saveMealTime()}
                      disabled={
                        this.state.selected.length === 0 ||
                        this.state.time === null
                          ? true
                          : false
                      }
                      className="my-2"
                      color="success"
                    >
                      Save Meal
                    </Button>
                  {/* </Col>
                  <Col md="4" position='middle'> */}
                    
                  </Col>
                  <Col md="6">
                  <h5 style={{fontWeight:'lighter', color:'white', display:'inline'}}>Set Time:</h5>
                    <Input
                      onChange={e => {
                        console.log(e.target.value)
                        this.setState({ time: e.target.value })
                      }}
                      placeholder='Set Time'
                      // style={{maxWidth:'fit-content'}}
                      type="time"
                    />
                  </Col>
                </Row>
                {this.state.selected.map((item, index) => (
                  <Draggable key={index} draggableId={item.name} index={index}>
                    {(provided, snapshot) => (
                      // <ListGroupItem tag="button" action>
                      <div
                        className="p-2 bg-dark"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item.name}
                        <br />
                        <br />
                        {'Serving: ' + item.serving + 'oz'}
                      </div>
                      // </ListGroupItem>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Col>
      )
    }

    //Groups of food items as meals with times, could be a form element
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Row className="my-4">
          {schedule()}
          {foodList()}
        </Row>
      </DragDropContext>
    )
  }

  renderMealSchedule = () => {
    let removeMeal = async i => {
      await this.props.updateFoodItem({ removeSchedule: i })
    }

    return (
      <Row>
        <Col md="12" className="text-left">
          <Button
            color="info"
            className="my-2"
            onClick={() => this.setState({ openMeals: !this.state.openMeals })}
          >
            {this.state.openMeals ? 'Hide Meals' : 'Show Meals'}
          </Button>
          <Collapse isOpen={this.state.openMeals}>
            <CardGroup>
              {this.props.profile
                ? this.props.profile.nutritionSchedule.map((sched, index) => {
                    return (
                      <Card
                        body
                        key={index}
                        className="m-1"
                        inverse
                        color="dark"
                      >
                        <CardTitle
                          style={{
                            fontWeight:'bold',
                            textAlign:'center'
                          }}
                        >
                          {new Date(sched.time).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </CardTitle>
                        {sched
                          ? sched.items.map((item, i) => {
                              return (
                                <CardText key={i} className="row justify-content-center">
                                  <Col md='6' className='truncate text-center'>
                                  <Badge color='light'>{item.name}</Badge>
                                  </Col>
                                  <Col md='6' className='text-center'>
                                  <Badge color='warning'>
                                  {item.serving + 'oz'}
                                  </Badge>
                                  </Col>
                                </CardText>
                              )
                            })
                          : null}
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
                : null}
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
          if (rowIndex === this.props.profile.nutritionItems.length) {
            return false
          }
          return true
        }
      },
      // {
      //   dataField: 'serving_label',
      //   text: 'Serving',
      //   editable: (cell, row, rowIndex, colIndex) => {
      //     if (rowIndex === this.props.profile.nutritionItems.length) {
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
          if (rowIndex === this.props.profile.nutritionItems.length) {
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
        data={
          this.props.profile
            ? this.props.profile.nutritionItems.concat(this.state.products)
            : []
        }
        columns={columns}
        rowClasses={this.rowClasses}
        classes={
          this.props.windowWidth < 500 === true
            ? 'table-mobile bg-light'
            : 'bg-light'
        }
        cellEdit={cellEditFactory({
          mode: 'dbclick',
          blurToSave:true,
          autoSelectText: true,
          beforeSaveCell: async (oldValue, newValue, row, column) => {
            // console.log(newValue, row, 'before save log')
            
            if (!isNaN(newValue) && newValue !== ' '){
              this.updateMacros(newValue)
            } else {
              // console.log('send to save')
              await this.props.updateFoodItem({
                index: this.state.index,
                replace: row
              })
            }
          }
        })}
        selectRow={this.selectRow}
      />
    )
  }

  rowClasses = (row, rowIndex) => {
    if (rowIndex === this.state.index && this.state.rowSelected && 
      rowIndex !== this.props.profile.nutritionItems.length) {
      return 'selected-row'
    }
  }


  selectRow = {
    mode: 'checkbox',
    clickToSelect: true,
    hideSelectColumn: true,
    clickToEdit: true,
    nonSelectable: [this.props.profile ? this.props.profile.nutritionItems.length: ''],
    onSelect: (row, isSelect, rowIndex, e) => {
      // console.log(rowIndex)
      if (rowIndex !== this.props.profile.nutritionItems.length) {
      this.rowClasses(rowIndex)
      this.setState({ index: rowIndex,rowSelected: true })
      }
    }
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(rowIndex, 'selected')
      this.setState({ index: rowIndex, rowSelected: true })
    }
  }

  displayMacros = () => {
    return (
      <Row className="justify-content-center py-2">
        <Col md="4" className='align-self-center' position="middle">
          {/* <Card body inverse color="info" style={{ borderColor: '#333' }}>
            <CardHeader>Recommended Macros:</CardHeader>
            <CardBody>
              <CardText> */}
          <h5>Recommended Macros:</h5>
          <h4>
            <Badge color="primary" >
              Protein: 200g
            </Badge>
          </h4>
          <h4>
            <Badge color="warning" >
              Carbs: 100g
            </Badge>
          </h4>
          <h4>
            <Badge color="danger" >
              Fats: 70g
            </Badge>
          </h4>
          <h4>
            <Badge color="info" >
              Calories: {(Number(this.props.profile.calories) + this.props.profile.currentGoal.value).toFixed()}
            </Badge>
          </h4>
          {/* </CardText>
            </CardBody>
          </Card> */}
        </Col>
        <Col md="6">
          <h5>Your Diets Macros:</h5>
          <HorizontalBar
            legend={{ position: 'bottom' }}
            data={this.state.horizontalBarData}
          />
        </Col>
      </Row>
    )
  }


  calculateTotals = () => {
    // if (this.props.profile.nutritionItems.length !== 0) {
    this.state.products.splice(-1)
    // }

    let carbs = 0
    let prot = 0
    let fats = 0
    let cals = 0
    for (let i = 0; i < this.props.profile.nutritionItems.length; i++) {
      fats = Number(this.props.profile.nutritionItems[i].fats) + Number(fats)
      carbs = Number(this.props.profile.nutritionItems[i].carb) + Number(carbs)
      prot = Number(this.props.profile.nutritionItems[i].protein) + Number(prot)
      cals =
        Number(this.props.profile.nutritionItems[i].calories) + Number(cals)
    }

    this.setState(() => {
      this.state.horizontalBarData.datasets[0].data = [
        Math.round(carbs),
        Math.round(prot),
        Math.round(fats)
      ]
      this.state.products.push({
        name: 'Totals(g)',
        fats: fats.toFixed(2),
        calories: Math.round(cals),
        carb: carbs.toFixed(2),
        protein: prot.toFixed(2),
        id:'total'
      })
    })
    this.forceUpdate()
  }


  addItemButton = () => {
    return (
      <Button
        className="my-2"
        color={'primary'}
        disabled={this.props.foodSelected ? false : true}
        onClick={async () => {
          await this.props.updateProfile({
            keys: ['nutritionItems'],
            nutritionItems: this.props.foodSelected
          })
          this.setState(() => {
            // this.state.products.unshift(this.props.foodSelected)
            this.calculateTotals()
          })
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
        <h6>Nutrition Data Provided by USDA Food Database</h6>
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

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      })
    }
  }

  renderNutritionTabs = () => {
    return (
      <Col className="bg-light" style={{ paddingTop: '10px' }} md="9">
        {this.displayMacros()}
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => {
                this.toggle('1')
              }}
              style={{ textTransform: 'none' }}
            >
              Create Plan
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
              Schedule
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane className="mt-4" tabId="1">
            <Col md="12">
              <Row className="justify-content-center">
                <Col md="6">{this.selectFoodItem()}</Col>
              </Row>
              <Row className="align-items-center justify-content-center">
                <Col md="3">{this.addItemButton()}</Col>
                <Col md="3">{this.manualEntryButton()}</Col>
                <Col md="3">{this.removeItemButton()}</Col>
              </Row>
            </Col>
            {this.renderTable()}
          </TabPane>
          <TabPane tabId="2">
            <Row className="my-3">
              <Col md="12">{this.renderMealSchedule()}</Col>
            </Row>
            <Row>
              <Col md="12">{this.makeSchedule()}</Col>
            </Row>
          </TabPane>
        </TabContent>
      </Col>
    )
  }

  render() {
    // console.log(this.props)
    return this.props.profile? this.renderNutritionTabs():null
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
