import axios from 'axios'
import ndb from 'nutrient-database'
import history from 'react-router'
// import Alert from 'react-s-alert'

export const TYPE_SELECTED = 'type_selected'
export const PLAN_SELECTED = 'plan_selected'
export const CONTACT = 'contact'
export const TRAINING_FORM = 'training_form'
export const FETCH_USER = 'fetch_user'
export const FETCH_USER_AUTHENTICATING = 'fetch_user_authenticating'
export const INTAKE_FORM = 'intake_form'
export const FETCH_PLANS = 'fetch_plans'
export const FETCH_PLAN = 'fetch_plan'
export const AUTH_USER = 'auth_user'
export const AUTH_ERROR = 'auth_error'
export const USER_CREATED = 'user_created'
export const MOUNT_TOKEN = 'MOUNT_TOKEN'
export const FETCH_EXERCISES = 'FETCH_EXERCISES'
export const CREATE_NEW_PLAN = 'CREATE_NEW_PLAN'
export const CREATE_NEW_PLAN_ERROR = 'CREATE_NEW_PLAN_ERROR'
export const FETCH_PLAN_TEMPLATES = 'FETCH_PLAN_TEMPLATES'
export const FOOD_SEARCH = 'FOOD_SEARCH'
export const FOOD_SELECTED = 'FOOD_SELECTED'
export const FETCH_PROFILE = 'FETCH_PROFILE'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'
export const USER_SIGNUP = 'USER_SIGNUP'
export const RESET_SIGNUP_FAIL = 'RESET_SIGNUP_FAIL'
export const WEEKLY_CHECKIN = 'WEEKLY_CHECKIN'
export const NEW_WORKOUT_SUCCESS = 'NEW_WORKOUT_SUCCESS'
export const NEW_WORKOUT_FAILED = 'NEW_WORKOUT_FAILED'
export const FETCH_WORKOUTS = 'FETCH_WORKOUTS'
export const CREATE_NEW_MEAL = 'CREATE_NEW_MEAL'
export const CREATE_NEW_MEAL_FAILED = 'CREATE_NEW_MEAL_FAILED'
export const FETCH_MEALS = 'FETCH_MEALS'
export const DELETE_MEAL = 'DELETE_MEAL'
export const EDIT_MEAL = 'EDIT_MEAL'

export const SEARCH_LOADING = 'SEARCH_LOADING'
export const SEARCH_FAILED = 'SEARCH_FAILED'

export const CREATE_NUTRITION_PLAN = 'CREATE_NUTRITION_PLAN'
export const CREATE_NUTRITION_PLAN_FAILED = 'CREATE_NUTRITION_PLAN_FAILED'
export const FETCH_NUTRITION_PLANS = 'FETCH_NUTRITION_PLANS'
export const DELETE_PLAN_SUCCESS = 'DELETE_PLAN_SUCCESS'
export const MARK_MEAL_COMPLETE = 'MARK_MEAL_COMPLETE'
export const EDIT_NUTRITION_PLAN = 'EDIT_NUTRITION_PLAN'
export const EDIT_NUTRITION_PLAN_FAILED = 'EDIT_NUTRITION_PLAN_FAILED'

export const SET_SIDEBAR_WIDTH = 'SET_SIDEBAR_WIDTH'
export const INIT_NEW_USER_TRAINING_PLAN = 'INIT_NEW_USER_TRAINING_PLAN'
export const INIT_NEW_USER_TRAINING_PLAN_FAILED =
    'INIT_NEW_USER_TRAINING_PLAN_FAILED'
export const ADD_NEW_BETA = 'ADD_NEW_BETA'

export const SEND_TRACKER_DATA_SUCCESS = 'SEND_TRACKER_DATA_SUCCESS'
export const TOGGLE_WORKOUT_MODE = 'TOGGLE_WORKOUT_MODE'

export const REQUEST_PENDING = 'REQUEST_PENDING'
export const REQUEST_SUCCESS = 'REQUEST_SUCCESS'

export const FOOD_FOUND = 'FOOD_FOUND'

export const FETCH_MEAL_LOG = 'FETCH_MEAL_LOG'

export const parse = 1
export const nutrient = 2

const API_KEY = 'ed9258291414978c7f3db898b805e375'
const APP_ID = '80b7d665'

