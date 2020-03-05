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

    render() {
        let unValid = {
            'border': '1px solid #CF3F3B'
        };

        return (
            <div className='login-container'>
                <div className='login-block'>
                    <h2>Authorization</h2>
                    <form className='login-form' action='/login'>
                        <input type='text' placeholder='Login' name='login'
                               style={this.state.isLoginValid === false ? unValid : null}
                               onChange={this.onLoginChange}/> <br/>
                        <input type='password' placeholder='Password' name='password'
                               style={this.state.isPasswordValid === false ? unValid : null}
                               onChange={this.onPasswordChange}/> <br/>
                        <input type='submit' name='type' value='Login'/> <br/><br/>
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