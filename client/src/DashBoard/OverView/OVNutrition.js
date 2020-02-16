import React, {useState, useEffect} from 'react'

import Moment from 'react-moment'
import {makeStyles, withStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import * as actions from '../../actions'
import moment from 'moment'
// import {formatMealTime} from './NutritionDash'
import CardComponent from './OVCard'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import BlockIcon from '@material-ui/icons/Block'
import CheckIcon from '@material-ui/icons/Check'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

const useStyles = makeStyles({
    root: {
        width: '100%'
    },
    paper: {
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'lightgrey'
    },
    table: {
        //   minWidth: 650,
    },
    completeIcon: {
        color: 'green'
    },
    skipIcon: {
        color: 'red'
    },
    margin: {
        marginTop: '10px'
    },
    grid: {
        padding: '10px'
    }
})

const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: 'white' //'#b2dfdb',
    },
    barColorPrimary: {
        backgroundColor: 'rgb(26, 161, 114)'
    }
})(LinearProgress)

const MealTable = ({meal}) => {
    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {meal.items.map(row => (
                        <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fats}</TableCell>
                            <TableCell align="right">{row.carb}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

const LinkedList = meals => {
    const Nodes = meals.map(m => MealNode(m))

    const head = Nodes[0]

    const removeMeal = meal => {}

    return {
        head
    }
}

const MealNode = val => {
    const dispatch = useDispatch()
    const [skipped, setSkip] = useState(false)
    const [completed, updateComplete] = useState(false)
    const [missed, setMissed] = useState(false)
    const [next, setNext] = useState(null)
    const [prev, setPrev] = useState(null)
    const [isHead, setHead] = useState(false)
    const today = moment().format('MM-D-YYYY')

    useEffect(() => {
        if (today in val.log) {
            if ('completed' in val.log[today]) updateComplete(true)
            else if ('skipped' in val.log[today]) setSkip(true)
            else if ('missed' in val.log[today]) setMissed(true)
        }
    }, [])

    useEffect(() => {
        let log = {
            timestamp: moment(),
            [completed ? 'completed' : 'skipped']: completed
                ? completed
                : skipped
        }
        if (!(today in val.log))
            dispatch(actions.logMealComplete((val.log[today] = log)))
    }, [skipped, completed])

    useEffect(() => {
        if (moment().isAfter(val.time) && !missed) {
            dispatch(
                actions.logMealComplete({
                    timestamp: moment(),
                    missed: true
                })
            )
            dispatch(actions.fetchMeals())
        }
    })

    return {
        val,
        completed,
        skipped,
        next,
        prev,
        isHead,

        setNext,
        setPrev,
        updateComplete,
        setSkip,
        setHead
    }
}

const OVNutrition = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const nutritionPlans = useSelector(
        state => state.nutrition.userNutritionPlans
    )
    const userMeals = useSelector(state => state.nutrition.userMeals)

    const [nextMeal, setNext] = React.useState(null)
    const [done, setDone] = React.useState(false)
    const [init, setInit] = React.useState(false)
    const [todaysLog, setLog] = React.useState([])

    const handleMealSubmit = async () => {
        await dispatch(
            actions.logMealComplete({
                log: {
                    id: nextMeal.meal.meal._id,
                    timestamp: moment()
                },
                id: nutritionPlans[0]._id
            })
        )
        dispatch(actions.fetchNutritionPlans())
    }

    const renderHeader = () => {
        if (done) return 'All meals completed for today!'
        else if (init) return ''
        else if (userMeals.length < 1) return 'Nutrition Stats'
        else if (!nextMeal) return <ColorLinearProgress />
        else return 'Next Meal: ' + nextMeal.meal.index
    }

    const renderSub = () => {
        if (done) return ''
        else if (init) return ''
        else if (!nextMeal) return ''
        else return 'Next Meal: ' + moment(nextMeal.time).format('h:mm A')
    }

    const renderShowMeal = () => {
        if (done) return 'Great Job!'
        //TODO: Add something here like a stat on adherence
        else if (!nextMeal) return 'Create A Meal Plan To Get Started'
        else
            return (
                <>
                    <MealTable meal={nextMeal.meal.meal} />
                    <Grid
                        className={classes.grid}
                        container
                        justify="space-between"
                    >
                        <Tooltip title="Mark Missed">
                            <IconButton aria-label="delete">
                                <BlockIcon
                                    className={classes.skipIcon}
                                    size="large"
                                />
                            </IconButton>
                        </Tooltip>
                        <Typography className={classes.margin}>
                            Did you eat this meal?
                        </Typography>
                        <Tooltip title="Mark Completed">
                            <IconButton
                                onClick={handleMealSubmit}
                                aria-label="complete"
                            >
                                <CheckIcon
                                    className={classes.completeIcon}
                                    size="large"
                                />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                </>
            )
    }
    // console.log(todaysLog, userMeals, nutritionPlans, userMeals)

    React.useEffect(() => {
        dispatch(actions.fetchNutritionPlans())
        dispatch(actions.fetchMeals())
    }, [])

    React.useEffect(() => {
        if (nutritionPlans.length > 0) {
            setLog(
                nutritionPlans[0].log.filter(
                    l =>
                        moment(l.timestamp).day() === moment().day() &&
                        moment(l.timestamp).month() === moment().month()
                )
            )

            let meals = nutritionPlans[0].scheduleData //HACK: Set to first plan for developing

            //If we've completed all meals for today, set done status
            if (todaysLog.length === meals.length) setDone(true)
            // no meals created yet or schechulded into a plan
            else if (meals.length === 0) setInit(true)
            //Else filter out logged meals and meals passed time and set the next meal
            else {
                let anyMeals = false
                meals.forEach(m => {
                    let f = moment()
                    f.set('hour', m.time.split(':')[0])
                    f.set('minute', m.time.split(':')[1])

                    if (
                        f.isAfter() &&
                        !todaysLog.find(l => l.id === m.meal._id)
                    ) {
                        if (!nextMeal) setNext({meal: m, time: f})
                        //If not time set, set this as next meal
                        else if (
                            //If current meal less than next, update next
                            moment(nextMeal.time).subtract(moment()) >
                            moment(f).subtract(moment())
                        )
                            setNext({meal: m, time: f})
                        anyMeals = true
                    }
                })
                if (!anyMeals) setDone(true)
            }
        }
    }, [nutritionPlans])

    return (
        <CardComponent headline={renderHeader()} subheader={renderSub()}>
            {renderShowMeal()}
        </CardComponent>
    )
}

export default OVNutrition
