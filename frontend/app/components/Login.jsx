let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            isLoginValid: true,
            isPasswordValid: true,
            login: '',
            password: '',
        };

        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onLoginChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z][a-zA-Z0-9-_\.]{4,20}$/;

        if(regexp.test(val))
            this.setState({isLoginValid: true, login : val});
        else this.setState({isLoginValid: false, login : val});
    }

    onPasswordChange(e) {
        let val = e.target.value,
            regexp = /^[a-zA-Z0-9-_\.]{6,25}$/;

        if(regexp.test(val))
            this.setState({isPasswordValid: true, password : val});
        else this.setState({isPasswordValid: false, password : val});
    }

    handleSubmit(e) {
        if(e.target.value === 'Login') {
            e.preventDefault();
            let login = this.state.login,
                password = this.state.password,
                confirmPassword = this.state.confirmPassword,
                email = this.state.email;

            if (login === '' || password === '' || confirmPassword === '' || email === '') {
                this.setState({
                    isLoginValid: login !== '',
                    isPasswordValid: password !== '',
                    isConfirmPasswordValid: confirmPassword !== '',
                    isEmailValid: email !== '',
                    errorMessage: 'Неверно заполнены данные'
                });
                $('.info-block').addClass('open');
            } else if (!this.state.isLoginValid || !this.state.isPasswordValid ||
                !this.state.isConfirmPasswordValid || !this.state.isEmailValid) {
                this.setState({errorMessage: 'Неверно заполнены данные'});
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
                    .then(response => response.json()).then(function (data) {
                    if (data.errorMessage !== null)
                        context.setState({errorMessage: data.errorMessage});
                    else alert('Good!');
                })
                    .catch(function (err) {
                        console.log('EXP: ', err);
                    });
            }
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

        let formStyle = {
            'height' : '410px',
            'margin-top' : '-205px'
        };

        return (
            <div className='login-container'>
                <div className='login-block' style={formStyle}>
                    <h2>Login</h2>
                    <form className='login-form' action='/login' method='post'
                          onSubmit={this.handleSubmit}>
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
                                </ul>
                            </div>
                        </div>
                        <input id='login' type='text' placeholder='Login' name='login' maxLength={20}
                               style={this.state.isLoginValid === false ? unValid : null}
                               onChange={this.onLoginChange}/> <br/>
                        <label htmlFor='password'>Password:</label>
                        <input id='password' type='password' placeholder='Password' name='password' maxLength={25}
                               style={this.state.isPasswordValid === false ? unValid : null}
                               onChange={this.onPasswordChange}/> <br/>
                        <input type='submit' name='type' value='Login' style={style}/><br/><br/>
                        <span className='or-element'>or</span> <br/>
                        <input type='submit' name='type' value='Registration'/>
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

module.exports = connect(mapStateToProps, actions)(Login);