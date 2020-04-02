import React from 'react';
import ReactDOM  from 'react-dom';
import { createStore } from 'redux'
import { applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import { Router } from 'react-router';
import { Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Tabs from './components/Tabs.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';
import StartComponent from './components/StartComponent.jsx';
import Header from './components/Header.jsx';
import reducer from './reducer.jsx';

let store = createStore(reducer, applyMiddleware(thunk));
let history = createBrowserHistory();
getStartVacancies();

async function getStartVacancies() {
        ReactDOM.render(
            <Provider store={store}>
                <Router history={history}>
                    <div id='background'/>
                        <Header/>
                        <div>
                            <Switch>
                                <Route exact path="/login" component={Login}/>
                                <Route exact path="/registration" component={Registration}/>
                                <Route exact path="/:userLogin" component={Tabs}/>
                                <Route exact path="/" component={StartComponent}/>
                            </Switch>
                        </div>
                </Router>
            </Provider>,
            document.getElementById("container")
        );
}
