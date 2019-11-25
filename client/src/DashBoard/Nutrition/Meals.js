import React, {useState, useEffect} from 'react'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {makeStyles} from '@material-ui/core/styles'
import NutritionGrid from './NutritionGrid'
import {fetchMeals} from '../../actions'
import {useDispatch, useSelector} from 'react-redux'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Button from '@material-ui/core/Button'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'

import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
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
import amber from '@material-ui/core/colors/amber'
import green from '@material-ui/core/colors/green'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0
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
        marginTop: '30px'
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
    button: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
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
    }
}))

const SimpleCard = ({label, protein, carbs, fats, cals, quantity, serving}) => {
    const classes = useStyles()
    // console.log(label, protein, carbs, fats, cals, quantity, serving)

    return (
        <Card className={classes.carStyle}>
            <CardContent
                style={{backgroundColor: 'lightgrey'}}
                className={classes.carStyle}
            >
                <Typography variant="h5" component="h2">
                    {label}
                </Typography>
                <Typography
                    color="textSecondary"
                    style={{fontSize: '13px'}}
                    gutterBottom
                >
                    {'Serving: ' + serving}
                    <br /> {'Amount: ' + quantity}
                </Typography>

                <Typography color="textSecondary">Nutrients</Typography>
                <List>
                    <ListItem className={classes.alignDialog}>
                        <ListItemText
                            primary={protein.toFixed(2) + 'g'}
                            secondary="Protein"
                        />
                    </ListItem>
                    <ListItem className={classes.alignDialog}>
                        <ListItemText
                            primary={carbs.toFixed(2) + 'g'}
                            secondary="Carbs"
                        />
                    </ListItem>
                    <ListItem className={classes.alignDialog}>
                        <ListItemText
                            primary={fats.toFixed(2) + 'g'}
                            secondary="Fats"
                        />
                    </ListItem>
                    <ListItem className={classes.alignDialog}>
                        <ListItemText
                            primary={cals.toFixed(2)}
                            secondary="Calories"
                        />
                    </ListItem>
                </List>
            </CardContent>
        </Card>
    )
}

