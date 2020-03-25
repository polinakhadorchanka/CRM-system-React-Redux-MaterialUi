//import Button from "@material-ui/core/Button";
import React from 'react';
import ReactDOM  from 'react-dom';
import { createStore } from 'redux'
import { applyMiddleware } from 'redux';
import { Provider } from "react-redux";
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Tabs from './components/Tabs.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';
import StartComponent from './components/StartComponent.jsx';
import Header from './components/Header.jsx';
import reducer from './reducer.jsx';

let store = createStore(reducer, applyMiddleware(thunk));
getStartVacancies();

async function getStartVacancies() {
    if ((document.location.pathname === '/login' || document.location.pathname === '/registration'
        || document.location.pathname === '/')
        && localStorage.getItem('user') !== null) {
            window.location.href = `/${JSON.parse(localStorage.getItem('user')).Login}`;
    } else {
        ReactDOM.render(
            <Provider store={store}>
                <Router>
                    <div>
                    </div>
                    <Header/>
                    <div>
                        <Switch>
                            <Route exact path="/" component={StartComponent}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/registration" component={Registration}/>
                            <Route exact path="/:userLogin" component={Tabs}/>
                        </Switch>
                    </div>
                </Router>
            </Provider>,
            document.getElementById("container")
        );
    }
}
