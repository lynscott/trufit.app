import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import * as actions from '../../actions'
import {useDispatch, useSelector} from 'react-redux'

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import Collapse from '@material-ui/core/Collapse'
import TextField from '@material-ui/core/TextField'
import {useStopwatch} from './stopWatchHook'

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
        backgroundImage:
            'linear-gradient( to right, black, rgba(26, 161, 114, 1))'
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1
    },
    divider: {
        backgroundColor: 'white'
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    paper: {
        width: '100%',
        overflowX: 'auto'
    },
    table: {
        // minWidth: 650
    },
    timer: {
        fontSize: '5em',
        fontWeight: 'normal'
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const TrackerTable = ({e, workoutData, handleUpdate}) => {
    const classes = useStyles()
    return (
        <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.title}>
                Optional Workout Tracking
            </Typography>
            <Table
                className={classes.table}
                size="small"
                aria-label="a dense table"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>Set#</TableCell>
                        <TableCell align="right">Weight Used</TableCell>
                        <TableCell align="right">Reps Achieved</TableCell>
                        <TableCell align="right">Difficulty //TODO:</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...Array(parseInt(e.sets)).keys()].map(j => (
                        <TableRow key={j}>
                            <TableCell component="th" scope="row">
                                {j + 1}
                            </TableCell>
                            <TableCell align="right">
                                <TextField
                                    id="outlined-weight"
                                    value={
                                        e.name in workoutData
                                            ? workoutData[e.name]['weight'][
                                                  j + 1
                                              ]
                                            : null
                                    }
                                    variant="outlined"
                                    margin={'dense'}
                                    size="small"
                                    onChange={f =>
                                        handleUpdate(
                                            f.target.value,
                                            j + 1,
                                            'weight',
                                            e.name
                                        )
                                    }
                                />
                            </TableCell>
                            <TableCell align="right">
                                <TextField
                                    id="outlined-reps"
                                    value={
                                        e.name in workoutData
                                            ? workoutData[e.name]['reps'][j + 1]
                                            : null
                                    }
                                    variant="outlined"
                                    margin={'dense'}
                                    size="small"
                                    onChange={f =>
                                        handleUpdate(
                                            f.target.value,
                                            j + 1,
                                            'reps',
                                            e.name
                                        )
                                    }
                                />
                            </TableCell>
                            <TableCell align="right">TODO</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    )
}

export default function WorkoutMode({exercises, id}) {
    const {
        laps,
        addLap,
        isRunning,
        elapsedTime,
        startTimer,
        stopTimer,
        resetTimer
    } = useStopwatch()
    const classes = useStyles()
    const dispatch = useDispatch()
    const open = useSelector(state => state.workout.workoutActive)
    const [selected, setSelected] = React.useState(null)

    const [workoutData, setData] = React.useState({})

    const handleOnClick = i => {
        if (i === selected) setSelected(null)
        else setSelected(i)
    }

    const handleUpdate = (dt, i, label, name) => {
        if (name in workoutData) {
            workoutData[name][label][i] = dt
            setData(workoutData)
        } else {
            workoutData[name] = {}
            workoutData[name]['reps'] = {}
            workoutData[name]['weight'] = {}
            workoutData[name][label][i] = {}
            workoutData[name][label][i] = dt
            setData(workoutData)
        }
    }
    //TODO: Send log to workout log
    console.log(workoutData)

    const handleStartStop = () => {
        isRunning ? stopTimer() : startTimer()
    }

    const handleClose = () => {
        dispatch(actions.workoutModeToggle())
    }

    const elist = () => (
        <List
            component="nav"
            style={{color: 'white'}}
            aria-label="exercise list"
        >
            {exercises
                .filter(f => f !== null)
                .map((e, i) => (
                    <>
                        <ListItem key={i} selected={selected === i} button>
                            <ListItemText
                                secondaryTypographyProps={{
                                    style: {color: 'white'}
                                }}
                                primary={e.name}
                                onClick={() => handleOnClick(i)}
                                secondary={
                                    e.sets + ' sets x ' + e.reps + ' reps'
                                }
                            />
                        </ListItem>
                        <Collapse
                            in={selected === i}
                            timeout="auto"
                            unmountOnExit
                        >
                            <TrackerTable
                                e={e}
                                workoutData={workoutData}
                                handleUpdate={handleUpdate}
                            />
                        </Collapse>
                        <Divider className={classes.divider} />
                    </>
                ))}
        </List>
    )

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleClose}
            scroll={'paper'}
            TransitionComponent={Transition}
            disableEscapeKeyDown={true}
            PaperProps={{style: {backgroundColor: 'black'}}}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        End workout
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {elapsedTime}
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleStartStop}>
                        save
                    </Button>
                </Toolbar>
            </AppBar>
            {elist()}
        </Dialog>
    )
}
