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

import { createBrowserHistory } from 'history'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './reducers'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle, faUserPlus, faInfoCircle, faTools } from '@fortawesome/free-solid-svg-icons'

import { ConnectedRouter } from 'connected-react-router'
import * as registerServiceWorker  from './registerServiceWorker'
 
export const history = createBrowserHistory()

history.listen(_ => {
  window.scrollTo(0, 0)  
})
 
library.add(faUserCircle, faUserPlus, faInfoCircle, faTools )

const composeEnhancers = composeWithDevTools({
  // options like actionSanitizer, stateSanitizer
})

const store = createStore(rootReducer(history), {}, composeEnhancers(applyMiddleware(reduxThunk),applyMiddleware(routerMiddleware(history))))

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <BrowserRouter>
        <AppRoutes/>
      </BrowserRouter>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
registerServiceWorker.register()