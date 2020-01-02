import React, {useState, useEffect} from 'react'

import {fetchMeals} from '../../actions'
import * as actions from '../../actions'
import {useDispatch, useSelector} from 'react-redux'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Grid from '@material-ui/core/Grid'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import {foodSearchV2, deleteMeal, parse, nutrient} from '../../actions'
import {makeStyles} from '@material-ui/core/styles'

import Select from 'react-select'
import Search from '@material-ui/icons/Search'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'
import Zoom from '@material-ui/core/Zoom'

import red from '@material-ui/core/colors/red'
import Button from '@material-ui/core/Button'

import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Backdrop from '@material-ui/core/Backdrop'

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
        marginRight: theme.spacing(1),
        color: 'rgb(26, 161, 114)'
    },
    alignDialog: {
        textAlign: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        padding: 0
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
        padding: theme.spacing(3, 2)
    },
    mealBtn: {
        backgroundColor: 'lightred',
        '&on-hover': {
            backgroundColor: 'red'
        }
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff'
    },
    title: {
        textAlign: 'center'
    }
}))

const flexContainer = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0
}

const SimpleCard = ({label, protein, carbs, fats, cals, quantity, serving}) => {
    const classes = useStyles()
    console.log(serving) //TODO: Reset state on close

    return (
        <div style={{marginTop: '20px'}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography
                        className={classes.title}
                        color="textSecondary"
                        gutterBottom
                    >
                        {'Serving: ' + serving === 'Serving'
                            ? 1
                            : serving === null
                            ? 'Whole'
                            : serving}
                        {' | Amount: ' + quantity}
                    </Typography>
                    <Typography
                        className={classes.title}
                        variant="h5"
                        component="h2"
                    >
                        {label}
                    </Typography>
                    <Typography className={classes.title} color="textSecondary">
                        {cals.toFixed(2)} calories
                    </Typography>
                    <List style={flexContainer} dense>
                        <ListItem className={classes.alignDialog}>
                            <ListItemText
                                primary={protein.toFixed(2) + 'g'}
                                secondary="Protein"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.alignDialog}>
                            <ListItemText
                                primary={carbs.toFixed(2) + 'g'}
                                secondary="Carbs"
                            />
                        </ListItem>
                        <Divider />
                        <ListItem className={classes.alignDialog}>
                            <ListItemText
                                primary={fats.toFixed(2) + 'g'}
                                secondary="Fats"
                            />
                        </ListItem>
                        <Divider />
                    </List>
                </CardContent>
            </Card>
        </div>
    )
}

const FormDialog = ({status, meal, handleClose, updateMeal}) => {
    const dispatch = useDispatch()
    const [foodSearch, setSearch] = useState('')
    const [foodState, setFoodState] = useState(null)
    const classes = useStyles()
    const [isOpen, setOpen] = useState(status)

    const foodFound = useSelector(state => state.nutrition.foodFound)
    const foodSelected = useSelector(state => state.nutrition.foodSelected)
    const searchLoading = useSelector(state => state.nutrition.foodLoading)
    const searchFailed = useSelector(state => state.nutrition.searchFailed)
    const nutrientData = useSelector(state => state.nutrition.nutrientData)

    useEffect(() => {
        setFoodState(foodSelected)
    }, [foodSelected])

    useEffect(() => {
        setOpen(status)
    }, [status])

    const handleChange = event => {
        setSearch(event.target.value)
    }

    const handleSearch = event => {
        dispatch(foodSearchV2(foodSearch, 1))
    }

    useEffect(() => {
        if (nutrientData) {
            let clone = meal
            clone.items.push(nutrientData)
            // console.log(clone, 'gucci')
            updateMeal(clone)
        }
    }, [nutrientData])

    const handleSelect = () => {
        dispatch(foodSearchV2({food: foodState, id: meal._id}, nutrient))
        dispatch(fetchMeals())
        setFoodState(null)
        // setOpen(false)
    }

    const parseState = state => {
        let props = {}
        if (!state) return {}
        if ('food' in state) {
            props.label = state.food.label
            props.protein = state.food.nutrients.PROCNT
            if ('CHOCDF' in state.food.nutrients)
                props.carbs = foodState.food.nutrients.CHOCDF
            else props.carbs = 0
            props.fats = state.food.nutrients.FAT
            props.cals = state.food.nutrients.ENERC_KCAL
        } else return {}

        if ('quantity' in state) props.quantity = state.quantity
        else props.quantity = 1
        if ('measure' in state) props.serving = state.measure.label
        else props.serving = 'N/A'
        return props
    }

    const foodCard = () => {
        if (foodState && !searchLoading)
            return (
                <Zoom in={foodFound}>
                    <SimpleCard {...parseState(foodState)} />
                </Zoom>
            )
        else if (searchLoading) return null
        else if (searchFailed)
            return <Typography variant="overline">Item not found.</Typography>
        else return null
    }

    return (
        <Grid item>
            <Dialog
                open={isOpen}
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
                    <div id="edamam-badge" datacolor="transparent"></div>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        className={classes.alignDialog}
                        style={{fontSize: '14px', color: 'black'}}
                    >
                        Tip: Search for a food item by itself or in certain
                        amount e.g. "5oz of broccoli"
                    </DialogContentText>

                    <Backdrop className={classes.backdrop} open={searchLoading}>
                        <CircularProgress color="inherit" />
                    </Backdrop>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="search"
                        type="text"
                        fullWidth
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleSearch}>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />

                    {foodCard()}
                </DialogContent>
                <DialogActions className={classes.alignDialog}>
                    <Button onClick={handleClose} style={{color: 'black'}}>
                        Close
                    </Button>
                    <Button
                        onClick={handleSelect}
                        className={classes.button}
                        variant="text"
                        disabled={!foodFound || !foodState}
                    >
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )
}

export default FormDialog