const baseURL = 'https://api.edamam.com/api/food-database/parser?'
const nutrientURL = `https://api.edamam.com/api/food-database/nutrients?app_id=${APP_ID}&app_key=${API_KEY}`

//TODO: Clean up func, well and this file
export const foodSearchV2 = (search, route) => async dispatch => {
    if (route === parse) {
        dispatch({type: SEARCH_LOADING})

        const foodURL = `nutrition-type=logging&ingr=${search}&app_id=${APP_ID}&app_key=${API_KEY}`

        const res = await axios.get(baseURL + foodURL)
        // console.log(res.data)
        if (res.data) {
            const parsedFood = res.data.parsed[0]

            console.log(parsedFood)
            if (parsedFood) dispatch({type: FOOD_FOUND, payload: parsedFood})
            else dispatch({type: SEARCH_FAILED})
        } else {
            dispatch({type: SEARCH_FAILED})
        }
    } else if (route === nutrient) {
        if (!('measure' in search.food)) return 'Bad Item Request'
        const foodJSON = {
            ingredients: [
                {
                    foodId: search.food.food.foodId,
                    quantity: search.food.quantity ? search.food.quantity : 1,
                    measureURI: search.food.measure.uri
                }
            ]
        }

        // if ('quantity' in search.food) foodJSON.quantity = search.food.quantity

        // foodJSON.ingredients[0].measureURI = search.food.measure.uri

        console.log(search, foodJSON, 'JSON')
        const nutrientData = await axios.post(nutrientURL, foodJSON)

        let food = {...nutrientData.data, name: search.food.label}

        axios.post('/api/add_item', {food, id: search.id})
        dispatch({type: 'FOOD_SEARCH_SUCCESS', food})

        console.log(nutrientData.data, 'DT')
    } else {
        const autocompleteURL = `http://api.edamam.com/auto-complete?q=${search}&limit=10&app_id=${APP_ID}&app_key=${API_KEY}`

        const auto = await axios.get(autocompleteURL)
        console.log(auto.data)

        const formatList = auto.data.map(val => ({value: val, label: val}))

        dispatch({type: FOOD_SEARCH, payload: formatList})
    }
}

export const foodSelectV2 = search => async dispatch => {
    let parseFood = food => {
        let item = food[0].food
        let name = item.desc.name.replace(',', ' ')

        console.log('parseFood', item)

        let foodItem = {}
        foodItem.name = name

        // nutrients[1] energy (Calories)
        // nutrients[3] fats
        // nutrients[2] proteins
        // nutrients[4] carbs
        // foodItem.serving_label = item.nutrients[1].measures[0].label
        foodItem.serving = 3.5
        foodItem.baseCal = item.nutrients[1].value
        foodItem.baseFats = item.nutrients[3].value
        foodItem.baseCarb = item.nutrients[4].value
        foodItem.baseProtein = item.nutrients[2].value
        foodItem.calories = item.nutrients[1].value
        foodItem.fats = item.nutrients[3].value
        foodItem.carb = item.nutrients[4].value
        foodItem.protein = item.nutrients[2].value
        foodItem.active = false
        foodItem.id = item.desc.ndbno

        //Conversion from gram to oz

        return foodItem
    }

    const baseURL = 'https://api.edamam.com/api/food-database/parser?'
    const foodItem = search.replace(' ', '%20')
    const foodURL = `nutrition-type=logging&ingr=${foodItem}&app_id=${APP_ID}&app_key=${API_KEY}`

    // ndb.foodReport(foodID ,API_KEY,(err, response) => {
    // console.log(response)
    // dispatch({type:FOOD_SELECTED, payload:parseFood(response.foods)})
    // })
}

//Remove form prod
// const API_KEY = 'I2TVQAcEbt0u34UC4BnjUdiSxSMJlrTxnTLBgcoh'

export function selectType(type) {
    return {
        type: TYPE_SELECTED,
        payload: type
    }
}

export function selectPlan(plan) {
    return {
        type: PLAN_SELECTED,
        payload: plan
    }
}

export const signOut = () => async dispatch => {
    await axios.get('/api/logout')
    // history.push('/')

    dispatch({type: 'SIGNOUT_SUCCESS'})
}

