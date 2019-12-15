import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import CardComponent from './OVCard'
import moment from 'moment'
import * as actions from '../../actions'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import WorkoutMode from './WorkoutMode'

const useStyles = makeStyles(theme => ({
    startBtn: {
        backgroundColor: 'rgb(26, 161, 114)',
        color: 'white'
    },
    grid: {
        padding: '16px'
    },
    skipBtn: {
        backgroundColor: 'rgb(222, 46, 7)',
        color: 'white'
    },
    center: {
        textAlign: 'center'
    }
}))

const WorkoutPreview = ({eList}) => {
    // console.log(eList)
    return (
        <List
            component="nav"
            style={{backgroundColor: 'white'}}
            aria-label="exercise list"
        >
            {eList
                .filter(f => f !== null)
                .map((e, i) =>
                    e !== null ? (
                        <>
                            <ListItem key={i}>
                                <ListItemText
                                    primary={e.name}
                                    secondary={e.sets + ' x ' + e.reps}
                                />
                            </ListItem>
                            <Divider />
                        </>
                    ) : null
                )}
        </List>
    )
}

const WorkoutNode = val => {
    const [skipped, setSkip] = useState(false)
    const [completed, updateComplete] = useState(false)

    const obj = {
        val,
        completed: false,
        timestamp: null,
        next: null,
        prev: null
    }
}

const NextWorkout = () => {
    const dispatch = useDispatch()
    const plan = useSelector(state => state.activePlan)
    const [done, setDone] = React.useState(false)
    const [workout, setWorkout] = React.useState(null)
    const classes = useStyles()

    const handleClickOpen = () => {
        dispatch(actions.workoutModeToggle())
    }

    useEffect(() => {
        dispatch(actions.fetchActiveTrainingPlan())
    }, [])

    useEffect(() => {
        //TODO: Fix date matching algo
        if (plan) {
            let w = Object.keys(plan.days[0]).find(d => {
                // console.log(moment(d).get('date') === moment().get('date'))
                // console.log(moment(d).get('date'), moment().get('date'))
                return (
                    moment(d).get('date') === moment().get('date') &&
                    moment(d).get('month') === moment().get('month')
                )
            })
            // console.log(plan)
            if (w) setWorkout(plan.days[0][w])
        }
    }, [plan])

    const renderHeader = () => {
        if (done) return 'Workout completed!'
        else if (!workout) return 'No Active Plan.'
        else return workout.title
    }

    const renderExercises = () => {
        if (done) return 'Workout completed!'
        else if (!workout) return 'No Workouts Created'
        else return renderPreview()
    }
    console.log(workout)

    const renderPreview = () => {
        return (
            <>
                <WorkoutPreview eList={workout.exercises} />
                <WorkoutMode id={'test'} exercises={workout.exercises} />
                <Grid
                    style={{padding: '10px'}}
                    container
                    justify="space-between"
                >
                    <Button variant="contained" className={classes.skipBtn}>
                        Skip
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleClickOpen}
                        className={classes.startBtn}
                    >
                        Start
                    </Button>
                </Grid>
            </>
        )
    }

    return (
        <CardComponent headline={renderHeader()} subheader="Todays Workout">
            <Typography className={classes.center} variant="h6">
                Workout Preview
            </Typography>
            {renderExercises()}
        </CardComponent>
    )
}

export default NextWorkout
