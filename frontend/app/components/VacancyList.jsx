import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import VacancyBlock from "./VacancyBlock.jsx";
import CountButton from "./Material/CountButton.jsx";

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            nextCount: 0,
            filter: props.filter
        };

        this.changeStore = this.changeStore.bind(this);
        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);
        this.getNextCount = this.getNextCount.bind(this);

        this.getNextCount();
        if(this.state.filter === 'all') this.getNewVacanciesCount(this);
    }

    async getNextCount() {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            context = this,
            id = positions[positions.length-1] ?
                positions[positions.length-1].VacancyId : undefined,
            userId = this.props.store.user.ClientId,
            techFilter = document.getElementById('techFilter') ? document.getElementById('techFilter').value : undefined;

        await fetch(`/api/vacancies/next?userId=${userId}&id=${id}&filter=${context.state.filter}` +
            `&techFilter=${techFilter !== '' ? techFilter : undefined}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`ERR: getNextCount : ` + response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        data[0].count <= 9 ? context.setState({nextCount: data[0].count}) :
                            context.setState({nextCount: 9});
                    });
                }
            )
            .catch(function (err) {
                console.log(err);
            });
    }

    async showNextVacancies() {
        let context = this,
            positions = context.state.filter === 'all' ? context.props.store.allVacancies
            : context.props.store.unviewedVacancies,
            id = positions[positions.length-1] ?
                positions[positions.length-1].VacancyId : undefined,
            userId = this.props.store.user.ClientId,
            techFilter = document.getElementById('techFilter') ? document.getElementById('techFilter').value : undefined;

        await fetch(`/api/vacancies?userId=${userId}&id=${id}&` +
            `count=${this.state.nextCount}&filter=${this.state.filter}` +
            `&techFilter=${techFilter !== '' ? techFilter : undefined}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        alert('Sorry, server cnnection error.');
                        return;
                    }

                    response.json().then(function(data) {
                        context.changeStore('ADD_VACANCY', positions.concat(data), context.state.filter);
                    }).then(function () {
                        context.getNextCount();
                    });
                }
            )
            .catch(function(err) {
                console.log(err);
            });
    }

    async getNewVacanciesCount(context) {
        let timerId = await setTimeout(function request() {
            let positions = context.state.filter === 'all' ? context.props.store.allVacancies
                : context.props.store.unviewedVacancies,
                id = positions[0] ? positions[0].VacancyId : undefined,
                userId = context.props.store.user.ClientId, a =1;

            if(document.getElementById('techFilter') && document.getElementById('techFilter').value === '') {
                fetch(`/api/vacancies/new/count?userId=${userId}&id=${id}&filter=${context.state.filter}`)
                    .then(
                        function (response) {
                            if (response.status !== 200) {
                                alert('Sorry, server cnnection error.');
                                return;
                            }

                            response.json().then(function (data) {
                                context.changeStore('CHANGE_COUNT', data[0].count);
                                context.getNewVacanciesCount(context);
                            });
                        }
                    )
                    .catch(function (err) {
                    });
            } else {
                context.changeStore('CHANGE_COUNT', 0);
                context.getNewVacanciesCount(context);
            }
        }, 10000);
    }

    async showNewVacancies(e) {
        if(document.getElementById('techFilter').value === '') {
            let context = this,
                allPositions = context.props.store.allVacancies,
                unviewedPositions = context.props.store.unviewedVacancies,
                id = allPositions[0] ? allPositions[0].VacancyId : undefined,
                userId = this.props.store.user.ClientId;

            $('.description').addClass('description-hide');

            await fetch(`api/vacancies/new?userId=${userId}&id=${id}&filter=${this.state.filter}`)
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('ERR: /api/vacancies/new : ' +
                                response.status);
                            return;
                        }

                        response.json().then(function (data) {
                            context.changeStore('CHANGE_COUNT', 0);
                            context.changeStore('ADD_VACANCY', data.concat(allPositions), 'all');
                            context.changeStore('ADD_VACANCY', data.concat(unviewedPositions), 'unviewed');

                            window.scrollTo(0, 0);
                        });
                    }
                )
                .catch(function (err) {
                    console.log(err);
                });
        }
        else {
            document.getElementById('techFilter').value = '';
            document.getElementById('techFilterForm').submit();
        }
    }

    changeStore(type, data, filter) {
        switch(type) {
            case 'ADD_VACANCY': this.props.addVacancy(data, filter); break;
            case 'CHANGE_COUNT': this.props.changeNewVacanciesCount(data); break;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let positions = prevState.filter === 'all' ? prevProps.store.allVacancies : prevProps.store.unviewedVacancies;

        switch (prevState.filter) {
            case 'all':
                if(this.props.store.updateNextCountAll === true && positions.length > 0) {
                    this.props.setNextCount(false, 'all');
                    this.getNextCount();
                }
                else if(this.props.store.updateNextCountAll === true && positions.length === 0) {
                    this.props.setNextCount(false, 'all');
                    this.setState({nextCount: 0});
                }
                break;
            case 'unviewed':
                if(this.props.store.updateNextCountUnviewed === true && positions.length > 0) {
                    this.props.setNextCount(false, 'unviewed');
                    this.getNextCount();
                }
                else if(this.props.store.updateNextCountUnviewed === true && positions.length === 0) {
                    this.props.setNextCount(false, 'unviewed');
                    this.setState({nextCount: 0});
                }
                break;
        }
    }

    render() {
        let filter = this.state.filter,
        positions = this.state.filter === 'all' ? this.props.store.allVacancies : this.props.store.unviewedVacancies;

        return <div className="vacancy-list">
            {
                positions.map(function(vacancy, index){
                    if(vacancy.IsRemoved != 1)
                        return <VacancyBlock position={vacancy} filter={filter} index={index}/>
                })
            }
            <CountButton count={this.props.store.newVacanciesCount} handleClick={this.showNewVacancies}/>
            <div id="bottom-block"
                 className={this.state.nextCount <= 0 ? "hide" : ""}
                 onClick={this.showNextVacancies}>
                &darr; show next {this.state.nextCount} vacancies &darr;
            </div>
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (VacancyList);

class Export extends React.Component {
    render(){
        return (<Connected filter={this.props.filter}/>);
    }
}

export default Export;