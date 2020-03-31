import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";
import VacancyCard from "./Material/VacancyCard.jsx";

class VacancyBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: props.filter,
            isOpening: false
        };

        this.openDescription = this.openDescription.bind(this);
        this.removeVacancy = this.removeVacancy.bind(this);
        this.handleChooseStatus = this.handleChooseStatus.bind(this);
    }

    changeStatus(vacancy, userId) {
        fetch(`/api/vacancy-status?userId=${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(vacancy)
            })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`/api/vacancy-status` +
                            response.status);
                    }
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    async openDescription(e, func) {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        if(!positions[this.props.index].IsViewed || positions[this.props.index].IsViewed === 0) {
            let vacancy = positions[this.props.index];
            vacancy.IsViewed = 1;

            this.props.changeVacancy(vacancy);
            this.changeStatus(vacancy, this.props.store.user.ClientId);
        }

        if(func) func();
    }

    async removeVacancy(e, func) {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            vacancy = positions[this.props.index];

        if (!positions[this.props.index].IsRemoved || positions[this.props.index].IsRemoved === 0) {
            vacancy.IsRemoved = 1;
        } else vacancy.IsRemoved = 0;

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy, this.props.store.user.ClientId);

        if(func) func();
    }

    handleChooseStatus(e, func) {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            vacancy = positions[this.props.index];

        switch(e.target.innerText) {
            case 'new':
                vacancy.BoardStatus = 'new';
                break;
            case 'in the process':
                vacancy.BoardStatus = 'in the process';
                break;
            case 'completed':
                vacancy.BoardStatus = 'completed';
                break;
            case 'deferred':
                vacancy.BoardStatus = 'deferred';
                break;
        }

        if(this.props.store.boardVacancies.filter((e) => e.VacancyId === vacancy.VacancyId).length === 0)
            this.props.addVacancy(this.props.store.boardVacancies.concat(vacancy), 'board');

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy, this.props.store.user.ClientId);

        if(func) func();
        e.stopPropagation();
    }

    setFilter(e) {
        e.stopPropagation();

        let value = e.target.id;
        document.getElementById('techFilter').value = value;
        document.getElementById('techFilterSubmit').click();
    }

    render() {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        return (
            <VacancyCard vacancy={positions[this.props.index]}
                         handleFilter={this.setFilter}
                         handleOpenDesc={this.openDescription}
                         handleChooseStatus={this.handleChooseStatus}
                         handleRemoveVacancy={this.removeVacancy}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (VacancyBlock);

class Export extends React.Component {
    render(){
        return (<Connected position={this.props.position} filter={this.props.filter} index={this.props.index}/>);
    }
}

export default Export;