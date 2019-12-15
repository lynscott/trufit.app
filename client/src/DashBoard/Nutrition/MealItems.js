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
        justifyContent: 'center',
        fontSize: '12px'
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
    }
}))

const SimpleCard = ({label, protein, carbs, fats, cals, quantity, serving}) => {
    const classes = useStyles()

    return (
        <div style={{marginTop: '20px'}}>
            <Typography variant="h5" component="h2">
                {label}
            </Typography>
            <Typography
                // color="textSecondary"
                variant="caption"
                // style={{textAlign: 'center'}}
                gutterBottom
            >
                {'Serving: ' + serving == 'Serving' ? 1 : serving}
                <br /> {'Amount: ' + quantity}
            </Typography>

            {/* <Typography color="textSecondary">Nutrients</Typography> */}
            <List dense>
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
                <ListItem className={classes.alignDialog}>
                    <ListItemText
                        primary={cals.toFixed(2)}
                        secondary="Calories"
                    />
                </ListItem>
            </List>
        </div>
    )
}

const FormDialog = ({status, meal, handleClose, updateMeal}) => {
    const dispatch = useDispatch()
    const [foodSearch, setSearch] = useState('')
    const [foodState, setFoodState] = useState(null)
    const classes = useStyles()

    const foodFound = useSelector(state => state.nutrition.foodFound)
    const foodSelected = useSelector(state => state.nutrition.foodSelected)
    const searchLoading = useSelector(state => state.nutrition.foodLoading)
    const nutrientData = useSelector(state => state.nutrition.nutrientData)

    useEffect(() => {
        setFoodState(foodSelected)
    }, [foodSelected])

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
    }

    const foodCard = () => {
        if (foodState && !searchLoading)
            return (
                <Zoom in={foodFound}>
                    <SimpleCard
                        label={foodState.food.label}
                        protein={foodState.food.nutrients.PROCNT}
                        carbs={
                            foodState.food.nutrients.CHOCDF
                                ? foodState.food.nutrients.CHOCDF
                                : 0
                        }
                        fats={foodState.food.nutrients.FAT}
                        cals={foodState.food.nutrients.ENERC_KCAL}
                        quantity={foodState.quantity}
                        serving={foodState.measure.label}
                    />
                </Zoom>
            )
        else if (searchLoading) return <CircularProgress />
        else return null
    }

    return (
        <Grid item>
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
                    <div id="edamam-badge" datacolor="transparent"></div>
                </DialogTitle>

                <DialogContent>
                    <DialogContentText
                        className={classes.alignDialog}
                        style={{fontSize: '14px'}}
                    >
                        Tip: Search for a food item by itself or in certain
                        amount e.g. "5oz of broccoli"
                    </DialogContentText>

                    {searchLoading ? (
                        <CircularProgress />
                    ) : (
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
                    )}

                    {foodCard()}
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

export default FormDialog