export const submitBeta = beta => async dispatch => {
    const res = await axios.post('/api/add_beta_user', beta)

    dispatch({type: ADD_NEW_BETA, payload: res.data})
}

export const contactForm = values => async dispatch => {
    dispatch({type: REQUEST_PENDING})

    try {
        await axios.post('/api/contactform', values)
        dispatch({type: REQUEST_SUCCESS})
    } catch (error) {
        alert(error)
    }
}

export const trainingForm = (values, callback) => async dispatch => {
    const res = await axios.post('/api/trainingform', values)

    dispatch({type: TRAINING_FORM, payload: res.data})
}

export const freePlanForm = (values, type, plan) => async dispatch => {
    const res = await axios.post('/api/freeplans', [values, type, plan])

    dispatch({type: TRAINING_FORM, payload: res.data})
}

export const intakeStrengthForm = (values, history, id) => async dispatch => {
    const res = await axios.post('/api/intake/strength', values)

    history.push(`/dashboard/${id}`)
    dispatch({type: INTAKE_FORM, payload: res.data})
}

export const intakeShredForm = (values, history, id) => async dispatch => {
    const res = await axios.post('/api/intake/shred', values)

    history.push(`/dashboard/${id}`)
    dispatch({type: INTAKE_FORM, payload: res.data})
}

export const intakeToneForm = (values, history, id) => async dispatch => {
    const res = await axios.post('/api/intake/tone', values)

    history.push(`/dashboard/${id}`)
    dispatch({type: INTAKE_FORM, payload: res.data})
}

//FETCH USER OAUTH
export const fetchUser = () => async dispatch => {
    dispatch({type: FETCH_USER_AUTHENTICATING})
    const res = await axios.get('/api/logged_user/')
    // console.log(res.data)

    dispatch({type: FETCH_USER, payload: res.data.user})
}

//FETCH USER LOCAL
export const fetchUserLocal = token => async dispatch => {
    // console.log(token)
    const res = await axios.post('/api/logged_user_local', {token: token})

    dispatch({type: FETCH_USER, payload: res.data.user})
}

export const handleStrengthToken = (token, history, id) => async dispatch => {
    const res = await axios.post('/api/stripe', token)

    history.push(`/startplan/strength/${id}`)
    dispatch({type: FETCH_USER, payload: res.data})
}

export const handleShredToken = (token, history, id) => async dispatch => {
    const res = await axios.post('/api/stripe', token)

    history.push(`/startplan/shred/${id}`)
    dispatch({type: FETCH_USER, payload: res.data})
}

export const handleToneToken = (token, history, id) => async dispatch => {
    const res = await axios.post('/api/stripe', token)

    history.push(`/startplan/tone/${id}`)
    dispatch({type: FETCH_USER, payload: res.data})
}

export const fetchPlans = () => async dispatch => {
    const res = await axios.get('/api/plans')

    dispatch({type: FETCH_PLANS, payload: res.data})
}

export const fetchPlan = id => async dispatch => {
    const res = await axios.get(`/api/plans/${id}`)

    dispatch({type: FETCH_PLAN, payload: res.data})
}

export const signInUser = (history, {email, password}) => async dispatch => {
    try {
        const res = await axios.post('/api/signin/', {email, password})
        // localStorage.setItem('token', res.data.token)
        dispatch({
            type: AUTH_USER,
            payload: res.data.token,
            user: res.data.user
        })
        history.push('/dashboard/overview')
    } catch (error) {
        // console.log(error.response)
        dispatch({type: AUTH_ERROR, payload: 'error'})
    }
}

export const signUpUser = values => async dispatch => {
    try {
        const res = await axios.post('/api/signup/', values)
        // localStorage.setItem('token', res.data.token)
        dispatch({type: USER_SIGNUP})
    } catch (error) {
        dispatch({type: AUTH_ERROR, payload: error.response.data.message})
    }
}

export const mountToken = token => async dispatch => {
    dispatch({type: MOUNT_TOKEN, payload: token})
}

export const signUserOut = () => dispatch => {
    localStorage.removeItem('token')

    dispatch({type: AUTH_USER, payload: null, user: null})
}

export const fetchExercises = () => async dispatch => {
    const res = await axios.get('/api/exercises')

    dispatch({type: FETCH_EXERCISES, payload: res.data})
}

