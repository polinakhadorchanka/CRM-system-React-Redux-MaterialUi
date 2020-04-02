import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";
import {withRouter} from "react-router-dom";

class StartComponent extends React.Component {
    constructor(props) {
        super(props);

        if(localStorage.getItem('user') !== null)
            props.history.push(`/${JSON.parse(localStorage.getItem('user')).Login}`);
    }

    render() {
        let pStyle = {
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
                <div style={pStyle}>

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

const Connected = withRouter(connect(mapStateToProps, actions) (StartComponent));

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;