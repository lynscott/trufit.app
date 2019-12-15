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
    const dispatch = useDispatch()
    const customMeal = {
        name: '',
        serving: '',
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    }
    const [mealState, setMeals] = useState(meal.items)

    useEffect(() => {
        setMeals(meal.items)
    }, [meal])

    const formatNewState = meals => {
        if (!meal) return []
        for (let i = 0; i < meals.length; i++) {
            if ('totalNutrients' in meals[i]) {
                meals[i].carb = meals[i]['totalNutrients']['CHOCDF'][
                    'quantity'
                ].toFixed(2)
                meals[i].protein = meals[i]['totalNutrients']['PROCNT'][
                    'quantity'
                ].toFixed(2)
                meals[i].fats = meals[i]['totalNutrients']['FAT'][
                    'quantity'
                ].toFixed(2)
                meals[i].name = meals[i]['ingredients'][0]['parsed'][0]['food']
                meals[i].serving =
                    meals[i]['ingredients'][0]['parsed'][0]['quantity'] +
                    ' ' +
                    meals[i]['ingredients'][0]['parsed'][0]['measure']
            }
        }
        return meals
    }

    return (
        <Grid item xs={12}>
            <MaterialTable
                icons={tableIcons}
                columns={[
                    {title: 'Item', field: 'name'},
                    {title: 'Serving', field: 'serving'},
                    {
                        title: 'Calories',
                        field: 'calories',
                        type: 'numeric',
                        readonly: true
                    },
                    {title: 'Fats(g)', field: 'fats', type: 'numeric'},
                    {title: 'Carbs(g)', field: 'carb', type: 'numeric'},
                    {title: 'Protein(g)', field: 'protein', type: 'numeric'}
                ]}
                data={formatNewState(mealState)}
                title="Meal Details"
                options={{
                    selection: false,
                    toolbar: false,
                    emptyRowsWhenPaging: false,
                    headerStyle: {backgroundColor: 'black', color: 'white'},
                    grouping: false,
                    showTitle: false
                }}
                editable={{
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = mealState
                                    let index = data.indexOf(oldData)
                                    data[index] = newData
                                    setMeals(data)

                                    delete data['tableData']
                                    dispatch(editMeal(data, meal._id))
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
                                    setMeals(data)

                                    delete data['tableData']
                                    dispatch(editMeal(data, meal._id))
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
