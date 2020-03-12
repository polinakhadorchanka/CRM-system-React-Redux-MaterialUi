let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginState: 'default',
            registrationState: 'default',
            accountState: 'default',
            settingsState: 'default',
            logoutState: 'default'
        };

        this.logOut = this.logOut.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.handleAccount = this.handleAccount.bind(this);
        this.handleAccountList = this.handleAccountList.bind(this);

        if(sessionStorage.getItem('user'))
            props.setUser(JSON.parse(sessionStorage.getItem('user')));
    }

    logOut() {
        this.props.setUser(null);
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    }

    accountList() {
        let divStyle = {
                'display': 'block',
                'position': 'absolute',
                'min-width':' 130px',
                'padding-bottom': '5px',
                'background-color': '#1e1e1e',
                'border': '1px solid #7f9fd5',
                'z-index': '1',
                'bottom': '-70px',
                'right': '10px'
            },
            aStyle = {
                'display': 'block',
                'padding':'5px 10px 0',
                'color': '#e1e1e1',
                'font-size': '15px',
                'text-decoration': 'none',
                'text-align': 'left',
                'cursor': 'pointer'
            },
            aFocusStyle = {
                'display': 'block',
                'padding':'5px 10px 0',
                'color': '#7f9fd5',
                'font-size': '15px',
                'text-decoration': 'none',
                'text-align': 'left',
                'cursor': 'pointer'
            };

        return (
            <div id='my-account-list' style={divStyle}>
                <a style={this.state.settingsState === 'default' ? aStyle : aFocusStyle} href='/settings' name='settings'
                   onMouseOver={this.handleAccountList} onMouseOut={this.handleAccountList}>
                    My settings
                </a>
                <a style={this.state.logoutState === 'default' ? aStyle : aFocusStyle} onClick={this.logOut}
                   href='/login' name='logout'
                   onMouseOver={this.handleAccountList} onMouseOut={this.handleAccountList}>
                    Log out
                </a>
            </div>
        );
    }

    handleAccountList(e) {
        switch (e.target.name) {
            case 'settings':
                if(e.type === 'mouseover')
                    this.setState({settingsState : 'focus'});
                else this.setState({settingsState : 'default'});
                break;
            case 'logout':
                if(e.type === 'mouseover')
                    this.setState({logoutState : 'focus'});
                else this.setState({logoutState : 'default'});
                break;
        }
    }

    myAccount() {
        let spanStyle = {
                'margin-right': '10px',
                'padding':' 0 10px',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#e1e1e1',
                'border': '1px solid #e1e1e1',
                'cursor': 'pointer',
                'user-select': 'none'
            },
            spanFocusStyle = {
                'margin-right': '10px',
                'padding':' 0 10px',
                'height': '30px',
                'background': 'none',
                'outline': 'none',
                'color': '#7f9fd5',
                'border': '1px solid #7f9fd5',
                'text-decoration' : 'none',
                'cursor': 'pointer',
                'user-select': 'none'
            },
            divStyle = {
                'position' : 'relative'
            };

        return (
            <div style={divStyle}>
                <span style={this.state.accountState === 'default' ? spanStyle : spanFocusStyle}
                      tabIndex='0' id='my-account-list' onClick={this.handleAccount} onBlur={this.handleAccount}
                      onMouseOver={this.handleAccount} onMouseOut={this.handleAccount}
                      onFocus={this.handleAccount}>
                    My Account
                </span>
                {this.state.accountState === 'focus' ? this.accountList() : undefined}
            </div>
        );
    }

    async handleAccount(e) {
        if(e.type === 'click' && this.state.accountState === 'hover' ||
            e.type === 'click' && this.state.accountState === 'default')
            this.setState({accountState : 'focus'});
        else if(e.type === 'click' && this.state.accountState === 'focus')
            this.setState({accountState : 'default'});
        else if(e.type === 'mouseover' &&  this.state.accountState === 'default')
            this.setState({accountState : 'hover'});
        else if(e.type === 'mouseout' &&  this.state.accountState === 'hover')
            this.setState({accountState : 'default'});
        else if(e.type === 'focus')
            this.setState({accountState : 'hover'});
        else if(e.type === 'blur') {
            let elements = document.querySelectorAll(':hover');
            if(!elements[elements.length-2] || elements[elements.length-2].id !== 'my-account-list')
                this.setState({accountState: 'default'});
        }
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
                    Login
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
                <div style={systemNameStyle} onClick={() => window.location.href = '/'}>
                    CRM System
                </div>
                {this.props.store.user ? this.myAccount() : this.logIn()}
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