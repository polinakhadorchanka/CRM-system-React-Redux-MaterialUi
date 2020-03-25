let ReactDOM = require('react-dom');
let React = require('react');
let Tabs = require('./components/Tabs.jsx');
let Login = require('./components/Login.jsx');
let Registration = require('./components/Registration.jsx');
let StartComponent = require('./components/StartComponent.jsx');
let Header = require('./components/Header.jsx');
let redux = require("redux");
let Provider = require("react-redux").Provider;
let reducer = require("./reducer.jsx");

import { styled } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const MyButton = styled(Button)({
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
});

import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

let store = redux.createStore(reducer, applyMiddleware(thunk));
getStartVacancies();

async function getStartVacancies() {
    if ((document.location.pathname === '/login' || document.location.pathname === '/registration'
        || document.location.pathname === '/')
        && localStorage.getItem('user') !== null) {
            window.location.href = `/${JSON.parse(localStorage.getItem('user')).Login}`;
    } else {
        ReactDOM.render(
            <div>
                <Button variant="outlined">Default</Button>
                <Button variant="outlined" color="primary">
                    Primary
                </Button>
                <Button variant="outlined" color="secondary">
                    Secondary
                </Button>
                <Button variant="outlined" disabled>
                    Disabled
                </Button>
                <Button variant="outlined" color="primary" href="#outlined-buttons">
                    Link
                </Button>
            </div>,
            document.getElementById("container")
        );

        // ReactDOM.render(
        //     <Provider store={store}>
        //         <Router>
        //             <Header/>
        //             <div>
        //                 <Switch>
        //                     <Route exact path="/" component={StartComponent}/>
        //                     <Route exact path="/login" component={Login}/>
        //                     <Route exact path="/registration" component={Registration}/>
        //                     <Route exact path="/:userLogin" component={Tabs}/>
        //                 </Switch>
        //             </div>
        //         </Router>
        //     </Provider>,
        //     document.getElementById("container")
        // );
    }
}
