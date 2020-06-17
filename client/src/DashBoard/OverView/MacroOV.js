import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import {red} from '@material-ui/core/colors'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import {Pie, Bar} from 'react-chartjs-2'
import * as actions from '../../actions'
import SwipeableViews from 'react-swipeable-views'
import MobileStepper from '@material-ui/core/MobileStepper'
import Button from '@material-ui/core/Button'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import Grid from '@material-ui/core/Grid'
import moment from 'moment'
import CardComponent from './OVCard'
import FormDialog from '../Nutrition/MealItems'

const useStyles = makeStyles(theme => ({
    card: {
        // maxWidth: 345
    },
    media: {
        height: 0,
        paddingTop: '56.25%' // 16:9
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: 'rotate(180deg)'
    },
    avatar: {
        backgroundColor: red[500]
    },
    header: {
        backgroundImage:
            'linear-gradient( to bottom right, rgba(236, 33, 103, 1), rgba(244, 123, 40, 1))'
    },
    logBtn: {
        backgroundColor: 'rgba(236, 33, 103, 1)',
        margin: '10px'
    }
}))

const BarChart = ({planned, todaysIntake, recommended}) => (
    <Bar
        data={{
            labels: ['Recommended.', 'Actual', '+/-'],
            datasets: [
                {
                    label: 'Intake',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderColor: 'rgba(130, 128, 128,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: ' rgba(117, 200, 171, 0.4)', //'rgba(130, 128, 128,0.4)',
                    hoverBorderColor: 'rgba(117, 200, 171, 1)',
                    data: [recommended, todaysIntake, todaysIntake - planned]
                }
            ]
        }}
        options={{
            legend: {
                display: false
            },

            scales: {
                yAxes: [
                    {
                        ticks: {
                            fontColor: 'black',
                            fontSize: 10
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Calories',
                            fontColor: 'black'
                        }
                    }
                ],
                xAxes: [
                    {
                        ticks: {
                            fontColor: 'black',
                            fontSize: 10
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Today',
                            fontColor: 'black'
                        }
                    }
                ]
            }
        }}
    />
)

