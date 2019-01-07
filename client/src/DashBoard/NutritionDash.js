import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { Col, Input, Button, Table, Row, Card, CardBody, CardText, CardHeader, Badge } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Select from 'react-select'
import './NutritionDash.scss'
import { Type } from 'react-bootstrap-table2-editor'
import cellEditFactory from 'react-bootstrap-table2-editor'
import { Pie, Doughnut } from 'react-chartjs-2'

const recommendedMacros = 1800

const data = {
  labels: ['Carbs', 'Protein', 'Fats'],
  datasets: [
    {
      data: [100, 250, 75],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
    }
  ]
}

class NutritionDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serving: 1,
      rowSelected: false,
      index: 0,
      doughnutData:{
        labels: ['Carbs', 'Protein', 'Fats'],
        datasets: [
          {
            data: [100, 250, 75],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
          }
        ]
      },

      products: [
        // {
        //   name: 'Oats',
        //   serving: 0.5,
        //   calories: 0,
        //   fats: 30,
        //   carb: 70,
        //   protein: 200
        // }
        { name: 'Total', serving:'', serving_label:'', calories: 0, fats: 0, protein: 0, carb: 0 },
        // { name: '%', calories:0 ,fats: 20, protein: 40, carb: 40 }
      ]
    }
  }


  updateMacros = (newValue) => {
      let i = this.state.index
        console.log('correct', newValue)
        this.setState(() => {
        this.state.products[i].fats = Math.round(
          this.state.products[i].baseFats * (Number(newValue) / 3.5)
        )
        this.state.products[i].carb = Math.round(
          this.state.products[i].baseCarb * (Number(newValue) / 3.5)
        )
        this.state.products[i].protein = Math.round(
          this.state.products[i].baseProtein * (Number(newValue) / 3.5)
        )
        this.state.products[i].calories = Math.round(
          this.state.products[i].baseCal * (Number(newValue) / 3.5)
        )
        
        this.calculateTotals()
        })
        
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
      // console.log(list)
      return list
    }

    let columns = [
      {
        dataField: 'name',
        text: 'Food Item'
      },
      {
        dataField: 'serving_label',
        text: 'Serving'
      },
      {
        dataField: 'serving',
        text: 'Amount(oz)',
        editor: {
          type: Type.SELECT,
          options: makeArray()
        }
      },
      {
        dataField: 'calories',
        text: 'Calories'
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
      }
    ]

    let table = () => {
      return (
        <Table responsive>
          <thead>
            <tr>
              {columns.map(item => {
                return <th>{item.text}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.products.map((product, index) => {
              let keys = Object.keys(product)
              return (
                <tr
                  onClick={() =>
                    this.setState(() => {
                      return {
                        index: index,
                        rowSelected: true
                      }
                    })
                  }
                >
                  {keys.map(key => {
                    return <td>{product[key]}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
      )
    }

    return (
      // table()
      <BootstrapTable
        keyField="name"
        // striped={true}
        bordered={true}
        hover={true}
        condensed={false}
        bootstrap4={true}
        data={this.state.products}
        columns={columns}
        rowEvents={this.rowEvents}
        rowClasses={this.rowClasses}
        // remote = {true}
        // onTableChange = {this.onTableChange}
        cellEdit={cellEditFactory({
          mode: 'click',
          beforeSaveCell: (oldValue, newValue, row, column) => {
            console.log(newValue)
            //HACK: For some reason changes top selection
            this.updateMacros(newValue)
            this.setState({ rowSelected: false })
          }
        })}
        // selectRow={this.selectRow}
      />
    )
  }


  rowClasses = (row, rowIndex) => {
    if (rowIndex === this.state.index && this.state.rowSelected) {
      return 'selected-row'
    }
  }

  rowEvents = {
    onClick: (e, row, rowIndex) => {
      console.log(rowIndex, 'selected')
      this.setState({ index: rowIndex, rowSelected: true })
    }
  }

  displayMacros = () => {
    return(
      <Row className='justify-content-center py-4'>
        <Col md='4' position='middle'>
        {/* <Card body inverse color="info" style={{ borderColor: '#333' }}>
            <CardHeader>Recommended Macros:</CardHeader>
            <CardBody>
              <CardText> */}
              <h5>Recommended Macros:</h5>
              <h3><Badge color="primary" pill>Protein: 200g</Badge></h3>
              <h3><Badge color="warning" pill>Carbs: 100g</Badge></h3>
              <h3><Badge color="danger" pill>Fats: 70g</Badge></h3>
              <h3><Badge color="info" pill>Calories: 1800</Badge></h3>
              {/* </CardText>
            </CardBody>
          </Card> */}
        </Col>
        <Col md='6'>
          <h5>Your Diets Macros:</h5>
          <Doughnut legend={{position:'bottom'}} data={this.state.doughnutData}/>
        </Col>
      </Row>
    )
  }

  selectRow = {
    mode: 'radio',
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log( rowIndex)
      // row.name = 'Test'
      this.setState({index:rowIndex})
    }

  }

  onTableChange = (type, newState) => {
    console.log(newState, type, 'test')
    setTimeout(() => {
      this.setState(() => ({
        products: newState
      }))
    }, 2000)
  }


  calculateTotals = () => {
    this.state.products.splice(-1)

    let carbs = 0
    let prot = 0
    let fats = 0
    let cals = 0
    for (let i = 0; i < this.state.products.length; i++) {
      fats = Number(this.state.products[i].fats) + Number(fats)
      carbs = Number(this.state.products[i].carb) + Number(carbs)
      prot = Number(this.state.products[i].protein) + Number(prot)
      cals = Number(this.state.products[i].calories) + Number(cals)
    }

    this.setState(()=>{
      this.state.doughnutData.datasets[0].data = [Math.round(carbs), Math.round(prot), Math.round(fats)]
      this.state.products.push({
        name: 'Totals(g)',
        fats: Math.round(fats),
        calories: Math.round(cals),
        carb: Math.round(carbs),
        protein: Math.round(prot)
      })
    // this.forceUpdate()
    })
  }

  addItemButton = () => {
    return (
      <Button
        className="my-2"
        color={'primary'}
        disabled={this.props.foodSelected ? false : true}
        onClick={() => {
          this.setState(()=>{
            this.state.products.unshift(this.props.foodSelected)
            this.calculateTotals()
          })
          this.forceUpdate()
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
      <h6>Data Provided by USDA</h6>
      </React.Fragment>
    )
  }

  manualEntryButton = () => {
    return (
      <Button
        className="my-2"
        color="danger"
        onClick={() => {
          this.state.products.unshift({
            name: '',
            serving_label: '',
            serving: 0,
            calories: 0,
            fats: 0,
            carb: 0,
            protein: 0
          })
          this.forceUpdate()
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
        onClick={() => {
          this.state.products.splice(this.state.index, 1)
          this.calculateTotals()
          this.setState({ rowSelected: false })
        }}
      >
        Remove Item
      </Button>
    )
  }

  render() {
    // console.log(this.props)
    return (
      <Col className="bg-light" style={{ paddingTop: '10px' }} md="9">
        {this.displayMacros()}
        <Row className="justify-content-center">
          <Col md="6">{this.selectFoodItem()}</Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="3">{this.addItemButton()}</Col>
          <Col md="3">{this.manualEntryButton()}</Col>
          <Col md="3">{this.removeItemButton()}</Col>
        </Row>
        {this.renderTable()}
      </Col>
    )
  }
}

const mapStateToProps = state => {
  return {
    terms: state.nutrition.searchList,
    foodSelected: state.nutrition.foodSelected
  }
}

export default connect(
  mapStateToProps,
  actions
)(NutritionDash)
