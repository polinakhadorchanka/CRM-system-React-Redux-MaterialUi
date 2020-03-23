let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

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
            `count=10&filter=${filter}&techFilter=${techFilter ? techFilter : undefined}`)
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

    async handleSubmit(e) {
        e.preventDefault();
        console.log('sdfsdf');
        let value = document.getElementById('techFilter').value;

        if((this.state.filter !== '' && this.state.filter !== value) || (this.state.filter === '' && value !== '')) {
            await this.setState({filter: value});

            await this.getVacancies('all', this.props.store.user.ClientId, value);
            await this.getVacancies('unviewed', this.props.store.user.ClientId, value);

            this.props.addVacancy(startVacancies.all, 'all');
            this.props.addVacancy(startVacancies.unviewed, 'unviewed');
            this.props.setNextCount(true);
        }
    }

    render() {
        return (
            <form id='techFilterForm' onSubmit={this.handleSubmit} className='searchFilter'>
                <input id='techFilter' type='text' placeholder='Technology search'/>
                <input type='submit' value='' />
            </form>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(FilterInput);