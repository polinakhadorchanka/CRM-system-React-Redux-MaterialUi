import * as ReactRouterDOM from "react-router-dom";

let ReactDOM = require('react-dom');
let React = require('react');
let Tabs = require('./components/Tabs.jsx');
let Login = require('./components/Login.jsx');
let redux = require("redux");
let Provider = require("react-redux").Provider;
let reducer = require("./reducer.jsx");

const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Switch = ReactRouterDOM.Switch;

let startVacancies = {
    all: [],
    unviewed: [],
    favorites: []
};

let store = redux.createStore(reducer);
getStartVacancies();

async function getStartVacancies() {
    await showNextVacancies('all');
    await showNextVacancies('unviewed');
    await showNextVacancies('board');

    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <div>
                    <Switch>
                        <Route exact path="/" component={Tabs} startVacancies={startVacancies}/>
                        <Route path="/vacancies" component={Tabs} startVacancies={startVacancies}/>
                    </Switch>
                </div>
            </Router>
        </Provider>,
        document.getElementById("container")
    );
}

async function showNextVacancies(filter) {
    await fetch(`/api/vacancies?id=undefined&` + `count=10&filter=${filter}`)
        .then(response => response.json()).then(function (data) {
            switch(filter) {
                case 'all':
                    startVacancies.all = data; break;
                case 'unviewed':
                    startVacancies.unviewed = data; break;
                case 'favorites':
                    startVacancies.favorites = data; break;
                case 'board':
                    startVacancies.board = data; break;
            }
        })
        .catch(function (err) {
            console.log('EXP: ', err);
        });
}
