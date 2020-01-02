import React, {useState, useEffect, forwardRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {fetchMeals, editMeal} from '../../actions'
import {makeStyles} from '@material-ui/core/styles'
import {tableIcons} from '../../constants/TableIcons'

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    }
}))

const NutritionTable = ({meal}) => {
    //TODO: Fix the name edits for edamame meals
    const dispatch = useDispatch()
    const customMeal = {
        name: '',
        serving: '',
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    }
    const [mealState, setMeals] = useState([])

    const handleEdit = data => {
        setMeals(data)

        delete data['tableData']
        dispatch(editMeal(data, meal._id))

        //NOTE: For now we'll fetch all meals after deleting an item
        //This would be better if the grid handled individual meal state
        dispatch(fetchMeals())
    }

    useEffect(() => {
        let m = formatNewState(meal.items)
        setMeals(m)
    }, [])
    //Break into individual meal calls for information

    const nutrientSelector = (meal, item) => {
        if (!meal.totalNutrients[item]) return 0
        return meal.totalNutrients[item].quantity.toFixed(2)
    }

    const ingredientSelector = (meal, term) => {
        return meal.ingredients[0]['parsed'][0][term]
    }

    const formatNewState = meals => {
        if (!meal) return []
        for (let i = 0; i < meals.length; i++) {
            if ('totalNutrients' in meals[i] && 'ingredients' in meals[i]) {
                meals[i].carb = nutrientSelector(meals[i], 'CHOCDF')
                meals[i].protein = nutrientSelector(meals[i], 'PROCNT')
                meals[i].fats = nutrientSelector(meals[i], 'FAT')
                meals[i].name = ingredientSelector(meals[i], 'food')
                meals[i].serving =
                    ingredientSelector(meals[i], 'quantity') +
                    ' ' +
                    ingredientSelector(meals[i], 'measure')
            }
        }
        return meals
    }

    return (
        <Grid item xs={12}>
            <MaterialTable
                icons={tableIcons}
                columns={[
                    {title: 'Item Name', field: 'name'},
                    {title: 'Serving', field: 'serving', editable: 'never'},
                    {
                        title: 'Calories',
                        field: 'calories',
                        type: 'numeric',
                        editable: 'never'
                    },
                    {
                        title: 'Fats(g)',
                        field: 'fats',
                        type: 'numeric',
                        editable: 'never'
                    },
                    {
                        title: 'Carbs(g)',
                        field: 'carb',
                        type: 'numeric',
                        editable: 'never'
                    },
                    {
                        title: 'Protein(g)',
                        field: 'protein',
                        type: 'numeric',
                        editable: 'never'
                    }
                ]}
                data={formatNewState(meal.items)}
                title="Meal Details"
                options={{
                    selection: false,
                    toolbar: false,
                    emptyRowsWhenPaging: false,
                    headerStyle: {backgroundColor: 'black', color: 'white'},
                    grouping: false,
                    showTitle: false,
                    actionsColumnIndex: 6
                }}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = mealState
                                    let index = data.indexOf(oldData)
                                    data[index] = newData
                                    handleEdit(data)
                                    resolve()
                                }
                                resolve()
                            }, 1000)
                        }),
                    onRowDelete: oldData =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = mealState
                                    let index = data.indexOf(oldData)
                                    data.splice(index, 1)
                                    handleEdit(data)
                                    resolve()
                                }
                                resolve()
                            }, 1000)
                        })
                }}
            />
        </Grid>
    )
}

export default NutritionTable
