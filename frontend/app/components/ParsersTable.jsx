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

        this.handleSubmitBtn = this.handleSubmitBtn.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyChange = this.onKeyChange.bind(this);
        this.onTokenChange = this.onTokenChange.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
        this.changeParser = this.changeParser.bind(this);
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

    onKeyChange(e) {
        let val = e.target.value;
        this.setState({isValidKey: true, ipKey : val, errors: []});
    }

    onTokenChange(e) {
        let val = e.target.value;
        this.setState({isValidToken: true, ipToken : val, errors: []});
    }

    onDescChange(e) {
        let val = e.target.value;
        this.setState({isValidDescription: true, description : val, errors: []});
    }

    handleSubmitBtn(e) {
        if(e.type === 'mouseover' || e.type === 'focus')
            this.setState({submitState : 'focus'});
        else this.setState({submitState : 'default'});
    }

    handleSubmit(e) {
        e.preventDefault();
        let key = this.state.ipKey,
            token = this.state.ipToken,
            description = this.state.description;

        if (key === '' || token === '' || description === '') {
            this.setState({
                isValidKey: key !== '',
                isValidToken: token !== '',
                isValidDescription: description !== ''
            });
        } else {
            let context = this,
                obj = {
                    ParserKey: this.state.ipKey,
                    ParserToken: this.state.ipToken,
                    ParserDescription: this.state.description,
                    ParserState: 0
                };

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
                    console.log('ok');
                    context.setState({
                        ipKey: '',
                        ipToken: '',
                        description: ''
                    });
                    document.getElementById('form').reset();
                    context.props.addParsers(context.props.store.parsers.concat(obj));
                }
            })
                .catch(function (err) {
                    console.log('EXP: ', err);
                });
        }
    }

    render() {
        let divStyle = {
                'color': '#e1e1e1',
                'margin': '0 10px'
            },
            tableStyle = {
                'width': '100%',
                'border-collapse': 'separate',
                'border-spacing': '1px'
            },
            trStyle = {
                'width': '25%',
                'height': '40px'
            },
            thStyle = {
                'padding-left': '10px',
                'padding-right': '10px',
                'background-color': '#b1b1b1',
                'color': '#1e1e1e'
            },
            tdStyle = {
                'padding-left': '10px',
                'padding-right': '10px',
                'background-color': '#383838'
            },
            inputTextStyle = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'border-bottom': '1px solid #e1e1e1',
                'color': '#e1e1e1',
                'outline': 'none'
            },
            inputTextStyleError = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'border-bottom': '1px solid #CF3F3B',
                'color': '#e1e1e1',
                'outline': 'none'
            },
            inputSubmitStyle = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'color': '#e1e1e1',
                'cursor': 'pointer',
                'outline': 'none'
            },
            inputSubmitStyleFocus = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'color': '#7f9fd5',
                'cursor': 'pointer',
                'outline': 'none'
            },
            pStyle = {
                'padding-left': '2px',
                'padding-right': '2px',
                'color': '#CF3F3B'
            };

        let context = this;
        return (
            <div style={divStyle}>
                <table style={tableStyle}>
                    <tr style={trStyle}>
                        <th style={thStyle} width='25%'>IP key</th>
                        <th style={thStyle} width='25%'>IP tocken</th>
                        <th style={thStyle} width='40%'>Description</th>
                        <th style={thStyle} width='7%'/>
                        <th style={thStyle} width='3%'/>
                    </tr>
                    {
                        this.props.store.parsers.map(function (parser, index) {
                            return <Parser parser={parser} index={index}
                                changeParser = {context.changeParser} />
                        })
                    }
                </table>
                <form id='form' onSubmit={this.handleSubmit}>
                    <table style={tableStyle}>
                        <tr style={trStyle}>
                            <td style={tdStyle} width='25%'>
                                <input style={this.state.isValidKey === true ? inputTextStyle : inputTextStyleError}
                                       type='text' placeholder='IP key' name='ipKey' maxLength={12}
                                       onChange={this.onKeyChange}/>
                            </td>
                            <td style={tdStyle} width='25%'>
                                <input style={this.state.isValidToken === true ? inputTextStyle : inputTextStyleError}
                                       type='text' placeholder='IP token' name='ipTocken' maxLength={12}
                                       onChange={this.onTokenChange}/>
                            </td>
                            <td style={tdStyle} width='40%'>
                                <input style={this.state.isValidDescription === true ? inputTextStyle : inputTextStyleError}
                                       type='text' placeholder='Description' name='comment' maxLength={300}
                                       onChange={this.onDescChange}/>
                            </td>
                            <td style={tdStyle} width='10%'>
                                <input style={this.state.submitState === 'default' ?
                                    inputSubmitStyle : inputSubmitStyleFocus}
                                       onMouseOver={this.handleSubmitBtn} onMouseOut={this.handleSubmitBtn}
                                       onFocus={this.handleSubmitBtn} onBlur={this.handleSubmitBtn}
                                       type='submit' value='Add'/>
                            </td>
                        </tr>
                    </table>
                </form>
                {this.state.errors.map(function (error) {
                    return (<p style={pStyle}>{error.errorMessage}</p>);
                })}
            </div>
        );
    }
}


