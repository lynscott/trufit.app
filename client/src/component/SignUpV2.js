import React, {useState, useEffect, useReducer} from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {Form, useForm, useField, useFormState} from 'react-final-form'
import {signUpUser, resetSignUpFail} from '../actions'
import {useDispatch, useSelector} from 'react-redux'
import {OnChange} from 'react-final-form-listeners'
import Button from '@material-ui/core/Button'
import clsx from 'clsx'

//Dialog imports
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import {useTheme, makeStyles, withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import InputAdornment from '@material-ui/core/InputAdornment'

//Stepper
import Zoom from '@material-ui/core/Zoom'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import SettingsIcon from '@material-ui/icons/Settings'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import VideoLabelIcon from '@material-ui/icons/VideoLabel'
import DoneAllIcon from '@material-ui/icons/DoneAll'

//Close dialog
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import StepConnector from '@material-ui/core/StepConnector'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'
import Fade from '@material-ui/core/Fade'
import Collapse from '@material-ui/core/Collapse'

import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import InfoIcon from '@material-ui/icons/Info'

const GOALS = [
    {label: 'Weight Loss', value: 0},
    {label: 'Weight Gain', value: 1}
]

const NEAT = [
    {
        label: 'Very Low',
        value: 9,
        tip:
            'Work: Minimal movement, desk job. Life outside of work: minimal physical activity'
    },
    {
        label: 'Low',
        value: 10,
        tip:
            'Work: low movement, desk job., light physical activity. Life outside of work: low physical activity, occasional walks'
    },
    {
        label: 'Moderate',
        value: 12,
        tip:
            'Job or work involves significant activity, (not both), work on your feet, or work and life outside of work involve moderate physical activity.'
    },
    {
        label: 'High',
        value: 15,
        tip:
            'Work: Minimal movement, desk job. Life outside of work: minimal physical activity'
    }
]

const EXP = [
    {
        label: 'Newbie',
        tip:
            'Very new to fitness and nutrition. Zero or very little prior activity.',
        value: 0
    },
    {
        label: 'Intermediate',
        tip:
            'Some experience with exercise and nutrition. Maybe on/off with approach or de-conditioned.',
        value: 1
    },
    {
        label: 'Advanced',
        tip:
            'Very experienced, avid exerciser/gym goer. Typically very active.',
        value: 2
    }
]

const NEW_GAIN = {
    max: 0.015,
    mid: 0.0125,
    min: 0.01
}

const INTERMEDIATE_GAIN = {
    max: 0.01,
    mid: 0.0075,
    min: 0.005
}

const ADVANCED_GAIN = {
    max: 0.005,
    mid: 0.00375,
    min: 0.0025
}

const FAT_LOSS = {
    max: 0.01,
    mid: 0.0075,
    min: 0.005
}

const useStyles = makeStyles(theme => ({
    form: {
        textAlign: 'center'
    },
    center: {
        textAlign: 'center'
    },
    root: {
        margin: 0,
        padding: theme.spacing(2)
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: 'black'
        // backgroundColor: 'lightgrey',
        // opacity: 0.6
    },
    space: {
        justifyContent: 'space-around',
        backgroundColor: 'grey'
    },
    stepper: {
        padding: 0,
        marginBottom: 20
    },
    signUpBtn: {
        backgroundColor: 'rgba(237,49,100,0.9)',
        /* padding: 10px 20px 10px 20px; */
        border: '1px solid rgba(0,0,0,0.9)',
        borderRadius: '30px',
        fontSize: '1em',
        color: 'white',

        '&hover': {
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.9)'
        },
        '&active': {
            backgroundColor: 'rgba(0,0,0,0.9)',
            border: '1px solid rgba(255,255,255,0.9)'
        }
    },
    formControl: {
        // margin: theme.spacing(1),
        minWidth: '100%'
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />
})

const steps = ['Setup', 'Evaluate', 'Get Started']

const baseFields = [
    {name: 'name', type: 'text'},
    {name: 'email', type: 'email'},
    {name: 'password', type: 'password'},
    {name: 'confirm_password', type: 'password'},
    {name: 'current_weight', type: 'number'}
]

const useColorlibStepIconStyles = makeStyles({
    root: {
        backgroundColor: '#ccc',
        zIndex: 1,
        color: '#fff',
        width: 50,
        height: 50,
        display: 'flex',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    active: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)'
    },
    completed: {
        backgroundImage:
            'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)'
    }
})

function TFStepIcon(props) {
    const classes = useColorlibStepIconStyles()
    const {active, completed} = props

    const icons = {
        1: <PersonAddIcon />,
        2: <SettingsIcon />,
        3: <DoneAllIcon />
    }

    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.completed]: completed
            })}
        >
            {icons[String(props.icon)]}
        </div>
    )
}

