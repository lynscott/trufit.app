import React, {useState, useEffect} from 'react'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import {Form, useForm, useField} from 'react-final-form'
import {signUpUser, resetSignUpFail} from '../actions'
import {useDispatch, useSelector} from 'react-redux'
import Button from '@material-ui/core/Button'

//Dialog imports
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
// import DialogTitle from '@material-ui/core/DialogTitle'
import {useTheme, makeStyles, withStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

//Stepper
import Zoom from '@material-ui/core/Zoom'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'

//Close dialog
import MuiDialogTitle from '@material-ui/core/DialogTitle'
import MuiDialogContent from '@material-ui/core/DialogContent'
import MuiDialogActions from '@material-ui/core/DialogActions'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Typography from '@material-ui/core/Typography'

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
        color: theme.palette.grey[500]
    }
}))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Zoom ref={ref} {...props} />
})

const DialogTitle = withStyles(useStyles)(props => {
    const {children, classes, onClose, ...other} = props
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    )
})

const steps = ['Account Info', 'Personalize Profile', 'Success']

const baseFields = [
    {name: 'name', tpye: 'text'},
    {name: 'email', type: 'email'},
    {name: 'password', type: 'password'},
    {name: 'confirm_password', type: 'password'},
    {name: 'current_weight', type: 'number'}
]

const BasicFieldComponent = ({name, label, type}) => {
    const fieldName = useField(name)
    const theme = useTheme()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
    return (
        <Grid item xs={12} md={4}>
            <TextField
                name={fieldName.input.name}
                label={label}
                type={type}
                required
                fullWidth={fullScreen ? true : false}
                value={fieldName.input.value}
                onChange={fieldName.input.onChange}
            />
        </Grid>
    )
}

const FormStepper = () => {
    const [activeStep, setActiveStep] = React.useState(0)

    const handleNext = () => {
        setActiveStep(prevActiveStep => prevActiveStep + 1)
    }

    const handleBack = () => {
        setActiveStep(prevActiveStep => prevActiveStep - 1)
    }

    const handleReset = () => {
        setActiveStep(0)
    }

    return (
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(label => (
                <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                </Step>
            ))}
        </Stepper>
    )
}

const FormComponent = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const onSubmit = values => dispatch(signUpUser(values))
    const replaceNCap = str =>
        str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ')

    return (
        <Form onSubmit={onSubmit}>
            {props => (
                <form onSubmit={props.handleSubmit}>
                    <Grid justify="center" container spacing={4}>
                        {baseFields.map(f => (
                            <BasicFieldComponent
                                name={f.name}
                                label={replaceNCap(f.name)}
                                type={f.type}
                            />
                        ))}
                        <FormStepper />

                        <Button variant="contained" type="submit">
                            Submit
                        </Button>
                    </Grid>
                </form>
            )}
        </Form>
    )
}

export default function SignUpForm() {
    const [open, setOpen] = React.useState(false)
    const theme = useTheme()
    const classes = useStyles()
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                Sign Up
            </Button>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                TransitionComponent={Transition}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle
                    // className={classes.center}
                    id="responsive-dialog-title"
                >
                    {'Sign Up For True Fit'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.center}>
                        {/* Let Google help apps determine location. This means
                        sending anonymous location data to Google, even when no
                        apps are running. */}
                    </DialogContentText>
                    <FormComponent />
                </DialogContent>
                <DialogActions>
                    {/* <Button autoFocus onClick={handleClose} color="primary">
                        Disagree
                    </Button>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Agree
                    </Button> */}
                </DialogActions>
            </Dialog>
        </div>
    )
}
