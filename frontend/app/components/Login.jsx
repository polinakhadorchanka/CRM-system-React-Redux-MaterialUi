import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import LoginTextField from "./material/LoginTextField.jsx";
import LoginButton from "./material/LoginButton.jsx";
import { Link } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import {withRouter} from "react-router-dom"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoginValid: true,
            isPasswordValid: true,
            login: '',
            password: '',
            errors: []
        };

        if(localStorage.getItem('user') !== null)
            props.history.push(`/${JSON.parse(localStorage.getItem('user')).Login}`);

        document.title = ' CRM-system - Login';

        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onLoginChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z][a-zA-Z0-9-_\.]{4,20}$/;

        if(regexp.test(val))
            this.setState({isLoginValid: true, login : val, errors: []});
        else this.setState({isLoginValid: false, login : val, errors: []});
    }

    onPasswordChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z0-9-_\.]{6,25}$/;

        if(regexp.test(val))
            this.setState({isPasswordValid: true, password : val, errors: []});
        else this.setState({isPasswordValid: false, password : val, errors: []});
    }

    handleSubmit(e) {
        e.preventDefault();
        let login = this.state.login,
            password = this.state.password;

        if (login === '' || password === '') {
            this.setState({
                isLoginValid: login !== '',
                isPasswordValid: password !== ''
            });
            $('.info-block').addClass('open');
        } else if (!this.state.isLoginValid || !this.state.isPasswordValid) {
            $('.info-block').addClass('open');
        } else {
            let context = this,
                obj = {
                    login: e.target.login.value,
                    password: e.target.password.value
                };
            fetch(`/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(obj)
                })
                .then(function (response) {
                    if (response.status !== 200) {
                        alert('Sorry, server connection error.');
                        return;
                    }
                    return response.json();
                }).then(function (data) {
                if (data[0] && data[0].errorMessage !== null) {
                    context.setState({errors: data});
                    $('.info-block').addClass('open');
                }
                else {
                    context.props.setUser(data);
                    context.props.history.push(`/${data.Login}`);
                }
            })
                .catch(function (err) {
                    alert('Sorry, server connection error.');
                });
        }
    }

    handleToolTip(e) {
        if(e.type === 'mouseover')
            $(e.target).next().addClass('open');
        else $(e.target).next().removeClass('open');
        e.stopPropagation();
    }

    render() {
        return (
            <div className='login-container'>
                <div className='login-block'>
                    <h2>Login</h2>
                    <form className='login-form'
                          onSubmit={this.handleSubmit}>
                        <div className='info'>
                            <div className='info-symbol' onMouseOver={this.handleToolTip}
                                 onMouseOut={this.handleToolTip}/>
                            <div className='info-block'>
                                <ul>
                                    <li>Login can consist only of letters of the Latin alphabet and numbers,
                                        start with a letter
                                        and have a length of at least 5 characters</li>
                                    <li>The password can consist only of letters of the Latin alphabet and numbers
                                        and have a length of at least 6 characters</li>
                                </ul>
                            </div>
                        </div>
                        <LoginTextField label='Login' id='loginTextField' maxLength='20' required={true} name='login'
                                        type='text' handleChange={this.onLoginChange}
                                        error={this.state.errors.length > 0 || !this.state.isLoginValid}/>
                        <br/>
                        <LoginTextField label='Password' id='PasswordTextField' maxLength='25' required={true} name='password'
                                        type='password' handleChange={this.onPasswordChange}
                                        error={this.state.errors.length > 0 || !this.state.isPasswordValid}
                                        helperText={this.state.errors.length > 0 ? this.state.errors[0].errorMessage : undefined}/>
                        <br/>
                        <LoginButton type='submit' label='Login'/><br/><br/>
                        <span className='or-element'>or</span> <br/>
                        <Link to='/registration'><LoginButton label='Registration'/></Link>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = withRouter(connect(mapStateToProps, actions) (Login));

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;