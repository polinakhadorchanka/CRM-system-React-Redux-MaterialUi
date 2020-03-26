import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import VacancyList from "./VacancyList.jsx";
import Board from "./Board.jsx";
import ParsersTable from "./ParsersTable.jsx";
import FilterInput from "./FilterInput.jsx";
import TabButton from "./material/TabButton.jsx";
import UpdateRounded from '@material-ui/icons/UpdateRounded';

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
    }

    async setStartVacancies(e, techFilter) {
        $('.description').addClass('description-hide');
        if( document.getElementById('techFilter')) document.getElementById('techFilter').value = '';

        await this.props.setUser(JSON.parse(localStorage.getItem('user')));
        await this.getVacancies('all', this.props.store.user.ClientId, techFilter ? techFilter : undefined);
        await this.getVacancies('unviewed', this.props.store.user.ClientId, techFilter ? techFilter : undefined);
        await this.getVacancies('board', this.props.store.user.ClientId);
        await this.getParsers();

        this.props.addVacancy(startVacancies.all, 'all');
        this.props.addVacancy(startVacancies.unviewed, 'unviewed');
        this.props.addVacancy(startVacancies.board, 'board');
        this.props.addParsers(startVacancies.parsers);

        this.props.setNextCount(true);
    }

    async getParsers() {
        await fetch(`/api/parsers`)
            .then(response => response.json()).then(function (data) {
                startVacancies.parsers = data;
            })
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    async getVacancies(filter, userId, techFilter) {
        await fetch(`/api/vacancies?userId=${userId}&id=undefined&` +
            `count=9&filter=${filter}&techFilter=${techFilter ? techFilter : undefined}`)
            .then(response => response.json()).then(function (data) {
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
                console.log('EXP: ', err);
            });
    }

    render() {
        if (!localStorage.getItem('user') ||
            this.props.userLogin !== JSON.parse(localStorage.getItem('user')).Login) {
            return <div className='error'>404 - Not found</div>;
        } else {
            return (

                <div>
                    <ul className="nav nav-tabs" style={{'position': 'relative'}}>
                        <li className="nav-item">
                            <TabButton id='all' href="#l-all" label='All' className="nav-link active" dataToggle="tab"/>
                        </li>
                        <li className="nav-item">
                            <TabButton id='unviewed' href="#l-unviewed" label='Unviewed' className="nav-link" dataToggle="tab"/>
                        </li>
                        <li className="nav-item">
                            <TabButton id='board' href="#board-tab" label='Board' className="nav-link" dataToggle="tab"/>
                        </li>
                        <li className="nav-item">
                            <TabButton id='Parsers' href="parsers-tab" label='Parsers' className="nav-link" dataToggle="tab"/>
                        </li>
                        <li id='update-tab'>
                            <TabButton className="nav-link" id='update-item' title='Update' handleClick={this.setStartVacancies} startIcon={<UpdateRounded/>}/>
                        </li>
                        <FilterInput/>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="l-all">
                            <VacancyList filter='all' ref='l-all'/>
                        </div>
                        <div className="tab-pane fade show" id="l-unviewed">
                            <VacancyList filter='unviewed' ref='l-unviewed'/>
                        </div>
                        <div className="tab-pane fade" id="board-tab">
                            <Board/>
                        </div>
                        <div className="tab-pane fade" id="parsers-tab">
                            <ParsersTable/>
                        </div>
                    </div>
                </div>
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

/*
<div>
                    <ul className="nav nav-tabs" style={{'position': 'relative'}}>
                        <li className="nav-item">
                            <TabButton href='#qqq' label='tab'/>
                        </li>
                        <li className="nav-item">
                            <a id='all' className="nav-link active" data-toggle="tab" href="#l-all">All</a>
                        </li>
                        <li className="nav-item">
                            <a id='unviewed'
                               className="nav-link" data-toggle="tab" href="#l-unviewed">Unviewed</a>
                        </li>
                        <li className="nav-item">
                            <a id='board'
                               className="nav-link" data-toggle="tab" href="#board-tab">Board</a>
                        </li>
                        <li className="nav-item">
                            <a id='Parsers'
                               className="nav-link" data-toggle="tab" href="#parsers-tab">Parsers</a>
                        </li>
                        <li id='update-tab'>
                            <a href='#'>
                                <div id='update-item' title='Update' onClick={this.setStartVacancies}/>
                            </a>
                        </li>
                        <FilterInput/>
                    </ul>
                    <div className="tab-content">
                        <div className="tab-pane fade show active" id="l-all">
                            <VacancyList filter='all' ref='l-all'/>
                        </div>
                        <div className="tab-pane fade show" id="l-unviewed">
                            <VacancyList filter='unviewed' ref='l-unviewed'/>
                        </div>
                        <div className="tab-pane fade" id="board-tab">
                            <Board/>
                        </div>
                        <div className="tab-pane fade" id="parsers-tab">
                            <ParsersTable/>
                        </div>
                    </div>
                </div>
 */