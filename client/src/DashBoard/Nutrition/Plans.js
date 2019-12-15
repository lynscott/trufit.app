import React, {useState, useEffect, forwardRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as actions from '../../actions'
import {makeStyles} from '@material-ui/core/styles'

import {tableIcons} from '../../constants/TableIcons'

//TODO: Add meal detail view for plan scheduling
//TODO: Create CRUD UI for nutrition plans
// Setup Active plan status -> updateOV

const PlanView = () => {
    const dispatch = useDispatch()
    const plans = useSelector(state => state.nutrition.userNutritionPlans)
    useEffect(() => {
        dispatch(actions.fetchNutritionPlans())
    }, [])
    console.log(plans)
    return (
        <Grid item xs={12}>
            <MaterialTable
                icons={tableIcons}
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Days', field: 'days'},

                    {title: 'Status', field: 'status'}
                ]}
                data={plans}
                title=" Nutrition Plans"
                options={{
                    selection: false,
                    // toolbar: false,
                    // emptyRowsWhenPaging: false,
                    headerStyle: {backgroundColor: 'black', color: 'white'}
                    // grouping: false,
                    // showTitle: false
                }}
            />
        </Grid>
    )
}

export default PlanView
