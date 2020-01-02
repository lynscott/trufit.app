import React, {useState, useEffect} from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/core/styles'
import NutritionGrid from './NutritionGrid'
import {fetchMeals} from '../../actions'
import * as actions from '../../actions'
import {useDispatch, useSelector} from 'react-redux'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Button from '@material-ui/core/Button'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import Paper from '@material-ui/core/Paper'

import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import {foodSearchV2, deleteMeal, parse, nutrient} from '../../actions'
import Select from 'react-select'
import Search from '@material-ui/icons/Search'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'
import Zoom from '@material-ui/core/Zoom'
import Slide from '@material-ui/core/Slide'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Add from '@material-ui/icons/Add'
import DeleteIcon from '@material-ui/icons/Delete'

import red from '@material-ui/core/colors/red'
import blue from '@material-ui/core/colors/blue'
import FormDialog from './MealItems'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
        flexGrow: 1,
        textAlign: 'left'
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    action: {
        justifyContent: 'space-around'
    },
    table: {
        overflowX: 'scroll',
        backgroundColor: 'lightgrey',
        padding: 0
    },
    column: {
        flexBasis: '33.33%'
    },
    textCenter: {
        textAlign: 'center',
        marginTop: '20px'
    },
    deleteBtn: {
        backgroundColor: red['A400'],
        color: 'white'
    },
    saveBtn: {
        backgroundColor: 'green'
    },
    addBtn: {
        backgroundColor: 'blue'
    },
    gridStyle: {
        backgroundColor: 'white'
    },
    button1: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: 'red'
    },
    button2: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        color: 'black'
    },
    alignDialog: {
        textAlign: 'center',
        justifyContent: 'center'
    },
    expanded: {
        backgroundColor: 'lightgrey'
    },
    orange: {
        color: '#fff',
        backgroundColor: 'orange' //deepOrange[500]
    },
    purple: {
        color: '#fff',
        backgroundColor: 'purple' //deepPurple[500]
    },
    cardStyle: {
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgrey'
    },
    newMeal: {
        padding: theme.spacing(3, 2),
        width: '100%'
    },
    mealBtn: {
        backgroundColor: 'lightred',
        '&on-hover': {
            backgroundColor: 'red'
        }
    },
    fab: {
        backgroundImage:
            'linear-gradient(to top, rgba(241, 97, 74, 1), rgba(244, 123, 40, 1))',
        color: 'white'
    }
}))

// $color1: rgba(236, 33, 103, 1);
// $color2: rgba(255, 255, 255, 1);
// $color3: rgba(244, 123, 40, 1);
// $color4: rgba(241, 97, 74, 1);
// $color5: rgb(26, 161, 114);

const NewMeal = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const user = useSelector(state => state.auth.user)

    const createMeal = () => {
        dispatch(actions.createNewMeal({name, creator: user._id}))
        dispatch(actions.fetchMeals())
        setOpen(false)
    }

    return (
        <Grid justify="center" container>
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <Grid className={classes.textCenter} item xs={12}>
                    <Fab
                        variant="extended"
                        aria-label="add"
                        onClick={() => setOpen(!open)}
                        className={classes.fab}
                    >
                        <AddIcon /> New Meal
                    </Fab>
                </Grid>
            </Slide>
            <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                <Grid className={classes.textCenter} item md={4} xs={12}>
                    <Paper className={classes.newMeal}>
                        <Typography variant="h6" component="h4">
                            Lets give this meal a name.
                        </Typography>
                        <Typography variant="subtitle" component="p">
                            This is for your personal reference.
                        </Typography>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="new-meal"
                            type="text"
                            fullWidth
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <Button
                            onClick={createMeal}
                            className={classes.mealBtn}
                            variant="text"
                        >
                            Next
                        </Button>
                    </Paper>
                </Grid>
            </Slide>
        </Grid>
    )
}