export const fetchNutritionPlans = () => async dispatch => {
    const res = await axios.get('/api/nutrition_plans')

    dispatch({type: FETCH_NUTRITION_PLANS, payload: res.data})
}

export const createNutritionPlan = values => async dispatch => {
    try {
        await axios.post('/api/create_nutrition_plan', values)
        dispatch({type: CREATE_NUTRITION_PLAN})
    } catch (error) {
        dispatch({
            type: CREATE_NUTRITION_PLAN_FAILED,
            payload: 'Error Occured' + error
        })
    }
}

export const editNutritionPlan = values => async dispatch => {
    try {
        await axios.post('/api/edit_nutrition_plan', values)
        dispatch({type: EDIT_NUTRITION_PLAN})
    } catch (error) {
        dispatch({
            type: EDIT_NUTRITION_PLAN_FAILED,
            payload: 'Error Occured' + error
        })
    }
}

export const deleteNutritionPlan = values => async dispatch => {
    try {
        await axios.post('/api/delete_nutrition_plan', values)
        dispatch({type: DELETE_PLAN_SUCCESS})
    } catch (error) {
        //TODO: Make user feedback for fail
        dispatch({type: 'DELETE_PLAN_FAILED', payload: 'Error Occured' + error})
    }
}

export const createNewPlan = values => async dispatch => {
    try {
        await axios.post('/api/new_plan_template', values)
        dispatch({type: CREATE_NEW_PLAN})
    } catch (error) {
        dispatch({
            type: CREATE_NEW_PLAN_ERROR,
            payload: 'Error Occured' + error
        })
    }
}

export const initTrainingPlan = values => async dispatch => {
    try {
        await axios.post('/api/new_user_plan', values)
        dispatch({type: INIT_NEW_USER_TRAINING_PLAN})
        alert('Your training plan was saved!')
    } catch (error) {
        dispatch({
            type: INIT_NEW_USER_TRAINING_PLAN_FAILED,
            payload: 'Error Occured' + error
        })
        alert('An error occurred when trying to save the plan.')
    }
}

export const fetchActiveTrainingPlan = () => async dispatch => {
    const res = await axios.get('/api/active_training_plan')

    dispatch({type: PLAN_SELECTED, payload: res.data ? res.data : null})
}

export const createNewMeal = values => async dispatch => {
    try {
        await axios.post('/api/new_meal', values)
        dispatch({type: CREATE_NEW_MEAL})
    } catch (error) {
        dispatch({
            type: CREATE_NEW_MEAL_FAILED,
            payload: 'Error Occured' + error
        })
    }
}

//MEAL SECTION///
export const fetchMeals = () => async dispatch => {
    const res = await axios.get('/api/meals')

    dispatch({type: FETCH_MEALS, payload: res.data})
}

export const deleteMeal = i => async dispatch => {
    const res = await axios.post('/api/delete_meal', {id: i})

    dispatch({type: DELETE_MEAL, payload: res.data})
    dispatch(fetchMeals())
}

export const editMeal = (meal, id) => async dispatch => {
    const res = await axios.post('/api/edit_meal', {meal, id})

    dispatch({type: EDIT_MEAL, payload: res.data})
}

export const logMealComplete = updates => async dispatch => {
    const res = await axios.post('/api/log_meal', updates)

    dispatch({type: MARK_MEAL_COMPLETE, payload: res.data})
}

export const fetchMealLogs = () => async dispatch => {
    const res = await axios.post('/api/get_food_log')

    dispatch({type: FETCH_MEAL_LOG, payload: res.data})
}
///

export const createNewWorkout = values => async dispatch => {
    try {
        await axios.post('/api/new_workout', values)
        dispatch({type: NEW_WORKOUT_SUCCESS})
    } catch (error) {
        dispatch({type: NEW_WORKOUT_FAILED, payload: 'Error Occured' + error})
    }
}

export const saveNutritionPlan = values => async dispatch => {
    try {
        await axios.post('/api/nutrition_plan', values)
        dispatch({type: 'SAVE_NUTRITION_PLAN'})
    } catch (error) {
        dispatch({
            type: 'SAVE_NUTRITION_PLAN',
            payload: 'Error Occured' + error
        })
    }
}

