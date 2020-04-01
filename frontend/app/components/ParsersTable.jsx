import MaterialTable from "./Material/MaterialTable.jsx";

let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class ParsersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitState: 'default',
            ipKey: '',
            ipToken: '',
            description: '',
            isValidKey: true,
            isValidToken: true,
            isValidDescription: true,
            errors: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeParser = this.changeParser.bind(this);
        this.handleRemoveParser = this.handleRemoveParser.bind(this);
        this.changeState = this.changeState.bind(this);
    }

    changeParser(parser, type) {
        switch(type) {
            case 'change':
                this.props.changeParser(parser);
                fetch(`/api/parsers`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(parser)
                    }).catch(function (err) {
                    console.log('EXP: ', err);
                });
                break;
            case 'delete':
                this.props.addParsers(this.props.store.parsers.filter((el) => el.ParserId !== parser.ParserId));

                fetch(`/api/parsers`,
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(parser)
                    }).catch(function (err) {
                    console.log('EXP: ', err);
                });
                break;

        }
    }

    handleRemoveParser(e, func, parserId) {
        let parser = this.props.store.parsers.filter((el) => el.ParserId === parserId)[0];

        this.changeParser(parser, 'delete');

        if(func) func();
    }

    changeState(e, func, parserId) {
        let parser = this.props.store.parsers.filter((el) => el.ParserId === parserId)[0];

        parser.ParserState = parser.ParserState == 0 ? 1 : 0;

        this.changeParser(parser, 'change');
    }

    handleSubmit(e) {
        e.preventDefault();
        let context = this,
            obj = {
                ParserKey: document.getElementById('ipKey').value,
                ParserToken: document.getElementById('ipToken').value,
                ParserDescription: document.getElementById('description').value,
                ParserState: 0
            };

        if(obj.ParserKey === '' || obj.ParserToken === '' || obj.ParserDescription === '') {
            let errors = [];
            if(obj.ParserKey === '') errors.push({errorCode: -1});
            if(obj.ParserToken === '') errors.push({errorCode: -2});
            if(obj.ParserDescription === '') errors.push({errorCode: -3});

            this.setState({errors: errors});
            return;
        }

        fetch(`/api/parsers`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(obj)
            })
            .then(response => response.json()).then(function (data) {
            if (data[0] && data[0].errorCode !== 0) {
                context.setState({errors: data});
            }
            else {
                document.getElementById('ipKey').value = '';
                document.getElementById('ipToken').value = '';
                document.getElementById('description').value = '';

                context.setState({errors: []});
                context.props.addParsers(context.props.store.parsers.concat(obj));
            }
        })
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    render() {
        return (
            <div>
                <MaterialTable parsers={this.props.store.parsers} handleRemove={this.handleRemoveParser}
                               handleChangeCheck={this.changeState} handleSubmit={this.handleSubmit} errors={this.state.errors}/>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (ParsersTable);

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;