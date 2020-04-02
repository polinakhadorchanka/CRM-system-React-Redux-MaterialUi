import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import HeaderButton from "./material/HeaderButton.jsx";
import {Link} from "react-router-dom";

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.removeUser = this.removeUser.bind(this);

        if(localStorage.getItem('user'))
            props.setUser(JSON.parse(localStorage.getItem('user')));
    }

    removeUser() {
        localStorage.removeItem('user');
        this.props.clearStore();
    }

    logOut() {
        let divStyle = {
                'display' : 'flex',
                'flex-direction' : 'row'
            },
            spanStyle = {
                'color': '#e1e1e1',
                'margin': '2px 10px 0 0'
            };

        return (
            <div style={divStyle}>
                <span style={spanStyle}>{JSON.parse(localStorage.getItem('user')).Login}</span>
                <Link to='/login' onClick={this.removeUser}>
                    <HeaderButton label='Log Out'/>
                </Link>
            </div>
        );
    }

    logIn() {
        let divStyle = {
            'display' : 'flex',
            'flex-direction' : 'row'
        };

        return (
            <div style={divStyle}>
                <Link to='/login'><HeaderButton label='Login'/></Link>
                <Link to='/registration'><HeaderButton label='Registration'/></Link>
            </div>
        );
    }

    render() {
        let headerStyle = {
                'padding': '10px 10px 3px',
                'width': '100%',
                'min-width': '1000px',
                'display': 'flex',
                'flex-direction': 'row',
                'justify-content': 'space-between',
                'align-items': 'center'
            },
            systemNameStyle = {
                'padding-top': '3px',
                'padding-left': '10px',

                'font-family': 'Bangers, cursive',
                'font-size': '24px',
                'color': '#e1e1e1',

                'user-select': 'none',
                'cursor': 'pointer'
            };

        return (
            <header style={headerStyle}>
                <Link
                    to={localStorage.getItem('user') === null ? '/' : `/${JSON.parse(localStorage.getItem('user')).Login}`}>
                    <a style={systemNameStyle} href='/'>
                    CRM System
                </a></Link>
                {this.props.store.user ? this.logOut() : this.logIn()}
            </header>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (Header);

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;