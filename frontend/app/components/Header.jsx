import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import HeaderButton from "./material/HeaderButton.jsx";

class Header extends React.Component {
    constructor(props) {
        super(props);

        if(localStorage.getItem('user'))
            props.setUser(JSON.parse(localStorage.getItem('user')));
    }

    removeUser() {
        localStorage.removeItem('user');
    }

    logOut() {
        let divStyle = {
            'display' : 'flex',
            'flex-direction' : 'row'
        };

        return (
            <div style={divStyle}>
                <HeaderButton href='/login' label='Log Out' handleClick={this.removeUser}/>
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
                <HeaderButton href='/login' label='Login'/>
                <HeaderButton href='/registration' label='Registration'/>
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

                'font-family': 'Bangers, cursive',
                'font-size': '24px',
                'color': '#e1e1e1',

                'user-select': 'none',
                'cursor': 'pointer',
            };

        return (
            <header style={headerStyle}>
                <a style={systemNameStyle} href='/'>
                    CRM System
                </a>
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