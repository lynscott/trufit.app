import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import CardComponent from './OVCard'
import {Line} from 'react-chartjs-2'
import moment from 'moment'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import * as actions from '../../actions'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'

const useStyles = makeStyles(theme => ({
    card: {
        maxWidth: 345
    },
    grid: {
        padding: '16px'
    },
    margin: {
        margin: theme.spacing(2)
    }
}))

const WeightCheckIn = () => {
    const [weightInput, setWeight] = useState('')
    const [err, setErr] = useState(false)
    const dispatch = useDispatch()
    const classes = useStyles()

    const handleSubmit = () => {
        if (weightInput && !isNaN(weightInput)) {
            dispatch(
                actions.updateProfile({
                    keys: ['weighIns'],
                    weighIns: {
                        weight: weightInput,
                        date: moment()
                    }
                })
            )
            dispatch(actions.fetchProfile())
        } else setErr(true)
    }

    const handleInput = e => {
        if (err) setErr(false)
        setWeight(e.target.value)
    }

    return (
        <Grid className={classes.grid} container justify="center" spacing={6}>
            <Grid xs={6}>
                <FormControl>
                    <Input
                        error={err}
                        id="standard-adornment-weight"
                        value={weightInput}
                        onChange={handleInput}
                        endAdornment={
                            <InputAdornment position="end">Lbs</InputAdornment>
                        }
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight'
                        }}
                    />
                    <FormHelperText id="standard-weight-helper-text">
                        Time for a weigh in!
                    </FormHelperText>
                </FormControl>
            </Grid>
            <Grid item style={{textAlign: 'center'}} xs={12}>
                <Button
                    variant="outlined"
                    onClick={handleSubmit}
                    color="default"
                    size={'small'}
                >
                    Submit
                </Button>
            </Grid>
        </Grid>
    )
}

const WeightGraph = () => {
    const profile = useSelector(state => state.auth.userProfile)

    //Weight arr formatted for max and min values by 10
    const weightArr = profile.weighIns.map(
        item => Math.round(0.1 * parseInt(item.weight, 10)) / 0.1
    )

    return (
        <Line
            data={{
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [
                    {
                        label: 'Weight(lbs)',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: 'rgba(75,192,192,0.4)', //'rgba(255,255,255,0.8)',
                        borderColor: 'black', //'rgba(75,192,192,1)',
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: 'rgba(244, 123, 40, 1)', //'rgba(75,192,192,1)',
                        pointBackgroundColor: '#fff',
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: 'rgba(241, 97, 74, 1)',
                        pointHoverBorderColor: 'rgba(220,220,220,1)',
                        pointHoverBorderWidth: 1,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: profile.weighIns.map(d => {
                            return d
                                ? {
                                      y: d.weight,
                                      x: moment(d.date).format('M-D-YY, h:mm a')
                                  }
                                : []
                        })
                    }
                ]
            }}
            options={{
                legend: {
                    display: false
                },
                scales: {
                    // scaleLabel:{
                    //   display: true
                    // },
                    gridLines: {
                        color: 'rgb(255, 255, 255, 0.7)'
                    },
                    yAxes: [
                        {
                            ticks: {
                                fontColor: 'black',
                                fontSize: 10,
                                stepSize: 20,
                                max: Math.max(...weightArr),
                                min: Math.min(...weightArr) - 10
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'Weight (lbs)',
                                fontColor: 'black'
                            }
                        }
                    ],
                    xAxes: [
                        {
                            ticks: {
                                fontColor: 'black',
                                fontSize: 10,
                                source: 'auto'
                            },
                            type: 'time',
                            time: {
                                unit: 'month',
                                min: new Date('1/1/2019'),
                                unitStepSize: 3,
                                displayFormats: {
                                    quarter: 'MMM YY'
                                }
                            }
                        }
                    ]
                }
            }}
        />
    )
}

const WeightStats = () => {
    const profile = useSelector(state => state.auth.userProfile)
    const [shouldCheckIn, setCheckIn] = useState(false)
    const [difference, setDiff] = useState(0)
    const [arrowChoice, setArrow] = useState('')
    const classes = useStyles()
    console.log(profile)
    let w1 = 0
    let w2 = 0

    useEffect(() => {
        if (profile.weighIns.length > 2) {
            w1 = profile.weighIns[profile.weighIns.length - 1].weight
            w2 = profile.weighIns[profile.weighIns.length - 2].weight
            setArrow(Math.sign(w1 - w2) === 1 ? '+ ' : '')
            const recent = moment(
                profile.weighIns[profile.weighIns.length - 1].date
            )
            setDiff(w1 - w2)
            console.log(arrowChoice)
            const next = recent.add(1, 'w')
            if (moment().isAfter(next)) setCheckIn(true)
        }
    }, [profile])

    const headline = (
        <Badge color="primary" variant="dot" invisible={!shouldCheckIn}>
            <Typography variant="h5">Weight Stats</Typography>
        </Badge>
    )

    return (
        <CardComponent
            headline={headline}
            subheader={
                arrowChoice + difference.toString() + 'lbs from last week'
            }
        >
            {shouldCheckIn ? <WeightCheckIn /> : null}
            <WeightGraph />
        </CardComponent>
    )
}

export default WeightStats
