let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginState: 'default',
            registrationState: 'default',
            logoutState: 'default'
        };

        this.logOut = this.logOut.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        if(localStorage.getItem('user'))
            props.setUser(JSON.parse(localStorage.getItem('user')));
    }

    handleLogin(e) {
        if(e.type === 'mouseover' || e.type === 'focus')
            this.setState({loginState : 'focus'});
        else this.setState({loginState: 'default'})
    }

    handleRegistration(e) {
        if(e.type === 'mouseover' || e.type === 'focus')
            this.setState({registrationState : 'focus'});
        else this.setState({registrationState: 'default'})
    }

    handleLogout(e) {
        if(e.type === 'mouseover' || e.type === 'focus')
            this.setState({logoutState : 'focus'});
        else this.setState({logoutState: 'default'})
    }

    logOut() {
        let divStyle = {
                'display' : 'flex',
                'flex-direction' : 'row'
            },
            aStyle = {
                'margin-right': '10px',
                'padding':' 1px 10px 0',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#e1e1e1',
                'border': '1px solid #e1e1e1'
            },
            aFocusStyle = {
                'margin-right': '10px',
                'padding':' 1px 10px 0',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#7f9fd5',
                'border': '1px solid #7f9fd5',
                'text-decoration' : 'none'
            },
            spanStyle = {
                'color': '#e1e1e1',
                'margin': '2px 10px 0 0'
            };

        return (
            <div style={divStyle}>
                <span style={spanStyle}>{this.props.store.user.Login}</span>
                <a style={this.state.logoutState === 'default' ? aStyle : aFocusStyle} href='/login'
                   onClick={() => localStorage.removeItem('user')}
                   onMouseOver={this.handleLogout} onMouseOut={this.handleLogout}
                   onFocus={this.handleLogout} onBlur={this.handleLogout}>
                    Log out
                </a>
            </div>
        );
    }

    logIn() {
        let divStyle = {
                'display' : 'flex',
                'flex-direction' : 'row'
            },
            aStyle = {
                'margin-right': '10px',
                'padding':' 1px 10px 0',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#e1e1e1',
                'border': '1px solid #e1e1e1'
            },
            aFocusStyle = {
                'margin-right': '10px',
                'padding':' 1px 10px 0',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#7f9fd5',
                'border': '1px solid #7f9fd5',
                'text-decoration' : 'none'
            };

        return (
            <div style={divStyle}>
                <a style={this.state.loginState === 'default' ? aStyle : aFocusStyle} id='login' href='/login'
                   onMouseOver={this.handleLogin} onMouseOut={this.handleLogin}
                   onFocus={this.handleLogin} onBlur={this.handleLogin}>
                    Log in
                </a>
                <a style={this.state.registrationState === 'default' ? aStyle : aFocusStyle} id='login'
                   href='/registration'
                   onMouseOver={this.handleRegistration} onMouseOut={this.handleRegistration}
                   onFocus={this.handleRegistration} onBlur={this.handleRegistration}>
                    Registration
                </a>
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

module.exports = connect(mapStateToProps, actions)(Header);