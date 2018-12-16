import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './component/App';
import About from './component/About';
import Dashboard from './component/Dashboard';
import OnlineTraining from './component/OnlineTraining';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import rootReducer from './reducers/index.js';
// import promise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import StartStrengthPlan from './Strength/StartStrengthPlan';
import StartShredPlan from './Shred/StartShredPlan';
import StartTonePlan from './Tone/StartTonePlan';
import Nav from './component/Nav';
import ShowPlan from './component/ShowPlan';

const store = createStore(rootReducer, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Nav className="navbar" />
        <Switch>
          <Route exact path="/about" component={About} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/training" component={OnlineTraining} />
          <Route
            exact
            path="/dashboard/:userid/plan/:id"
            component={ShowPlan}
          />
          <Route
            exact
            path="/startplan/strength/:userid"
            component={StartStrengthPlan}
          />
          <Route
            exact
            path="/startplan/shred/:userid"
            component={StartShredPlan}
          />
          <Route
            exact
            path="/startplan/tone/:userid"
            component={StartTonePlan}
          />
          <Route exact path="/" component={App} />
        </Switch>
      </div>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
