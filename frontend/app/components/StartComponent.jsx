let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");
let Header = require('./Header.jsx');

class StartComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let divStyle = {
                'display' : 'flex',
                'flex-direction' : 'row',
                'justify-content' : 'center',
                'padding' : '10px'
            },
            imgStyle = {
                'width' : '500px',
                'height' : '800px',
                'border' : '1px solid #e1e1e1'
            },
            pStyle = {
                'margin-left' : '20px',
                'max-width' : '650px',
                'color' : '#e1e1e1',
                'text-align' : 'justify'
            };

        return (
            <div style={divStyle}>
                <div>
                    <img style={imgStyle} alt='Тут какая-нибудь картинка'/>
                </div>
                <div>
                    <p style={pStyle}>А тут какое-то описание</p>
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

module.exports = connect(mapStateToProps, actions)(StartComponent);