class Parser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            descriptionState: 'text',
            description: props.parser.ParserDescription,
            isValidDesc: true
        };

        this.onHandleEditDesc = this.onHandleEditDesc.bind(this);
        this.changeState = this.changeState.bind(this);
        this.changeDesc = this.changeDesc.bind(this);
    }

    changeState() {
        let parser = this.props.parser;
        parser.ParserState = parser.ParserState == 0 ? 1 : 0;
        this.props.changeParser(parser, 'change');
    }

    onHandleEditDesc(e) {
        if(e.type === 'click')
            this.setState({descriptionState : 'input'});
        else if(e.type === 'blur' && this.state.description === '')
            this.setState({descriptionState : 'input', isValidDesc : false});
        else {
            this.setState({descriptionState : 'text', isValidDesc : true});
            let parser = this.props.parser;
            parser.ParserDescription = this.state.description;
            this.props.changeParser(parser, 'change');
        }
    }

    changeDesc(e) {
        this.setState({description : e.target.value, isValidDesc : true});
    }

    render() {
        let trStyle = {
                'width': '25%',
                'height': '40px'
            },
            tdStyle = {
                'padding-left': '10px',
                'padding-right': '10px',
                'background-color': '#383838'
            },
            inputTextStyle = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'border-bottom': '1px solid #e1e1e1',
                'color': '#e1e1e1',
                'outline': 'none'
            },
            inputTextStyleError = {
                'width': '100%',
                'background-color': 'transparent',
                'border': 'none',
                'border-bottom': '1px solid #CF3F3B',
                'color': '#e1e1e1',
                'outline': 'none'
            };

        return (
            <tr style={trStyle}>
                <td style={tdStyle} width='25%'>{this.props.parser.ParserKey}</td>
                <td style={tdStyle} width='25%'>{this.props.parser.ParserToken}</td>
                <td style={tdStyle} width='40%'>
                    {this.state.descriptionState === 'text' ?
                        <div title='Click to change' onClick={this.onHandleEditDesc}>{this.state.description}</div> :
                        <input autoFocus={true}
                                style={this.state.isValidDesc === true ? inputTextStyle : inputTextStyleError}
                               onBlur={this.onHandleEditDesc} onChange={this.changeDesc}
                            type='text' value={this.state.description} maxLength='300' />}
                </td>
                <td style={tdStyle} width='7%'>
                    <label className="switch">
                        {this.props.parser.ParserState == 0 ?
                            <input type="checkbox" onChange={this.changeState}/> :
                        <input type="checkbox" checked onChange={this.changeState}/>}
                        <span className="slider"></span>
                    </label>
                </td>
                <td style={tdStyle} width='3%'>
                    <div className='delete-button' title='Remove parser'
                         onClick={() => this.props.changeParser(this.props.parser, 'delete')}/>
                </td>
            </tr>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(ParsersTable);
