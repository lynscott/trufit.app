import axios from 'axios'
import ndb from 'nutrient-database'
// import Alert from 'react-s-alert'

export const TYPE_SELECTED = 'type_selected'
export const PLAN_SELECTED = 'plan_selected'
export const CONTACT = 'contact'
export const TRAINING_FORM = 'training_form'
export const FETCH_USER = 'fetch_user'
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


const API_KEY = 'I2TVQAcEbt0u34UC4BnjUdiSxSMJlrTxnTLBgcoh'

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

export const contactForm = values => async dispatch => {
  const res = await axios.post('/api/contactform', values)

  dispatch({ type: CONTACT, payload: res.data })
}

export const trainingForm = (values, callback) => async dispatch => {
  const res = await axios.post('/api/trainingform', values)

  dispatch({ type: TRAINING_FORM, payload: res.data })
}

export const freePlanForm = (values, type, plan) => async dispatch => {
  const res = await axios.post('/api/freeplans', [values, type, plan])

  dispatch({ type: TRAINING_FORM, payload: res.data })
}

export const intakeStrengthForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/strength', values)

  history.push(`/dashboard/${id}`)
  dispatch({ type: INTAKE_FORM, payload: res.data })
}

export const intakeShredForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/shred', values)

  history.push(`/dashboard/${id}`)
  dispatch({ type: INTAKE_FORM, payload: res.data })
}

export const intakeToneForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/tone', values)

  history.push(`/dashboard/${id}`)
  dispatch({ type: INTAKE_FORM, payload: res.data })
}

//FETCH USER OAUTH
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/logged_user/')
  // console.log(res.data)

  dispatch({ type: FETCH_USER, payload: res.data.user })
}

//FETCH USER LOCAL
export const fetchUserLocal = (token) => async dispatch => {
  // console.log(token)
  const res = await axios.post('/api/logged_user_local', {token:token})

  dispatch({ type: FETCH_USER, payload: res.data.user })
}

export const handleStrengthToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token)

  history.push(`/startplan/strength/${id}`)
  dispatch({ type: FETCH_USER, payload: res.data })
}

export const handleShredToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token)

  history.push(`/startplan/shred/${id}`)
  dispatch({ type: FETCH_USER, payload: res.data })
}

export const handleToneToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token)

  history.push(`/startplan/tone/${id}`)
  dispatch({ type: FETCH_USER, payload: res.data })
}

export const fetchPlans = () => async dispatch => {
  const res = await axios.get('/api/plans')

  dispatch({ type: FETCH_PLANS, payload: res.data })
}

export const fetchPlan = id => async dispatch => {
  const res = await axios.get(`/api/plans/${id}`)

  dispatch({ type: FETCH_PLAN, payload: res.data})
}

export const signInUser = (history, {email, password}) => async dispatch => {
  try {
    const res = await axios.post('/api/signin/', {email, password})
    // localStorage.setItem('token', res.data.token)
    dispatch({type: AUTH_USER, payload:res.data.token, user:res.data.user})
    history.push('/dashboard/overview')
  } catch (error) {
    // console.log(error.response)
    dispatch({type: AUTH_ERROR, payload:'error'})
  }
}

export const signUpUser = (values) => async dispatch => {

  try {
    const res = await axios.post('/api/signup/', values)
    // localStorage.setItem('token', res.data.token)
    dispatch({type: USER_SIGNUP})
  } catch (error) {
    dispatch({type: AUTH_ERROR, payload: error.response.data.message})
  }
}

export const mountToken = (token) => async dispatch => {

  dispatch({type:MOUNT_TOKEN, payload:token})
}

export const signUserOut = () => dispatch => {
  localStorage.removeItem('token')

  dispatch({type:AUTH_USER, payload:null, user:null})
}

export const fetchExercises = () => async dispatch => {
  const res = await axios.get('/api/exercises')

  dispatch({ type: FETCH_EXERCISES, payload: res.data })
}

export const createNewPlan = (values) => async dispatch => {

  try {
    await axios.post('/api/new_plan_template', values)
    dispatch({type: CREATE_NEW_PLAN})
  } catch (error) {
    dispatch({type: CREATE_NEW_PLAN_ERROR, payload:'Error Occured'+ error})
  }

}


export const createNewWorkout = (values) => async dispatch => {

  try {
    await axios.post('/api/new_workout', values)
    dispatch({type: NEW_WORKOUT_SUCCESS})
  } catch (error) {
    dispatch({type: NEW_WORKOUT_FAILED, payload:'Error Occured'+ error})
  }

}

export const fetchPlanTemps = () => async dispatch => {
  const res = await axios.get('/api/plan_templates')
  // console.log(res.data, 'res from temp call')

  dispatch({ type: FETCH_PLAN_TEMPLATES, payload: res.data })
}


export const foodSearch = (term) => async dispatch => {

  // console.log(term)
  let formatRes = (res) => {
    if (res.list) {
      let foods = []
      for (let i = 0; i < res.list.item.length; i++) {
        // let name = res.list.item[i].name.split(',')[0]+' '+res.list.item[i].name.split(',')[1] + ' ' + res.list.item[i].name.split(',')[2]
        foods.push({'label':res.list.item[i].name.replace(',',' '), 'value':res.list.item[i].ndbno})      
      }
      // console.log(foods)
      return foods
    } else {
      return []
    }
    
  }

  ndb.search(term,'Standard Reference',100,'', API_KEY,(err, response) => {
    // console.log(response)
    dispatch({type: FOOD_SEARCH, payload:formatRes(response)})
  })
  
}

export const foodSelect = (foodID) => async dispatch => {
  //TODO: Move this to a constants folder
  //ASSUMPTION: This is making the assumption that the food is coming from a standardized USDA Food Database.
  //            Any other query to a seperate database may require appropriate adjustments to this parser.
  let parseFood = (food) => {
    let item = food[0].food
    let name = item.desc.name.replace(',',' ')

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

    //Conversion form gram to oz
 
    return foodItem
  }

  ndb.foodReport(foodID ,API_KEY,(err, response) => {
    // console.log(response)
    dispatch({type:FOOD_SELECTED, payload:parseFood(response.foods)})
  })
}

export const fetchProfile = () => async dispatch => {
  let res = await axios.get('/api/user_profile')

  dispatch({ type: FETCH_PROFILE, payload:res.data })
}

export const updateProfile = (values) => async dispatch => {
  let res = await axios.post('/api/update_profile', values)

  dispatch({ type: UPDATE_PROFILE, payload:res.data  })
}

export const updateFoodItem = (values) => async dispatch => {
  let res = await axios.post('/api/update_food_item', values)

  dispatch({ type: UPDATE_PROFILE, payload:res.data  })
}

export const saveMealTime = (values) => async dispatch => {
  let res = await axios.post('/api/update_food_item', values)

  dispatch({ type: UPDATE_PROFILE, payload:res.data  })
}


export const resetSignUpFail = () => dispatch => {

  dispatch({ type: RESET_SIGNUP_FAIL  })
}

export const fetchWorkouts = () => async dispatch => {
  let res = await axios.get('/api/fetch_workouts')

  dispatch({ type: FETCH_WORKOUTS, payload:res.data })
}


export const sendSlackFeedback = (values) => async dispatch => {
  console.log(values)
  let res = await axios.post('https://hooks.slack.com/services/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', {data:values})
  console.log(res)
  dispatch({ type: 'SENT', payload:res.data })
}