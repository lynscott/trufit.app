import React, {useState, useEffect, forwardRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import axios from 'axios'
import MaterialTable from 'material-table'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import {fetchMeals, editMeal} from '../../actions'
import {makeStyles} from '@material-ui/core/styles'

//IMPORTS FOR MATERIAL GRID//
import AddBox from '@material-ui/icons/AddBox'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import Check from '@material-ui/icons/Check'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Clear from '@material-ui/icons/Clear'
import DeleteOutline from '@material-ui/icons/DeleteOutline'
import Edit from '@material-ui/icons/Edit'
import FilterList from '@material-ui/icons/FilterList'
import FirstPage from '@material-ui/icons/FirstPage'
import LastPage from '@material-ui/icons/LastPage'
import Remove from '@material-ui/icons/Remove'
import SaveAlt from '@material-ui/icons/SaveAlt'
import Search from '@material-ui/icons/Search'
import ViewColumn from '@material-ui/icons/ViewColumn'

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => (
        <ChevronRight {...props} ref={ref} />
    )),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => (
        <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => (
        <Remove {...props} ref={ref} />
    )),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular
    }
}))

const NutritionTable = ({meal, id}) => {
    const dispatch = useDispatch()
    const customMeal = {
        name: '',
        serving: '',
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0
    }
    const [mealState, setMeals] = useState(meal)

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
    console.log(mealState, 'Ms')

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
                    // onRowAdd: newData =>
                    //   new Promise((resolve, reject) => {
                    //     setTimeout(() => {
                    //       {
                    //         let data = mealState;
                    //         data.push(newData);
                    //         setMeals(data);

                    //         delete data["tableData"];
                    //         dispatch(editMeal(data, id));
                    //         resolve();
                    //       }
                    //       resolve();
                    //     }, 1000);
                    //   }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            setTimeout(() => {
                                {
                                    let data = mealState
                                    let index = data.indexOf(oldData)
                                    data[index] = newData
                                    setMeals(data)

                                    delete data['tableData']
                                    dispatch(editMeal(data, id))
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
                                    dispatch(editMeal(data, id))
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