const TFConnector = withStyles({
    alternativeLabel: {
        top: 22
    },
    active: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    completed: {
        '& $line': {
            backgroundImage:
                'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)'
        }
    },
    line: {
        height: 3,
        border: 0,
        backgroundColor: '#eaeaf0',
        borderRadius: 1
    }
})(StepConnector)

const validate = values => {
    const errors = {}

    if (!values.update) {
        if (!values.name) {
            errors.name = 'Required'
        }
        if (!values.email) {
            errors.email = 'Required'
        }

        if (!values.confirm_password) {
            errors.confirm = 'Required'
        } else if (values.confirm_password !== values.password) {
            errors.confirm = 'Must match'
        }
        if (!values.prior_exp) {
            errors.prior_exp = 'Required'
        }
    }

    if (!values.current_weight) {
        errors.current_weight = 'Required'
    }

    if (!values.tbw) {
        errors.tbw = 'Required'
    }

    if (!values.goal) {
        errors.goal = 'Required'
    }

    if (!values.hours_active) {
        errors.hours_active = 'Required'
    }

    if (!values.neat) {
        errors.neat = 'Required'
    }
    return errors
}

/**
 * Reusable Form Field Component For TextFields
 * @param {string} name - name for RFF Field
 * @param {string} label - label for field
 * @param {string} type - html form field type
 * @param {string | null} helperText - optional help text, else null
 */
const BasicFieldComponent = ({name, label, type, helperText = null}) => {
    const fieldName = useField(name)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
    console.log(fieldName)
    return (
        <Grid item xs={10} md={4}>
            <TextField
                name={fieldName.input.name}
                label={label}
                type={type}
                required
                error={
                    fieldName.meta.error && fieldName.meta.touched
                        ? fieldName.meta.error
                        : false
                }
                fullWidth={fullScreen ? true : false}
                value={fieldName.input.value}
                onChange={fieldName.input.onChange}
                helperText={helperText}
            />
        </Grid>
    )
}

/**
 * Reusable Form Field Component For SelectFields
 * @param {string} name - name for RFF Field
 * @param {string} label - label for field
 * @param {string} type - html form field type
 * @param {array} children - array of menuItems
 * @param {string | null} helperText - optional help text, else null
 */
const BasicSelect = ({
    name,
    label,
    type,
    children,
    helperText,
    tips = null
}) => {
    const fieldName = useField(name)
    const classes = useStyles()
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const align = helperText ? 'center' : 'flex-end'
    // console.log(fieldName)
    return (
        <Grid alignItems={align} item container spacing={2}>
            <Grid item xs={1}>
                {tips ? (
                    <Tooltip title={tips}>
                        <InfoIcon />
                    </Tooltip>
                ) : null}
            </Grid>

            <Grid item xs={10}>
                <FormControl className={classes.formControl}>
                    <InputLabel id={`select-${name}`}>{label}</InputLabel>
                    <Select
                        name={fieldName.input.name}
                        labelId={`select-${name}`}
                        id={`select-${name}`}
                        type={type}
                        error={
                            fieldName.meta.error && fieldName.meta.touched
                                ? fieldName.meta.error
                                : false
                        }
                        required
                        fullWidth={fullScreen ? true : false}
                        value={fieldName.input.value}
                        onChange={fieldName.input.onChange}
                        children={children}
                    />
                    {helperText ? (
                        <FormHelperText>{helperText}</FormHelperText>
                    ) : null}
                </FormControl>
            </Grid>
        </Grid>
    )
}

