import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import LoginTextField from "./material/LoginTextField.jsx";
import LoginButton from "./material/LoginButton.jsx";

import { createBrowserHistory } from 'history';
import {withRouter} from "react-router-dom"

let history = createBrowserHistory();

class Registration extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoginValid: true,
            isPasswordValid: true,
            isConfirmPasswordValid: true,
            isEmailValid: true,
            login: '',
            password: '',
            confirmPassword: '',
            email: '',
            errors: []
        };

        if(localStorage.getItem('user') !== null)
            props.history.push(`/${JSON.parse(localStorage.getItem('user')).Login}`);

        document.title = document.title + ' - Registration';

        this.onEmailChange = this.onEmailChange.bind(this);
        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmChange = this.onConfirmChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onEmailChange(e) {
        let val = e.target.value,
            regexp = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i,
            errors = this.state.errors.filter((el) => el.errorCode !== 2);

        if(regexp.test(val))
            this.setState({isEmailValid: true, email : val, errors: errors});
        else this.setState({isEmailValid: false, email : val, errors: errors});
    }

    onLoginChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z][a-zA-Z0-9-_\.]{4,20}$/,
            errors = this.state.errors.filter((el) => el.errorCode !== 1);

        if(regexp.test(val))
            this.setState({isLoginValid: true, login : val, errors: errors});
        else this.setState({isLoginValid: false, login : val, errors: errors});
    }

    onPasswordChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z0-9-_\.]{6,25}$/;

        if(regexp.test(val))
            this.setState({isPasswordValid: true, password : val});
        else this.setState({isPasswordValid: false, password : val});

        let val2 = document.getElementById('confirmTextField').value;

        if(regexp.test(val2) && val2 === val)
            this.setState({isConfirmPasswordValid: true, confirmPassword : val2});
        else this.setState({isConfirmPasswordValid: false, confirmPassword : val2});
    }

    onConfirmChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z0-9-_\.]{6,25}$/;

        if(regexp.test(val) && val === this.state.password)
            this.setState({isConfirmPasswordValid: true, confirmPassword : val});
        else this.setState({isConfirmPasswordValid: false, confirmPassword : val});
    }

    handleSubmit(e) {
        e.preventDefault();
        let login = this.state.login,
            password = this.state.password,
            confirmPassword = this.state.confirmPassword,
            email = this.state.email;

        if(login === '' || password === '' || confirmPassword === '' || email === '') {
            this.setState({
                isLoginValid: login !== '',
                isPasswordValid: password !== '',
                isConfirmPasswordValid: confirmPassword !== '',
                isEmailValid: email !== '',
                errorMessage : 'Неверно заполнены данные'
            });
            $('.info-block').addClass('open');
        }
        else if(!this.state.isLoginValid || !this.state.isPasswordValid ||
            !this.state.isConfirmPasswordValid || !this.state.isEmailValid) {
            this.setState({errorMessage: 'Неверно заполнены данные'});
            $('.info-block').addClass('open');
        }
        else {
            let context = this,
                obj = {
                    login : e.target.login.value,
                    password : e.target.password.value,
                    email : e.target.email.value
                };
            fetch(`/registration`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(obj)
                })
                .then(response => response.json()).then(function (data) {
                if(data[0].errorCode !== 0) {
                    $('.info-block').addClass('open');
                    context.setState({errors : data});
                }

                context.props.history.push('/login');
            })
                .catch(function (err) {
                    console.log('EXP: ', err);
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
                    <h2>Registration</h2>
                    <form className='login-form' onSubmit={this.handleSubmit}>
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
                                        error={this.state.errors.filter((el) => el.errorCode === 1).length > 0 || !this.state.isLoginValid}
                                        helperText={this.state.errors.filter((el) => el.errorCode === 1).length > 0 ?
                                            this.state.errors.filter((el) => el.errorCode === 1)[0].errorMessage : undefined}/>
                        <br/>
                        <LoginTextField label='password' id='passwordTextField' maxLength='25' required={true} name='password'
                                        type='password' handleChange={this.onPasswordChange}
                                        error={!this.state.isPasswordValid}/>
                        <br/>
                        <LoginTextField label='Confirm password' id='confirmTextField' maxLength='25' required={true} name='confirmPassword'
                                        type='password' handleChange={this.onConfirmChange}
                                        error={!this.state.isConfirmPasswordValid}/>
                        <br/>
                        <LoginTextField label='email' id='emailTextField' maxLength='50' required={true} name='email'
                                        type='text' handleChange={this.onEmailChange}
                                        error={this.state.errors.filter((el) => el.errorCode === 2).length > 0 || !this.state.isEmailValid}
                                        helperText={this.state.errors.filter((el) => el.errorCode === 2).length > 0 ?
                                            this.state.errors.filter((el) => el.errorCode === 2)[0].errorMessage : undefined}/>
                        <br/>
                        <LoginButton type='submit' label='Registration'/>
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

const Connected =  withRouter(connect(mapStateToProps, actions) (Registration));

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;