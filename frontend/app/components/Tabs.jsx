import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import TabPanel from "./Material/TabPanel.jsx";

let startVacancies = {
    all : [],
    unviewed: [],
    board : [],
    parsers: []
};

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        this.setStartVacancies = this.setStartVacancies.bind(this);
        this.setStartVacancies();
		
		document.title = ' CRM-system';
    }

    async setStartVacancies(e, techFilter) {
        $('.description').addClass('description-hide');
        if( document.getElementById('techFilter')) document.getElementById('techFilter').value = '';

        await this.props.setUser(JSON.parse(localStorage.getItem('user')));
        await this.getVacancies('all', this.props.store.user.ClientId, techFilter ? techFilter : undefined);
        await this.getVacancies('unviewed', this.props.store.user.ClientId, techFilter ? techFilter : undefined);
        await this.getVacancies('board', this.props.store.user.ClientId);
        await this.getParsers();

        await this.props.addVacancy(startVacancies.all, 'all');
        await this.props.addVacancy(startVacancies.unviewed, 'unviewed');
        await this.props.addVacancy(startVacancies.board, 'board');
        await this.props.addParsers(startVacancies.parsers);

        this.props.setNextCount(true, 'all');
        this.props.setNextCount(true, 'unviewed');
    }

    async getParsers() {
        await fetch(`/api/parsers`)
            .then(function (response) {
                if (response.status !== 200) {
                    alert('Sorry, server connection error.');
                    return;
                }
                return response.json();
            }).then(function (data) {
                startVacancies.parsers = data;
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    async getVacancies(filter, userId, techFilter) {
        await fetch(`/api/vacancies?userId=${userId}&id=undefined&` +
            `count=9&filter=${filter}&techFilter=${techFilter ? techFilter : undefined}`)
            .then(function (response) {
                if (response.status !== 200) {
                    alert('Sorry, server connection error.');
                    return;
                }
                return response.json();
            }).then(function (data) {
                switch(filter) {
                    case 'all':
                        startVacancies.all = data; break;
                    case 'unviewed':
                        startVacancies.unviewed = data; break;
                    case 'board':
                        startVacancies.board = data; break;
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    render() {
        if (!localStorage.getItem('user') ||
            this.props.userLogin !== JSON.parse(localStorage.getItem('user')).Login) {
            return <div className='error'>404 - Not found</div>;
        } else {
            return (
                <TabPanel setNextCount={this.props.setNextCount} handleClick={this.setStartVacancies}/>
            );
        }
    }

}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (Tabs);

class Export extends React.Component {
    render(){
        return (<Connected userLogin={this.props.match.params.userLogin}/>);
    }
}

export default Export;