/**
 * Component For Handling Target Body Weight
 * Rendering and Calculation.
 *
 */
const TBWBlock = () => {
    const fieldName = useField('tbw')
    const [tbw, setTBW] = useState(0)
    const form = useForm()
    const theme = useTheme()

    const {goal, prior_exp, current_weight} = form.getState().values

    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    useEffect(() => {
        calculateTWB()
    }, [])

    const calculateTWB = () => {
        if (goal !== null && current_weight && prior_exp !== null) {
            let parsedWeight = parseInt(current_weight)
            if (prior_exp === 0) {
                //Beginner Weight Loss
                if (goal === 0) {
                    let potentialLoss = parsedWeight * FAT_LOSS.max
                    setTBW(parsedWeight - potentialLoss * 12)
                }
                //Beginner Weight Gain
                else if (goal === 1) {
                    let potentialGain = parsedWeight * NEW_GAIN.mid
                    setTBW(parsedWeight + potentialGain * 3)
                }
            } else if (prior_exp === 1) {
                //Intermediate Weight Loss
                if (goal === 0) {
                    let potentialLoss = parsedWeight * FAT_LOSS.mid
                    setTBW(parsedWeight - potentialLoss * 12)
                }
                //Intermediate Weight Gain
                else if (goal === 1) {
                    let potentialGain = parsedWeight * INTERMEDIATE_GAIN.mid
                    setTBW(parsedWeight + potentialGain * 3)
                }
            } else if (prior_exp === 2) {
                //Advanced Weight Loss
                if (goal === 0) {
                    let potentialLoss = parsedWeight * FAT_LOSS.min
                    setTBW(parsedWeight - potentialLoss * 12)
                }
                //Advanced Weight Gain
                else if (goal === 1) {
                    let potentialGain = parsedWeight * ADVANCED_GAIN.mid
                    setTBW(parsedWeight + potentialGain * 3)
                }
            }
        }
    }

    useEffect(() => {
        fieldName.input.onChange(tbw.toFixed(0))
    }, [tbw])

    return (
        <Grid item xs={10} md={4}>
            <Collapse in={tbw > 0}>
                <TextField
                    name={fieldName.input.name}
                    label={
                        <Typography variant="subtitle2">
                            Target Body Weight (lbs)
                        </Typography>
                    }
                    type={'text'}
                    InputProps={{
                        readOnly: true
                    }}
                    helperText={'This is a realistic goal over 3 months.'}
                    fullWidth={fullScreen ? true : false}
                    value={fieldName.input.value}
                    onChange={fieldName.input.onChange}
                />
            </Collapse>
            <OnChange name="prior_exp">
                {(value, previous) => {
                    calculateTWB()
                }}
            </OnChange>
            <OnChange name="current_weight">
                {(value, previous) => {
                    calculateTWB()
                }}
            </OnChange>
            <OnChange name="goal">
                {(value, previous) => {
                    calculateTWB()
                }}
            </OnChange>
        </Grid>
    )
}

/**
 * Component Combining Required Evaluation Fields For
 * Stepper Pages
 * TODO: Edit for update mode vs signup
 */
const EvaluateBlock = () => {
    const classes = useStyles()
    return (
        <Grid item container justify="center" spacing={5}>
            <BasicSelect
                name={'goal'}
                type={'text'}
                label={'What is your main goal?'}
                children={GOALS.map(g => (
                    <MenuItem value={g.value}>{g.label}</MenuItem>
                ))}
            />
            <BasicSelect
                name={'prior_exp'}
                type={'text'}
                label={'Prior fitness experience level.'}
                children={EXP.map(g => (
                    <MenuItem value={g.value}>{g.label}</MenuItem>
                ))}
                tips={EXP.map(t => (
                    <Typography className={classes.center} variant="caption">
                        <strong>{t.label}</strong>
                        {': ' + t.tip}
                        <br />
                        <br />
                    </Typography>
                ))}
            />

            <TBWBlock />

            <BasicSelect
                name={'neat'}
                type={'text'}
                helperText={"Exclude formal exercise! (That's next)"}
                tips={NEAT.map(t => (
                    <Typography className={classes.center} variant="caption">
                        <strong>{t.label}</strong>
                        {': ' + t.tip}
                        <br />
                        <br />
                    </Typography>
                ))}
                label={'Daily activity level.'}
                children={NEAT.map(g => (
                    <MenuItem value={g.value}>{g.label}</MenuItem>
                ))}
            />

            <BasicFieldComponent
                name={'hours_active'}
                label={'Active hours per week.'}
                type={'number'}
                helperText="Include: Hiking, Cardio, Weight Training, Sports etc"
            />
        </Grid>
    )
}

