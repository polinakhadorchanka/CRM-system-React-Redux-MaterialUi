let ReactDOM = require('react-dom');
let React = require('react');
let Tabs = require('./components/Tabs.jsx');
let redux = require("redux");
let Provider = require("react-redux").Provider;
let reducer = require("./reducer.jsx");

import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

let startVacancies = {
    all: [],
    unviewed: [],
    favorites: []
};

let store = redux.createStore(reducer, applyMiddleware(thunk));
getStartVacancies();

async function getStartVacancies() {
    await showNextVacancies('all');
    await showNextVacancies('unviewed');
    await showNextVacancies('board');

    ReactDOM.render(
        <Provider store={store}>
            <Tabs startVacancies={startVacancies}/>
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
