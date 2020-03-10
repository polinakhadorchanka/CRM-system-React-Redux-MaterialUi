let ReactDOM = require('react-dom');
let React = require('react');
let Tabs = require('./components/Tabs.jsx');
let Login = require('./components/Login.jsx');
let Registration = require('./components/Registration.jsx');
let redux = require("redux");
let Provider = require("react-redux").Provider;
let reducer = require("./reducer.jsx");

import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

let store = redux.createStore(reducer, applyMiddleware(thunk));
getStartVacancies();

async function getStartVacancies() {
    //localStorage.removeItem('user');
    if (document.location.pathname === '/') {
        if (localStorage.getItem('user')) {
            window.location.href = `/${JSON.parse(localStorage.getItem('user')).login}`;
        } else window.location.href = '/login';
    }

    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/login" component={Login}/>
                        <Route exact path="/registration" component={Registration}/>
                        <Route path="/:userLogin" component={Tabs} />
                        <Route exact path="/"/>
                    </Switch>
                </div>
            </Router>
        </Provider>,
        document.getElementById("container")
    );
}
