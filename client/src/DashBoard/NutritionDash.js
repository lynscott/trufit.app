import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { Col, Input, Button } from 'reactstrap'
import { connect } from 'react-redux'
import * as actions from '../actions'
import Select from 'react-select'
import './NutritionDash.scss'

const recommendedMacros = 1800

class NutritionDash extends Component {
  constructor(props) {
    super(props)

    this.state = {
      serving: 1,

      products: [
        { name: 'Oats', serving: 0.5, calories:0, fats: 30, carb: 70, protein: 200 },
        // { name: 'Total', calories: 1829, fats: 100, protein: 250, carb: 150 },
        { name: '%', calories:0 ,fats: 20, protein: 40, carb: 40 }
      ]
    }
  }

  renderTable = () => {
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
        text: 'Amount(oz)'
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

    return (
      <BootstrapTable
        keyField="dashid"
        striped={true}
        bordered={true}
        hover={true}
        condensed={false}
        bootstrap4={true}
        data={this.state.products}
        columns={columns}
      />
    )
  }

  calculateTotals = () => {
      this.state.products.splice(-1)

      let carbs= 0 
      let prot= 0 
      let fats= 0 
      let cals = 0
      for (let i = 0; i < this.state.products.length; i++) {

        fats = Number(this.state.products[i].fats) + Number(fats)
        carbs = Number(this.state.products[i].carb )+ Number(carbs)
        prot = Number(this.state.products[i].protein) + Number(prot)
        cals = Number(this.state.products[i].calories) + Number(cals)
        // console.log(fats, prot, carbs)
      }

      return this.state.products.push({name:'Total',fats:fats, calories:cals,carb:carbs,protein:prot})
  }

  render() {
    // console.log(this.props)
    return (
      <Col className="bg-light" style={{ paddingTop: '10px' }} md="9">
        {/* <Input type='text' onChange={(e)=>this.props.foodSearch(e.target.value)}  /> */}
        <Select
          options={this.props.terms}
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
        <Button
          onClick={() => {
              this.state.products.unshift(this.props.foodSelected)
              this.calculateTotals()
            }}
        >
          Add To Nutrition Plan
        </Button>
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
