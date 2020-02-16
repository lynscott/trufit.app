import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
// import * as actions from '../actions'
import classnames from 'classnames'

import MacroCard from './MacroOV'
import {useDispatch, useSelector} from 'react-redux'
import * as actions from '../../actions'
import WeightStats from './OVStats'
import OVNutrition from './OVNutrition'
import Typography from '@material-ui/core/Typography'
import NextWorkout from './NextWorkoutOV'
import OVGoals from './OVGoals'
// import PoseNet from '../component/PoseNet'

import Grid from '@material-ui/core/Grid'

const OverView = () => {
    return (
        <Grid justify="center" container>
            <Typography style={{width: '100%', padding: '16px'}} variant="h4">
                OverView
            </Typography>
            <MacroCard />
            <WeightStats />
            <OVNutrition />
            {/* <NextWorkout /> */}
            <OVGoals />
        </Grid>
    )
}

export default OverView