const FormDialog = ({status, id, handleClose}) => {
    const dispatch = useDispatch()
    const [foodSearch, setSearch] = useState('')
    const classes = useStyles()

    const foodFound = useSelector(state => state.nutrition.foodFound)
    const foodSelected = useSelector(state => state.nutrition.foodSelected)
    const searchLoading = useSelector(state => state.nutrition.foodLoading)
    const searchList = useSelector(state => state.nutrition.searchList)

    const handleChange = event => {
        setSearch(event.target.value)
    }

    const handleSearch = event => {
        dispatch(foodSearchV2(event.value, parse))
    }

    const handleSearch0 = event => {
        dispatch(foodSearchV2(foodSearch, 1))
    }

    const handleChange2 = event => {
        // setSearch(event)
        dispatch(foodSearchV2(event, -1))
    }

    const handleSelect = () => {
        dispatch(foodSearchV2({food: foodSelected, id}, nutrient))
    }

    // console.log(searchList, 'LIST')

    return (
        <Grid item justify="center">
            <Dialog
                open={status}
                className={classes.alignDialog}
                scroll={'body'}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle
                    className={classes.alignDialog}
                    id="form-dialog-title"
                >
                    Food Lookup{' '}
                    <div id="edamam-badge" dataColor="transparent"></div>
                </DialogTitle>

                <DialogContent className={classes.alignDialog}>
                    <DialogContentText style={{fontSize: '14px'}}>
                        Tip: Search for a food item by itself or in certain
                        amount e.g. "5oz of broccoli"
                    </DialogContentText>

                    {/* <Select
            options={searchList}
            onInputChange={handleChange2}
            onChange={handleSearch}
          /> */}
                    {searchLoading ? (
                        <CircularProgress />
                    ) : (
                        <TextField
                            autoFocus
                            margin="dense"
                            id="search"
                            // label="Food Search"
                            type="text"
                            fullWidth
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleSearch0}>
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}

                    {foodFound && !searchLoading ? (
                        <Zoom in={foodFound}>
                            <SimpleCard
                                label={foodFound ? foodSelected.food.label : ''}
                                protein={
                                    foodFound
                                        ? foodSelected.food.nutrients.PROCNT
                                        : ''
                                }
                                carbs={
                                    foodFound
                                        ? foodSelected.food.nutrients.CHOCDF
                                            ? foodSelected.food.nutrients.CHOCDF
                                            : 0
                                        : ''
                                }
                                fats={
                                    foodFound
                                        ? foodSelected.food.nutrients.FAT
                                        : ''
                                }
                                cals={
                                    foodFound
                                        ? foodSelected.food.nutrients.ENERC_KCAL
                                        : ''
                                }
                                quantity={foodSelected.quantity}
                                serving={foodSelected.measure.label}
                            />
                        </Zoom>
                    ) : null}
                </DialogContent>
                <DialogActions className={classes.alignDialog}>
                    <Button
                        onClick={handleClose}
                        className={classes.button}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSelect}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        disabled={!foodFound}
                    >
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

const MealPanels = () => {
    //TODO: FIx bug with measure uri
    //TODO: Add ui for food item add and researching for food & add to UX
    //TODO: Fix bug with quantity vs yield
    //TODO: Fix fields that should be un-editable
    //TODO: Setup add meal form
    //TODO: Add some stats? total meal count, avg cal/day eaten
    // Bonus TODO: Add bad food log
    const classes = useStyles()
    const dispatch = useDispatch()
    const userMeals = useSelector(state => state.nutrition.userMeals)

    if (userMeals.length === 0) dispatch(fetchMeals)

    const [meals, setMeals] = useState([])

    const [newMeal, setNewMeal] = useState({name: '', items: ''})

    const [open, setOpen] = useState({status: false, meal: null})
    const [confirmDelete, setDelete] = useState(false)

    const handleClickOpen = i => {
        setOpen({status: true, meal: userMeals[i]._id})
    }

    const handleClose = () => {
        setOpen({status: false, meal: null})
    }

    useEffect(() => {
        dispatch(fetchMeals())
        setMeals(userMeals)
    }, [])

    // console.log(meals, userMeals);

    const formatMeals = meal => {
        let total = 0
        meal.items.map(t => (total += parseInt(t.calories)))

        return total
    }

    let panels = []
    panels = userMeals.map((m, i) => {
        return (
            <ExpansionPanel
                classes={{
                    expanded: classes.expanded
                }}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={'meal-panel-' + i}
                    id={'meal-panel-' + i}
                    style={{justifyContent: 'space-around'}}
                >
                    <Typography className={classes.heading}>
                        {m.name ? m.name : 'Meal ' + (i + 1)}
                    </Typography>
                    <Typography className={classes.secondaryHeading}>
                        {'Calories: ' + formatMeals(m)}
                    </Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails className={classes.table}>
                    <NutritionGrid meal={m.items} id={m._id} />
                </ExpansionPanelDetails>

                {/* <Divider /> */}

                <ExpansionPanelActions className={classes.action}>
                    <Slide
                        direction="right"
                        in={!confirmDelete}
                        mountOnEnter
                        unmountOnExit
                    >
                        <div>
                            <Button
                                color="secondary"
                                className={classes.button}
                                onClick={() => setDelete(true)}
                                size="small"
                                variant="outlined"
                            >
                                Delete
                            </Button>
                            <Button
                                variant="outlined"
                                className={classes.button}
                                size="small"
                                color="primary"
                                onClick={() => handleClickOpen(i)}
                            >
                                <>
                                    <Add /> Item
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
                                onClick={() => dispatch(deleteMeal(m._id))}
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
                </ExpansionPanelActions>
            </ExpansionPanel>
        )
    })

    return (
        <Grid item container xs={12}>
            <FormDialog
                handleClose={handleClose}
                id={open.meal}
                status={open.status}
            />
            <Grid xs={12}>{panels}</Grid>
            <Grid className={classes.textCenter} item xs={12}>
                <Fab
                    color="primary"
                    variant="extended"
                    aria-label="add"
                    className={classes.fab}
                >
                    <AddIcon /> New Meal
                </Fab>
            </Grid>
        </Grid>
    )
}

export default MealPanels
