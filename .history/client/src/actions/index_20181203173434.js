import axios from 'axios';
export const TYPE_SELECTED = 'type_selected';
export const PLAN_SELECTED = 'plan_selected';
export const CONTACT = 'contact';
export const TRAINING_FORM = 'training_form';
export const FETCH_USER = 'fetch_user';
export const INTAKE_FORM = 'intake_form';
export const FETCH_PLANS = 'fetch_plans';
export const FETCH_PLAN = 'fetch_plan';
export const AUTH_USER = 'auth_user'

export function selectType(type) {
  return {
    type: TYPE_SELECTED,
    payload: type
  };
}

export function selectPlan(plan) {
  return {
    type: PLAN_SELECTED,
    payload: plan
  };
}

export const contactForm = values => async dispatch => {
  const res = await axios.post('/api/contactform', values);

  dispatch({ type: CONTACT, payload: res.data });
};

export const trainingForm = (values, callback) => async dispatch => {
  const res = await axios.post('/api/trainingform', values);

  dispatch({ type: TRAINING_FORM, payload: res.data });
};

export const freePlanForm = (values, type, plan) => async dispatch => {
  const res = await axios.post('/api/freeplans', [values, type, plan]);

  dispatch({ type: TRAINING_FORM, payload: res.data });
};

export const intakeStrengthForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/strength', values);

  history.push(`/dashboard/${id}`);
  dispatch({ type: INTAKE_FORM, payload: res.data });
};

export const intakeShredForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/shred', values);

  history.push(`/dashboard/${id}`);
  dispatch({ type: INTAKE_FORM, payload: res.data });
};

export const intakeToneForm = (values, history, id) => async dispatch => {
  const res = await axios.post('/api/intake/tone', values);

  history.push(`/dashboard/${id}`);
  dispatch({ type: INTAKE_FORM, payload: res.data });
};

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/logged_user');

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleStrengthToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  history.push(`/startplan/strength/${id}`);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleShredToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  history.push(`/startplan/shred/${id}`);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToneToken = (token, history, id) => async dispatch => {
  const res = await axios.post('/api/stripe', token);

  history.push(`/startplan/tone/${id}`);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchPlans = () => async dispatch => {
  const res = await axios.get('/api/plans');

  dispatch({ type: FETCH_PLANS, payload: res.data });
};

export const fetchPlan = id => async dispatch => {
  const res = await axios.get(`/api/plans/${id}`);

  dispatch({ type: FETCH_PLAN, payload: res.data });
};

export const signInUser = ({email, password}) => async dispatch => {
  const res = await axios.get(`/api/signin/${email, username}`);

  dispatch({type: AUTH_USER})
  localStorage.setItem('token', res.data.token)
}