export const fetchPlanTemps = () => async dispatch => {
    const res = await axios.get('/api/plan_templates')
    // console.log(res.data, 'res from temp call')

    dispatch({type: FETCH_PLAN_TEMPLATES, payload: res.data})
}

// export const foodSearch = term => async dispatch => {
//   // console.log(term)
//   let formatRes = res => {
//     if (res.list) {
//       let foods = []
//       for (let i = 0 i < res.list.item.length i++) {
//         // let name = res.list.item[i].name.split(',')[0]+' '+res.list.item[i].name.split(',')[1] + ' ' + res.list.item[i].name.split(',')[2]
//         foods.push({
//           label: res.list.item[i].name.replace(",", " "),
//           value: res.list.item[i].ndbno
//         })
//       }
//       // console.log(foods)
//       return foods
//     } else {
//       return []
//     }
//   }

//   ndb.search(term, "Standard Reference", 100, "", API_KEY, (err, response) => {
//     // console.log(response)
//     dispatch({ type: FOOD_SEARCH, payload: formatRes(response) })
//   })
// }

export const foodSelect = foodID => async dispatch => {
    //TODO: Move this to a constants folder
    //ASSUMPTION: This is making the assumption that the food is coming from a standardized USDA Food Database.
    //            Any other query to a seperate database may require appropriate adjustments to this parser.
    let parseFood = food => {
        let item = food[0].food
        let name = item.desc.name.replace(',', ' ')

        console.log('parseFood', item)

        let foodItem = {}
        foodItem.name = name

        // nutrients[1] energy (Calories)
        // nutrients[3] fats
        // nutrients[2] proteins
        // nutrients[4] carbs
        // foodItem.serving_label = item.nutrients[1].measures[0].label
        foodItem.serving = 3.5
        foodItem.baseCal = item.nutrients[1].value
        foodItem.baseFats = item.nutrients[3].value
        foodItem.baseCarb = item.nutrients[4].value
        foodItem.baseProtein = item.nutrients[2].value
        foodItem.calories = item.nutrients[1].value
        foodItem.fats = item.nutrients[3].value
        foodItem.carb = item.nutrients[4].value
        foodItem.protein = item.nutrients[2].value
        foodItem.active = false
        foodItem.id = item.desc.ndbno

        //Conversion from gram to oz

        return foodItem
    }

    ndb.foodReport(foodID, API_KEY, (err, response) => {
        // console.log(response)
        dispatch({type: FOOD_SELECTED, payload: parseFood(response.foods)})
    })
}

export const fetchProfile = () => async dispatch => {
    let res = await axios.get('/api/user_profile')

    dispatch({type: FETCH_PROFILE, payload: res.data})
}

export const updateProfile = values => async dispatch => {
    let res = await axios.post('/api/update_profile', values)

    dispatch({type: UPDATE_PROFILE, payload: res.data})
}

export const updateFoodItem = values => async dispatch => {
    let res = await axios.post('/api/update_food_item', values)

    dispatch({type: UPDATE_PROFILE, payload: res.data})
}

export const saveMealTime = values => async dispatch => {
    let res = await axios.post('/api/update_food_item', values)

    dispatch({type: UPDATE_PROFILE, payload: res.data})
}

export const resetSignUpFail = () => dispatch => {
    dispatch({type: RESET_SIGNUP_FAIL})
}

export const fetchWorkouts = () => async dispatch => {
    let res = await axios.get('/api/fetch_workouts')

    dispatch({type: FETCH_WORKOUTS, payload: res.data})
}

export const setSideBarWidth = width => async dispatch => {
    // let width = await document.getElementById('sidebar-dash')

    if (width !== undefined) dispatch({type: SET_SIDEBAR_WIDTH, payload: width})
}

export const sendWorkoutTrackerData = values => async dispatch => {
    try {
        await axios.post('/api/workout_tracker', values)
        dispatch({type: SEND_TRACKER_DATA_SUCCESS})
    } catch (error) {
        console.log(error)
        dispatch({
            type: 'SEND_TRACKER_DATA_FAILED',
            payload: 'Error Occured' + error
        })
    }
}

export const workoutModeToggle = () => {
    return {
        type: TOGGLE_WORKOUT_MODE
    }
}
