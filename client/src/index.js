import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import rootReducer from './reducers/index.js'
// import promise from 'redux-promise';
import reduxThunk from 'redux-thunk'
import AppRoutes from './component/AppRoutes'
import { composeWithDevTools } from'redux-devtools-extension'

import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faUserPlus, faInfoCircle, faTools, faMinusCircle, faTrashAlt, faPlus, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

import { ConnectedRouter } from 'connected-react-router'
import * as registerServiceWorker  from './registerServiceWorker'

// HACK: console.log suppression on production build.
// WARNING: We need to eject the app in order to do this the RIGHT way!!!! This is not secure.
if (process.env.NODE_ENV !== 'development') {
  console.log = () => {}
}

 
export const history = createBrowserHistory()

history.listen(_ => {
  window.scrollTo(0, 0)  
})
 
library.add(faUserCircle, faUserPlus, faInfoCircle, faTools, faMinusCircle, faTrashAlt, faPlus, faStar, faCheckCircle )

const composeEnhancers = process.env.NODE_ENV !== 'development' ? compose : composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
})

const store = createStore(rootReducer(history), {}, composeEnhancers(applyMiddleware(reduxThunk),applyMiddleware(routerMiddleware(history))))

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <AppRoutes/>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker.register()