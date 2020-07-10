import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'

import Grid from '@material-ui/core/Grid'
import StopIcon from '@material-ui/icons/Stop'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import workouts from './Workouts'
import Paper from '@material-ui/core/Paper'
import Hidden from '@material-ui/core/Hidden'
import Zoom from '@material-ui/core/Zoom'
import SettingsIcon from '@material-ui/icons/Settings'
import Menu from '@material-ui/core/Menu'
import Tooltip from '@material-ui/core/Tooltip'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import AutorenewIcon from '@material-ui/icons/Autorenew'
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import WarningIcon from '@material-ui/icons/Warning'

import Backdrop from '@material-ui/core/Backdrop'
import CircularProgress from '@material-ui/core/CircularProgress'
import GoogleFontLoader from 'react-google-font-loader'

import {useWorkout} from './Workouts'
import {usePoseNet} from './PoseNet'
import './PoseNet.scss'

import {
    createMuiTheme,
    responsiveFontSizes,
    ThemeProvider
} from '@material-ui/core/styles'

let theme = createMuiTheme()
theme = responsiveFontSizes(theme)

const useStyles = makeStyles(theme => ({
    appBar: {
        position: 'relative',
        backgroundColor: 'black'
    },
    title: {
        // marginLeft: theme.spacing(1),
        fontFamily: 'Orbitron',
        textAlign: 'center',
        // marginRight: theme.spacing(2),
        flex: 1
        // padding: '2px'
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 50
    },
    root: {
        display: 'flex',
        flex: 2,
        flexWrap: 'wrap',

        border: '1px solid white',
        borderRadius: '10px',
        justifyContent: 'space-evenly'
    },
    mobileBar: {
        top: 'auto',
        bottom: 0
    },
    grow: {
        flexGrow: 1
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    }
}))

