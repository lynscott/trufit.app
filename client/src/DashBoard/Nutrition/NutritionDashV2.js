import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import Meals from '@material-ui/icons/LocalGroceryStore'
import Nutrition from '@material-ui/icons/Kitchen'
import AssessmentIcon from '@material-ui/icons/Assessment'
import MealList from './Meals'
import PlanView from './Plans'
import {useDispatch, useSelector} from 'react-redux'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import SwipeableViews from 'react-swipeable-views'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles({
    root: {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        top: 'auto',
        backgroundColor: 'black',
        color: 'white'
    },
    mealGrid: {
        height: '100%',
        backgroundColor: 'white',
        padding: '16px'
    },
    gridStyle: {
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    title: {
        width: '100%'
    },
    icon: {
        color: 'white'
    },
    iconSeleceted: {
        color: 'rgb(26, 161, 114)'
    }
})

export default function NutritionDash() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [index, setValue] = useState(0)

    const navClass = {
        root: classes.icon,
        selected: classes.iconSeleceted,
        label: classes.icon
    }

    const handleChange = (event, value) => {
        setValue(value)
    }

    const handleChangeIndex = index => {
        setValue(index)
    }

    return (
        <Grid className={classes.gridStyle} item container xs={12}>
            <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
                <Grid container item xs={12} className={classes.mealGrid}>
                    <Typography className={classes.title} variant="h6">
                        Meal Creation
                    </Typography>
                    <Divider />
                    <MealList />
                </Grid>
                <Grid container item xs={12} className={classes.mealGrid}>
                    <Typography className={classes.title} variant="h6">
                        Meal Planning
                    </Typography>
                    <PlanView />
                </Grid>
            </SwipeableViews>

            <Grid style={{marginTop: '56px'}} item xs={12}>
                <BottomNavigation
                    value={index}
                    onChange={(event, newValue) => {
                        setValue(newValue)
                    }}
                    showLabels
                    className={classes.root}
                >
                    <BottomNavigationAction
                        classes={navClass}
                        label="Build"
                        icon={<Meals className={classes.icon} />}
                    />
                    <BottomNavigationAction
                        classes={navClass}
                        label="Plan"
                        icon={<Nutrition className={classes.icon} />}
                    />
                </BottomNavigation>
            </Grid>
        </Grid>
    )
}
