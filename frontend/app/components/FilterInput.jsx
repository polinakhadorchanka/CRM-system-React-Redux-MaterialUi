let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class FilterInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='searchFilter'>
                <input type='text' placeholder='Technology search'/>
                <input type='submit' value='' onSubmit={(e) => e.preventDefault()} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(FilterInput);