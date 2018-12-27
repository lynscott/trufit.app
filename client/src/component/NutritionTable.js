import React, { Component } from 'react'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'


const products = [{meal:'Meal 1',fats:20, carb: 50, protein: 100},
    {fats:30, carb: 70, protein: 200},{fats:10, carb: 10, protein: 100} ]
const columns = [{
    dataField: 'meal',
    text: 'Meal'
},{
  dataField: 'fats',
  text: 'Fats (g)'
}, {
  dataField: 'carb',
  text: 'Carbs (g)'
}, {
  dataField: 'protein',
  text: 'Protein (g)'
},{
    dataField: 'total',
    text: 'Total'
  }]

export default () =>
  <BootstrapTable keyField='id' 
  striped={true} bordered={true} hover={true} condensed={true}
  bootstrap4 ={true} data={ products } columns={ columns } caption={'Nutrition Overview'}
  />
