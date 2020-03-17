let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class StartComponent extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        let imgStyle = {
                'width' : '100%',
                'min-width': '1000px',
                'opacity': '0.7',
                'user-select': 'none',
                'pointer-events': 'none'
            },
            pStyle = {
                'position': 'absolute',
                'top': '150px',
                'margin-left' : '60px',
                'width' : '35%',
                'min-width' : '370px',
                'color' : '#e1e1e1',
                'font-size': '14px',
                'text-align' : 'justify',
                'opacity': '0.9'
            };

        return (
            <div>
                <div>
                    <img style={imgStyle} src='images/img.png'/>
                </div>
                <div style={pStyle}>
                    <p>А тут наверняка будет какой-нибудь текст,
                    жаль только, что я понятия не имею, что тут писать. Поэтому пока что тут
                    будет это, чтобы посмотреть, как это будет смотреться.</p>
                    <p>А тут второй абзац текста, чтобы его было больше. Вот так вот.</p>
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