let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

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

        let val2 = document.getElementById('confirmPassword').value;

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
                else window.location.href = '/login';
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
        let style = {
            'margin-top' : '5px'
        };

        let unValid = {
            'border': '1px solid #CF3F3B'
        };

        let errorMessages = {
            'color' : '#CF3F3B'
        };

        return (
            <div className='login-container'>
                <div className='login-block'>
                    <h2>Registration</h2>
                    <form className='login-form' onSubmit={this.handleSubmit}>
                        <div className='info'>
                            <label htmlFor='login'>Login:</label>
                            <div className='info-symbol' onMouseOver={this.handleToolTip}
                                 onMouseOut={this.handleToolTip}/>
                            <div className='info-block'>
                                <ul>
                                    <li>Login can consist only of letters of the Latin alphabet and numbers,
                                        start with a letter
                                        and have a length of at least 5 characters</li>
                                    <li>The password can consist only of letters of the Latin alphabet and numbers
                                        and have a length of at least 6 characters</li>
                                    {this.state.errors.length > 0 ? <br/> : ''}
                                    {
                                        this.state.errors.map(function(error){
                                            return <li style={errorMessages}>{error.errorMessage}</li>
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                        <input id='login' type='text' placeholder='Login' name='login' maxLength={20}
                               style={this.state.isLoginValid === false ||
                               this.state.errors.filter((el) => el.errorCode === 1).length > 0
                                   ? unValid : null}
                               onChange={this.onLoginChange}/> <br/>
                        <label htmlFor='password'>Password:</label>
                        <input id='password' type='password' placeholder='Password' name='password' maxLength={25}
                               style={this.state.isPasswordValid === false ? unValid : null}
                               onChange={this.onPasswordChange}/> <br/>
                        <label htmlFor='confirmPassword'>Confirm password:</label>
                        <input id='confirmPassword' type='password' placeholder='Confirm password' maxLength={25}
                               name='confirmPassword'
                               style={this.state.isConfirmPasswordValid === false ? unValid : null}
                               onChange={this.onConfirmChange}/> <br/>
                        <label htmlFor='email'>E-mail:</label>
                        <input id='email' type='text' placeholder='E-mail' name='email' maxLength={50}
                               style={this.state.isEmailValid === false ||
                               this.state.errors.filter((el) => el.errorCode === 2).length > 0
                                   ? unValid : null}
                               onChange={this.onEmailChange}/> <br/>
                        <input type='submit' name='type' value='Registration' style={style}/>
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

module.exports = connect(mapStateToProps, actions)(Registration);