const TodaysLog = () => {
    const userLog = useSelector(state => state.nutrition.userLog)
    const classes = useStyles()
    const dispatch = useDispatch()
    const [searchOpen, setStatus] = useState(false)

    const logFood = items => {
        dispatch(actions.logMealComplete(items))
    }

    const handleOpenSearch = () => {
        setStatus(true)
    }

    const nameSelector = log => {
        return log.item[0].ingredients[0].parsed[0].food
    }

    console.log(userLog.length, 'UL', userLog)

    if (userLog.length > 0)
        return (
            <List dense style={{textAlign: 'center'}} aria-label="meal log">
                {userLog.map((l, i) => {
                    let cals = l.item[0]?.calories
                    let ts = moment(l.date).format('LT')
                    return (
                        <>
                            <ListItem>
                                <ListItemText
                                    primary={ts + ' ' + nameSelector(l)}
                                    secondary={'Calories: ' + cals}
                                />
                            </ListItem>
                            <Divider />
                        </>
                    )
                })}
                <FormDialog
                    status={searchOpen}
                    meal={null}
                    updateMeal={logFood}
                    handleClose={() => setStatus(false)}
                />
                <Button onClick={handleOpenSearch} className={classes.logBtn}>
                    Log Food
                </Button>
            </List>
        )
    else {
        return (
            <Grid justify="center" alignItems="center" container>
                <FormDialog
                    status={searchOpen}
                    meal={null}
                    updateMeal={logFood}
                    handleClose={() => setStatus(false)}
                />
                <Grid style={{textAlign: 'center'}} item>
                    <Typography variant="subtitle1">
                        No Food Logged For Today.
                    </Typography>
                    <Button
                        onClick={handleOpenSearch}
                        className={classes.logBtn}
                    >
                        Log Food
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default function MacroCard() {
    //TODO: add custom graphs and macro/gram breakdown
    const classes = useStyles()
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(false)
    const [todaysCalories, setCals] = useState(0)
    const [index, setValue] = useState(0)

    const [calGoal, setCalGoal] = useState(0)
    const [fatMacro, setFatMacro] = useState(0)
    const [carbMacro, setCarbMacro] = useState(0)
    const [proteinMacro, setProteinMacro] = useState(0)

    const [goal, setGoal] = useState(0)
    const [nutriCals, setNC] = useState(0)
    const userProfile = useSelector(state => state.auth.userProfile)
    const userLog = useSelector(state => state.nutrition.userLog)
    // console.log(userProfile, 'UP')

    const PROTEIN = 0.9
    const FAT = 0.6

    // const macroSelector = val => val.baseSomaType.macro

    const handleNext = () => {
        setValue(index + 1)
    }

    const handleBack = () => {
        setValue(index - 1)
    }
    const nutritionPlans = useSelector(
        //TODO: Get planned cals from here
        state => state.nutrition.userNutritionPlans
    )
    const handleChangeIndex = index => {
        setValue(index)
    }

    const macroPieChart = (
        <Pie
            data={{
                labels: ['Carbs(g)', 'Protein(g)', 'Fat(g)'],
                datasets: [
                    {
                        data: userProfile
                            ? [carbMacro, proteinMacro, fatMacro]
                            : [0, 0, 0],
                        backgroundColor: ['#3acbe8', '#3ae89c', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#e89c3a']
                    }
                ]
            }}
        />
    )

    useEffect(() => {
        if (userLog.length > 0) {
            let cals = userLog.reduce(
                (a, b) => a.item[0].calories + b.item[0].calories
            )
            setCals(cals)
        }
    }, [userLog])

    useEffect(() => {
        if (!userProfile) dispatch(actions.fetchProfile())
        if (nutritionPlans.length === 0) dispatch(actions.fetchNutritionPlans())
        dispatch(actions.fetchMealLogs())
    }, [])

    useEffect(() => {
        if (userProfile) {
            //If no custom macros are set, use recommended values
            if (!userProfile.macros) {
                setCalGoal(parseInt(userProfile.calorieGoal))
                setFatMacro(userProfile.tbw * FAT)
                setProteinMacro(userProfile.tbw * PROTEIN)
                setCarbMacro((calGoal - proteinMacro * 4 - fatMacro * 9) / 4)
            }
            // setGoal(userProfile.currentGoal.value)
            // setNC(userProfile.nutritionCalories)
        }
    }, [userProfile])

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    //TODO: Calculate on backend and send with data
    useEffect(() => {
        if (nutritionPlans.length > 0)
            nutritionPlans[0].log.forEach(log => {
                if (
                    moment(log.timestamp).get('date') === moment().get('date')
                ) {
                    nutritionPlans[0].scheduleData
                        .find(d => d.meal._id === log.id)
                        .meal.items.map(item => {
                            setCals(todaysCalories + parseInt(item.calories))
                        })
                }
            })
    }, [nutritionPlans])

    return (
        <CardComponent
            headline={
                <>
                    <Typography variant="body2">Today's Log</Typography>
                    <Typography variant="h5">
                        {todaysCalories + ' calories'}
                    </Typography>
                </>
            }
            subheader={'Daily Intake Goal: ' + calGoal + ' cals'}
        >
            <SwipeableViews index={index} onChangeIndex={handleChangeIndex}>
                <>
                    <TodaysLog />
                </>
                <>
                    <Typography paragraph>Recommended Breakdown:</Typography>
                    {macroPieChart}
                </>
                <>
                    <Typography paragraph>Caloric Stats:</Typography>
                    <BarChart
                        planned={parseInt(calGoal)}
                        recommended={nutriCals}
                        todaysIntake={todaysCalories}
                    />
                </>
            </SwipeableViews>
            <MobileStepper
                variant="dots"
                steps={3}
                position="static"
                activeStep={index}
                style={{backgroundColor: 'transparent'}}
                nextButton={
                    <Button
                        disabled={index === 2}
                        size="small"
                        onClick={handleNext}
                    >
                        {<KeyboardArrowRight />}
                    </Button>
                }
                backButton={
                    <Button
                        disabled={index === 0}
                        size="small"
                        onClick={handleBack}
                    >
                        {<KeyboardArrowLeft />}
                    </Button>
                }
            />
        </CardComponent>
    )
}
