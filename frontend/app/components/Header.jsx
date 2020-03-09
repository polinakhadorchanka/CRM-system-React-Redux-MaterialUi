let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    myAccount() {
        return (
            <div className='my-account'>
                <input type='button' id='my-account-list' value='My Account'/>
                <div className='my-account-list hide'>
                    <span>My settings</span>
                    <span>Log out</span>
                </div>
            </div>
        );
    }

    logIn() {
        return (
        <div>
            <input type='button' id='login' value='Log In' onClick={function() {window.location.href = '/login'}}/>
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