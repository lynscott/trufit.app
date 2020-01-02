import React, {useState, useEffect, forwardRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import * as actions from '../../actions'
import {makeStyles} from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import red from '@material-ui/core/colors/red'
import Slide from '@material-ui/core/Slide'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'

import {tableIcons} from '../../constants/TableIcons'

const useStyles = makeStyles(theme => ({
    textCenter: {
        textAlign: 'center',
        marginTop: 20
    },
    fab: {
        backgroundImage:
            'linear-gradient(to top, rgba(241, 97, 74, 1), rgba(244, 123, 40, 1))',
        color: 'white'
    },
    meals: {
        backgroundColor: theme.palette.background.paper
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
    expanded: {
        backgroundColor: 'lightgrey'
    }
}))

//TODO: Add meal detail view for plan scheduling
//TODO: Create CRUD UI for nutrition plans
// Setup Active plan status -> updateOV
const CreatePlan = () => {
    const dispatch = useDispatch()
    const classes = useStyles()
    const [open, setOpen] = useState(false)
    const [name, setName] = useState('')

    return (
        <Grid className={classes.textCenter} item xs={12}>
            <Fab
                variant="extended"
                aria-label="add meal"
                onClick={() => setOpen(!open)}
                className={classes.fab}
            >
                <AddIcon /> New Meal Plan
            </Fab>
            <Slide direction="up" in={open} mountOnEnter unmountOnExit>
                <Grid className={classes.textCenter} item md={4} xs={12}>
                    <Paper>
                        <Typography variant="h6" component="h4">
                            Lets give this plan a name.
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
                            // onChange={e => setName(e.target.value)}
                        />
                        <Button
                            // onClick={createMeal}
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

const DetailTable = ({data}) => {
    const [open, updateOpen] = useState(false)
    const classes = useStyles()

    return (
        <ExpansionPanel
            classes={{
                expanded: classes.expanded
            }}
        >
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={'meal-plan-panel-' + data.name}
                id={'meal-plan-panel-' + data.name}
                style={{justifyContent: 'space-around'}}
            >
                <Typography className={classes.heading} noWrap>
                    {data.name}
                </Typography>
                <Typography className={classes.secondaryHeading}>
                    {/* {'Calories: ' + formatMeals(meal)} */}
                </Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails className={classes.table}>
                <MaterialTable
                    icons={tableIcons}
                    columns={[
                        {title: 'Days', field: 'days'},

                        {title: 'Status', field: 'status'}
                    ]}
                    data={[data]}
                    title="Nutrition Plans"
                    options={{
                        selection: false,
                        headerStyle: {backgroundColor: 'black', color: 'white'}
                    }}
                />
            </ExpansionPanelDetails>

            <ExpansionPanelActions className={classes.action}>
                {/* <MealActions {...actionProps} /> */}
            </ExpansionPanelActions>
        </ExpansionPanel>
    )
}

const PlanView = () => {
    const dispatch = useDispatch()
    const plans = useSelector(state => state.nutrition.userNutritionPlans)
    const classes = useStyles()
    useEffect(() => {
        dispatch(actions.fetchNutritionPlans())
    }, [])

    useEffect(() => {
        // dispatch(actions.fetchMealsById(plans.items))
    })
    console.log(plans)
    return (
        <Grid container>
            <Grid item xs={12}>
                <List
                    component="nav"
                    className={classes.meals}
                    aria-label="meal list"
                >
                    {plans.map(p => (
                        <DetailTable data={p} />
                    ))}
                </List>
            </Grid>
            <CreatePlan />
        </Grid>
    )
}

export default PlanView
