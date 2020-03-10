let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.logOut = this.logOut.bind(this);
    }

    handleAccountList(e) {
        if(e.type === 'click') {
            $('#my-account-list').toggleClass('inFocus');
            $('.my-account-list').toggleClass('open');
            e.stopPropagation();
        }
    }

    logOut() {
        console.log('logout');
        this.props.setUser(null);
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    }

    myAccount() {
        return (
            <div className='my-account'>
                <div tabIndex='0' className='button' id='my-account-list' onClick={this.handleAccountList}>
                    My Account
                </div>
                <div className='my-account-list'>
                    <span onClick={() => window.location.href = `/${this.props.store.user.login}/settings`}>
                        My settings
                    </span>
                    <span onClick={this.logOut}>Log out</span>
                </div>
            </div>
        );
    }

    logIn() {
        return (
        <div>
            <div  tabIndex='0' className='button' id='login'onClick={function() {window.location.href = '/login'}}>
                Log In
            </div>
        </div>
        );
    }

    render() {
        if(this.props.store.user) {
            return (
                <header>
                    <div className='system-name'>CRM System</div>
                    {this.myAccount()}
                </header>
            );
        }
        else {
            return (
                <header>
                    <div className='system-name'>CRM System</div>
                    {this.logIn()}
                </header>
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(Header);