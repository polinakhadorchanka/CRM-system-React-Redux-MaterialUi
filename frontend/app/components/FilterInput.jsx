import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";
import SearchIcon from '@material-ui/icons/Search';
import IconButton from "@material-ui/core/IconButton";

let startVacancies = {
    all : [],
    unviewed: [],
    board : [],
    parsers: []
};

class FilterInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
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

    async handleSubmit(e) {
        e.preventDefault();
        let value = document.getElementById('techFilter').value;

        if((this.state.filter !== '' && this.state.filter !== value) || (this.state.filter === '' && value !== '')) {
            await this.setState({filter: value});

            await this.getVacancies('all', this.props.store.user.ClientId, value);
            await this.getVacancies('unviewed', this.props.store.user.ClientId, value);

            this.props.addVacancy(startVacancies.all, 'all');
            this.props.addVacancy(startVacancies.unviewed, 'unviewed');

            this.props.setNextCount(true, 'all');
            this.props.setNextCount(true, 'unviewed');
        }
    }

    render() {
        return (
            <form id='techFilterForm' onSubmit={this.handleSubmit} className='searchFilter'>
                <input id='techFilter' type='text' placeholder='Technology search'/>
                <IconButton id='techFilterSubmit' type='submit'>
                    <SearchIcon style={{'color':'#e1e1e1'}} />
                </IconButton>
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (FilterInput);

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;