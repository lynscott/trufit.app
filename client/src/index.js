import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './component/App'
import About from './component/About'
import Dashboard from './component/Dashboard'
import OnlineTraining from './component/OnlineTraining'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import rootReducer from './reducers/index.js'
// import promise from 'redux-promise';
import reduxThunk from 'redux-thunk'
import StartStrengthPlan from './Strength/StartStrengthPlan'
import StartShredPlan from './Shred/StartShredPlan'
import StartTonePlan from './Tone/StartTonePlan'
import Nav from './component/Nav'
import ShowPlan from './component/ShowPlan'
import AppRoutes from './component/AppRoutes'
import { composeWithDevTools } from'redux-devtools-extension/developmentOnly'

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
})

const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(reduxThunk)))

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)
