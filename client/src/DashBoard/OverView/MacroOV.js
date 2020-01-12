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
    //TODO: create log model
    const nutritionPlans = useSelector(
        state => state.nutrition.userNutritionPlans
    )
    const userMeals = useSelector(state => state.nutrition.userMeals)

    const [log, setLog] = useState([])

    useEffect(() => {
        if (nutritionPlans.length > 0) {
            setLog(
                nutritionPlans[0].log.filter(
                    l =>
                        moment(l.timestamp).day() === moment().day() &&
                        moment(l.timestamp).month() === moment().month()
                )
            )
        }
    }, [nutritionPlans])
    console.log(userMeals)

    return (
        <List dense aria-label="meal log">
            {nutritionPlans[0].log.map((l, i) => (
                <>
                    <ListItem key={i}>
                        Log
                        {/* <ListItemText
                                    primary={l.name}
                                    secondary={e.sets + ' x ' + e.reps}
                                /> */}
                    </ListItem>
                    <Divider />
                </>
            ))}
        </List>
    )
}

export default function MacroCard() {
    //TODO: add custom graphs and macro/gram breakdown
    const classes = useStyles()
    const dispatch = useDispatch()
    const [expanded, setExpanded] = useState(false)
    const [todaysCalories, setCals] = useState(0)
    const [index, setValue] = useState(0)
    const [profCalories, setPC] = useState(0)
    const [goal, setGoal] = useState(0)
    const [nutriCals, setNC] = useState(0)
    const userProfile = useSelector(state => state.auth.userProfile)

    const macroSelector = val => val.baseSomaType.macro

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
                labels: ['Carbs', 'Protein', 'Fat'],
                datasets: [
                    {
                        data: userProfile
                            ? [
                                  macroSelector(userProfile).carb,
                                  macroSelector(userProfile).protein,
                                  macroSelector(userProfile).fat
                              ]
                            : [0, 0, 0],
                        backgroundColor: ['#3acbe8', '#3ae89c', '#FFCE56'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#e89c3a']
                    }
                ]
            }}
        />
    )

    useEffect(() => {
        if (!userProfile) dispatch(actions.fetchProfile())
        if (nutritionPlans.length === 0) dispatch(actions.fetchNutritionPlans())
    }, [])

    useEffect(() => {
        if (userProfile) {
            setPC(userProfile.calories)
            setGoal(userProfile.currentGoal.value)
            setNC(userProfile.nutritionCalories)
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
            headline={'Macronutrients'}
            subheader={
                todaysCalories + '/' + (parseInt(profCalories) + goal) + 'cal'
            }
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
                        planned={parseInt(profCalories)}
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