const MealActions = ({confirmDelete, setDelete, open, meal, setOpen}) => {
    const dispatch = useDispatch()
    const classes = useStyles()

    const handleDelete = async () => {
        await dispatch(deleteMeal(meal._id))
        setDelete(false)
    }
    return (
        <>
            <Slide
                direction="right"
                in={!confirmDelete}
                mountOnEnter
                unmountOnExit
            >
                <div>
                    <Button
                        color="secondary"
                        className={classes.button1}
                        onClick={() => setDelete(true)}
                        size="small"
                        variant="text"
                    >
                        Delete Meal
                    </Button>
                    <Button
                        variant="text"
                        className={classes.button2}
                        size="small"
                        color="primary"
                        onClick={() => setOpen(!open)}
                    >
                        <>
                            <Add />
                            Food Item
                        </>
                    </Button>
                </div>
            </Slide>

            <Slide
                direction="left"
                in={confirmDelete}
                mountOnEnter
                unmountOnExit
            >
                <ButtonGroup
                    size="small"
                    aria-label="small outlined button group"
                >
                    <Button
                        className={classes.deleteBtn}
                        onClick={handleDelete}
                        size="small"
                        variant="contained"
                    >
                        <DeleteIcon /> Confirm{' '}
                    </Button>
                    <Button
                        onClick={() => setDelete(false)}
                        size="small"
                        variant="contained"
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            </Slide>
        </>
    )
}

const MealPanel = ({m, i}) => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false)
    const [confirmDelete, setDelete] = useState(false)
    const [isNew, setInit] = useState(false)
    const [meal, updateMeal] = useState(m)

    const [actionProps, updateAProps] = useState({
        confirmDelete,
        setDelete,
        open,
        meal,
        setOpen
    })
    const [formProps, updateFormProps] = useState({
        handleClose,
        meal,
        status: open,
        updateMeal
    })

    useEffect(() => {
        updateAProps({
            confirmDelete,
            setDelete,
            open,
            meal,
            setOpen
        })
        updateFormProps({
            handleClose,
            meal,
            status: open,
            updateMeal
        })
    }, [open, meal, confirmDelete])

    useEffect(() => {
        if (meal.items.length === 0) {
            setOpen(true)
        }
    }, [meal])

    const handleClose = () => {
        dispatch(fetchMeals())
        setOpen(false)
    }

    const formatMeals = meal => {
        let total = 0
        meal.items.map(t => (total += parseInt(t.calories)))

        return total
    }

    return (
        <>
            <FormDialog {...formProps} />
            <Slide direction="down" in={true} mountOnEnter unmountOnExit>
                <ExpansionPanel
                    classes={{
                        expanded: classes.expanded
                    }}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={'meal-panel-' + i + meal.name}
                        id={'meal-panel-' + i + meal.name}
                        style={{justifyContent: 'space-around'}}
                    >
                        <Typography className={classes.heading} noWrap>
                            {meal.name ? meal.name : 'Unnamed Meal #' + (i + 1)}
                        </Typography>
                        <Typography className={classes.secondaryHeading}>
                            {'Calories: ' + formatMeals(meal)}
                        </Typography>
                    </ExpansionPanelSummary>

                    <ExpansionPanelDetails className={classes.table}>
                        <NutritionGrid meal={meal} />
                    </ExpansionPanelDetails>

                    <ExpansionPanelActions className={classes.action}>
                        <MealActions {...actionProps} />
                    </ExpansionPanelActions>
                </ExpansionPanel>
            </Slide>
        </>
    )
}

const MealList = () => {
    //TODO: Add some stats? total meal count, avg cal/day eaten
    // Bonus TODO: Add bad food log, figure out what a parsed amount is (1 whole?)
    const classes = useStyles()
    const dispatch = useDispatch()
    const userMeals = useSelector(state => state.nutrition.userMeals)

    const [meals, setMeals] = useState([])
    console.log(userMeals)

    useEffect(() => {
        dispatch(fetchMeals())
        setMeals(userMeals)
    }, [])

    return (
        <Grid item className={classes.alignDialog} container xs={12}>
            <Grid xs={12}>
                {userMeals.map((m, i) => (
                    <MealPanel key={i} m={m} i={i} />
                ))}
            </Grid>
            <NewMeal />
        </Grid>
    )
}

export default MealList
