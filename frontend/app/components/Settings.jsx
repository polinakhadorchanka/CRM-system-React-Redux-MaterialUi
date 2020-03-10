let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");
let Header = require('./Header.jsx');

class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 'General',
            isOldPasswordValid: true,
            isNewPasswordValid: true,
            isConfirmPasswordValid: true,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            errors: [],
            message: ''
        };

        this.generalDiv = this.generalDiv.bind(this);
        this.onOldPasswordChange = this.onOldPasswordChange.bind(this);
        this.onNewPasswordChange = this.onNewPasswordChange.bind(this);
        this.onConfirmChange = this.onConfirmChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        if(sessionStorage.getItem('user'))
            props.setUser(JSON.parse(sessionStorage.getItem('user')));
    }

    onOldPasswordChange(e) {
        let val = e.target.value;
        if(val === this.props.store.user.Password)
            this.setState({isOldPasswordValid: true, oldPassword : val});
        else this.setState({isOldPasswordValid: false, oldPassword : val});
    }

    onNewPasswordChange(e) {
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
        let oldPassword = this.state.oldPassword,
            newPassword = this.state.newPassword,
            confirmPassword = this.state.confirmPassword;

        if(oldPassword === '' || newPassword === '' || confirmPassword === '') {
            this.setState({
                isOldPasswordValid: oldPassword !== '',
                isNewPasswordValid: newPassword !== '',
                isConfirmPasswordValid: confirmPassword !== ''
            });
            $('.info-block').addClass('open');
        }
        else if(!this.state.isOldPasswordValid || !this.state.isNewPasswordValid ||
            !this.state.isConfirmPasswordValid) {
            $('.info-block').addClass('open');
        }
        else {
            let context = this,
                obj = {
                    userId: this.props.store.user.clientId,
                    oldPassword : e.target.oldPassword.value,
                    newPassword : e.target.newPassword.value,
                    confirmPassword : e.target.confirmPassword.value
                };
            fetch(`/settings?type=changePassword`,
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
                else context.setState({message : 'Password changed successfully'});
            })
                .catch(function (err) {
                    console.log('EXP: ', err);
                });
        }
    }

    generalDiv() {
        let unValid = {
            'border': '1px solid #CF3F3B'
        };

        let errorMessages = {
            'color' : '#CF3F3B'
        };

        return (
            <div>
                <h3>Personal Information</h3>
                <hr/>
                <label>Login:</label><span className='general-info'>{this.props.store.user.Login}</span><br/>
                <label>E-mail:</label><span className='general-info'>{this.props.store.user.Email}</span><br/>
                <h3>Change password</h3>
                <hr/>
                <form onSubmit={this.handleSubmit}>
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

                    <label htmlFor='password'>Old password:</label>
                    <input id='OldPassword' type='password' placeholder='Old password' name='oldPassword' maxLength={25}
                           style={this.state.isOldPasswordValid === false ? unValid : null}
                           onChange={this.onOldPasswordChange}/> <br/>
                    <label htmlFor='password'>New password:</label>
                    <input id='newPassword' type='password' placeholder='New password' name='newPassword' maxLength={25}
                           style={this.state.isNewPasswordValid === false ? unValid : null}
                           onChange={this.onNewPasswordChange}/> <br/>
                    <label htmlFor='confirmPassword'>Confirm password:</label>
                    <input id='confirmPassword' type='password' placeholder='Confirm password' maxLength={25}
                           name='confirmPassword'
                           style={this.state.isConfirmPasswordValid === false ? unValid : null}
                           onChange={this.onConfirmChange}/> <br/>
                    <input type='submit' value='Change password'/>
                </form>
            </div>
        );
    }

    render() {
        console.log(this.props.store.user);
        if(!sessionStorage.getItem('user')) {
            return <h1>error 404</h1>;
        } else {
            return (
                <div>
                    <Header/>
                    <div className='settings'>
                        <nav>
                            <ul>
                                <li className={this.state.active === 'General' ? 'active' : undefined}>General</li>
                            </ul>
                        </nav>
                        <main>
                            {this.props.store.user ? this.generalDiv() : undefined}
                        </main>
                    </div>
                </div>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(Settings);