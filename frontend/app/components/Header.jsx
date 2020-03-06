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
                <input type='button' id='my-account-list'/>
                <div className='my-account-list'>
                    <span>My settings</span>
                    <span>Log out</span>
                </div>
            </div>
        );
    }

    logIn() {
        return (
        <div>
            <input type='button' id='login'/>
        </div>
        );
    }

    render() {
        if(this.props.store.idUser) {
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