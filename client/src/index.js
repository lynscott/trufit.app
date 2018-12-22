import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import rootReducer from './reducers/index.js'
// import promise from 'redux-promise';
import reduxThunk from 'redux-thunk'
import AppRoutes from './component/AppRoutes'
import { composeWithDevTools } from'redux-devtools-extension'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faUserPlus, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
 
library.add(faUserCircle, faUserPlus, faInfoCircle )

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