const useSelect = makeStyles(theme => ({
    root: {
        color: 'white'
    },
    whiteColor: {
        color: 'white'
    },
    menu: {
        backgroundColor: 'grey'
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const Settings = ({anchorEl, setAnchorEl, settings}) => {
    const handleClose = () => {
        setAnchorEl(null)
    }

    const Toggle = ({name, func, value}) => {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={value}
                        onChange={() => func(!value)}
                        color="primary"
                        onClick={event => event.stopPropagation()}
                    />
                }
                label={name}
            />
        )
    }

    return (
        <div>
            <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {settings.map(setObj => (
                    <MenuItem
                        key={setObj.name}
                        onClick={event => event.preventDefault()}
                    >
                        <Toggle
                            name={setObj.name}
                            value={setObj.var}
                            func={setObj.func}
                        />
                    </MenuItem>
                ))}

                <MenuItem onClick={handleClose}>Close</MenuItem>
            </Menu>
        </div>
    )
}

const WorkoutSelect = ({workout}) => {
    const classes = useStyles()
    const styles = useSelect()
    const [selectState, update] = React.useState(0)

    return (
        <div className={classes.title}>
            <FormControl className={classes.formControl}>
                <Select
                    labelId="workout-select-label"
                    id="workout-select"
                    variant="filled"
                    value={selectState}
                    onChange={e => {
                        workout.changeExercise(e.target.value)
                        update(e.target.value)
                    }}
                    classes={{
                        root: styles.root,
                        icon: styles.whiteColor,
                        select: styles.whiteColor
                    }}
                >
                    <MenuItem value={0}>
                        Practice <Hidden mdDown> An Exercise</Hidden>
                    </MenuItem>
                    {workout.options.map(w => (
                        <MenuItem key={w} value={w}>
                            {w.replace(/_/g, ' ')}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    )
}

//TODO: Test, add tooltips to icons
//Leader board -> model & save
const MobileBar = ({workout}) => {
    const classes = useStyles()

    return (
        <AppBar position="fixed" color="primary" className={classes.mobileBar}>
            <Toolbar>
                <Typography variant="caption" className={classes.title}>
                    <Tooltip title="Current Reps">
                        <FitnessCenterIcon />
                    </Tooltip>
                    {workout ? workout.reps : 0}
                </Typography>

                <Typography variant="subtitle" className={classes.title}>
                    Score: {workout ? Math.round(workout.score) : 0}
                </Typography>

                <Typography variant="caption" className={classes.title}>
                    <Tooltip title="Current Tempo in reps/30s">
                        <>
                            <DirectionsRunIcon />
                        </>
                    </Tooltip>
                    {workout ? workout.pace : 0} /30s
                </Typography>

                {/* <div className={classes.grow} /> */}
            </Toolbar>
        </AppBar>
    )
}

const Warning = () => {
    const message = (
        <div style={{padding: 10}}>
            <Typography style={{textAlign: 'center'}} variant="h6">
                Not Recommended!
            </Typography>
            <Typography variant="caption">
                This enables a more powerful version of the software used to
                detect your movement. Performance will likely suffer unless you:
                <br />
                <br />
                Have a mid/powerful discreet GPU.
                <br />
                AND
                <br />
                Your browser is configured to use it.
            </Typography>
        </div>
    )

    return (
        <Tooltip title={message}>
            <WarningIcon />
        </Tooltip>
    )
}

export default function WorkoutInterface() {
    const classes = useStyles()
    const [open, setOpen] = React.useState(false)
    const [sessActive, updateActive] = React.useState(false)
    const [modelLoaded, setMLoaded] = React.useState(false)
    const [anchorEl, setAnchorEl] = React.useState(null)

    const workout = useWorkout()
    const net = usePoseNet(workout)

    // Settings state
    const [showSkeleton, toggleSkeleton] = React.useState(true)
    const [showPoints, toggleKps] = React.useState(true)
    const [showVideo, toggleVideo] = React.useState(true)
    const [maxPerf, changeModel] = React.useState(false)

    const settings = [
        {func: toggleSkeleton, var: showSkeleton, name: 'Show Skeleton'},
        {func: toggleKps, var: showPoints, name: 'Show Key Points'},
        // {func: toggleVideo, var: showVideo, name: 'Show Processed Video'},
        {
            func: changeModel,
            var: maxPerf,
            name: (
                <span>
                    Max Performance Mode <Warning />
                </span>
            )
        }
    ]

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleSettings = event => {
        setAnchorEl(event.currentTarget)
    }

    const handleSettingsClose = () => {
        setAnchorEl(null)
    }

    const handleNet = async () => {
        await net.start()
        workout.session.start()
    }

    const handleEndSession = async () => {
        await workout.session.end()
        await net.end()
    }

    React.useEffect(() => {
        async function close() {
            await workout.session.end()
            await net.end()
        }
        return () => {
            close()
        }
    }, [])

    return (
        <div style={{backgroundColor: 'black'}}>
            <Button
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                Start HIIT Workout!
            </Button>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                scroll="paper"
                TransitionComponent={Transition}
                PaperProps={{
                    style: {backgroundColor: 'black'}
                }}
            >
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                            aria-label="close"
                        >
                            <CloseIcon />
                        </IconButton>
                        <ThemeProvider theme={theme}>
                            {!workout.session.active ? (
                                <WorkoutSelect workout={workout} />
                            ) : null}

                            <Hidden mdUp>
                                {workout.session.active ? (
                                    <div className={classes.root}>
                                        <ThemeProvider theme={theme}>
                                            <Zoom
                                                in={!workout.session.updating}
                                            >
                                                <Typography
                                                    variant="h6"
                                                    style={{
                                                        color: 'White',
                                                        fontFamily: 'Orbitron'
                                                    }}
                                                >
                                                    {
                                                        workout.currentExercise
                                                            .name
                                                    }
                                                </Typography>
                                            </Zoom>
                                            <Zoom
                                                in={!workout.session.updating}
                                            >
                                                <Typography
                                                    variant="h4"
                                                    style={{
                                                        color: 'red',
                                                        fontFamily: 'Orbitron'
                                                    }}
                                                >
                                                    {workout.session.time}s
                                                </Typography>
                                            </Zoom>
                                            <IconButton
                                                edge="start"
                                                color="inherit"
                                                onClick={handleEndSession}
                                                style={{padding: 0}}
                                                aria-label="close"
                                            >
                                                <StopIcon />
                                            </IconButton>
                                        </ThemeProvider>
                                    </div>
                                ) : null}
                            </Hidden>

                            {!workout.session.active ? (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size={'small'}
                                    onClick={handleNet}
                                >
                                    <Hidden mdDown>
                                        {'Workout Generator'}
                                    </Hidden>
                                    <AutorenewIcon />
                                </Button>
                            ) : null}

                            <Hidden mdDown>
                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                >
                                    Score: {workout ? workout.score : 0}
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                >
                                    Reps: {workout ? workout.reps : 0}
                                </Typography>

                                {workout.session.active ? (
                                    <div className={classes.root}>
                                        <ThemeProvider theme={theme}>
                                            <Zoom
                                                in={!workout.session.updating}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    style={{
                                                        color: 'White',
                                                        fontFamily: 'Orbitron'
                                                    }}
                                                >
                                                    {
                                                        workout.currentExercise
                                                            .name
                                                    }
                                                </Typography>
                                            </Zoom>
                                            <Zoom
                                                in={!workout.session.updating}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    style={{
                                                        color: 'red',
                                                        fontFamily: 'Orbitron'
                                                    }}
                                                >
                                                    {workout.session.time}s
                                                </Typography>
                                            </Zoom>
                                            <IconButton
                                                edge="start"
                                                color="inherit"
                                                onClick={handleEndSession}
                                                style={{padding: 0}}
                                                aria-label="close"
                                            >
                                                <StopIcon />
                                            </IconButton>
                                        </ThemeProvider>
                                    </div>
                                ) : null}

                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                >
                                    Total Reps:{' '}
                                    {workout ? workout.totalReps : 0}
                                </Typography>

                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                >
                                    Total Time:{' '}
                                    {workout ? workout.session.totalTime : 0}
                                </Typography>

                                {/* <Typography
                                    variant="subtitle"
                                    className={classes.title}
                                    style={{fontFamily:'Orbitron'}}
                                >
                                    Cur. Pace: {workout ? workout.pace : 0}
                                    /30s
                                </Typography> */}

                                <Typography
                                    variant="subtitle1"
                                    className={classes.title}
                                    style={{fontFamily: 'Orbitron'}}
                                >
                                    Avg. Pace: {workout ? workout.totalPace : 0}
                                    /30s
                                </Typography>
                            </Hidden>
                        </ThemeProvider>
                        <IconButton
                            edge="end"
                            color="inherit"
                            onClick={handleSettings}
                            aria-label="settings"
                        >
                            <SettingsIcon />
                        </IconButton>
                        <Settings
                            anchorEl={anchorEl}
                            setAnchorEl={setAnchorEl}
                            settings={settings}
                        />
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <MobileBar workout={workout} />
                </Hidden>

                <Grid container justify="center" style={{textAlign: 'center'}}>
                    <Backdrop className={classes.backdrop} open={net.loading}>
                        <CircularProgress color="primary" />
                    </Backdrop>

                    <Grid item xs={12}>
                        <video id={'videoNoShow'} playsInline />
                        <canvas id={'canvas'} className="webcam" />
                    </Grid>
                </Grid>
            </Dialog>
        </div>
    )
}
