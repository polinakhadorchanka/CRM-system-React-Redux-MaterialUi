let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class Login extends React.Component {
    render() {
        return (
          <div className='login-container'>
              <h2>Authorization</h2>
              <form className='login-form' action='/login'>
                  <input type='text' placeholder='Login' name='Login'/>
                  <input type='password' placeholder='Password' name='Password'/>
                  <input type='submit' value='Login'/>
              </form>
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