const StartBlock = () => {
    const form = useForm()
    console.log(form.getState())
    return (
        <Grid container style={{textAlign: 'center'}} justify="center">
            <Grid item xs={12}>
                <Button
                    variant="contained"
                    style={{backgroundColor: 'black', color: 'white'}}
                    type="submit"
                >
                    Start!
                </Button>
            </Grid>
        </Grid>
    )
}

/**
 * MUI Active Stepper Component
 * @param {number} activeStep - current active step of stepper
 */
const FormStepper = ({activeStep}) => {
    const classes = useStyles()
    return (
        <Stepper
            className={classes.stepper}
            activeStep={activeStep}
            alternativeLabel
            connector={<TFConnector />}
        >
            {steps.map(label => (
                <Step key={label}>
                    <StepLabel StepIconComponent={TFStepIcon}>
                        {label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

/**
 * RFF Form Component
 * @param {number} step -current active step
 */
const FormComponent = ({step}) => {
    const dispatch = useDispatch()
    const classes = useStyles()

    const onSubmit = values => dispatch(signUpUser(values))
    const replaceNCap = str =>
        str === 'current_weight'
            ? str.charAt(0).toUpperCase() +
              str.slice(1).replace('_', ' ') +
              '(lbs)'
            : str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ')

    return (
        <Form onSubmit={onSubmit} validate={validate}>
            {props => (
                <form onSubmit={props.handleSubmit}>
                    {step === 0 ? (
                        <Grid justify="center" container spacing={5}>
                            {baseFields.map(f => (
                                <BasicFieldComponent
                                    name={f.name}
                                    label={replaceNCap(f.name)}
                                    type={f.type}
                                />
                            ))}
                            <BasicSelect
                                name={'gender'}
                                type={'text'}
                                label={'Gender (that you identify as)'}
                                children={[
                                    {label: 'Male', value: 0},
                                    {label: 'Female', value: 1},
                                    {label: 'Prefer Not To State', value: -1}
                                ].map(g => (
                                    <MenuItem value={g.value}>
                                        {g.label}
                                    </MenuItem>
                                ))}
                            />
                        </Grid>
                    ) : step === 1 ? (
                        <EvaluateBlock />
                    ) : (
                        <StartBlock />
                    )}
                </form>
            )}
        </Form>
    )
}

/**
 * Sign Up Form Component
 */
export default function SignUpForm() {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const classes = useStyles()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const next = (
        <Button
            onClick={handleNext}
            disabled={activeStep === 2}
            size="large"
            style={{color: 'white'}}
            autoFocus
        >
            Next
        </Button>
    )

    return (
        <div>
            <Button
                variant="contained"
                className={classes.signUpBtn}
                onClick={handleClickOpen}
            >
                Sign Up For Free
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    className={classes.center}
                    style={{color: 'black'}}
                    id="responsive-dialog-title"
                >
                    Get True Fit!
                    <IconButton
                        aria-label="close"
                        className={classes.closeButton}
                        onClick={handleClose}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FormStepper activeStep={activeStep} />
                    <FormComponent step={activeStep} />
                </DialogContent>
                <DialogActions className={classes.space}>
                    <Button
                        autoFocus
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        size="large"
                        style={{color: 'white'}}
                    >
                        Back
                    </Button>
                    {activeStep === 2 ? null : next}
                </DialogActions>
            </Dialog>
        </div>
    )
}
