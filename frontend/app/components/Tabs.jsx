let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyList = require('./VacancyList.jsx');
let Board = require('./Board.jsx');
let ParsersTable = require('./ParsersTable.jsx');
let FilterInput = require('./FilterInput.jsx');

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

    render() {
        if (!localStorage.getItem('user') ||
            this.props.match.params.userLogin !== JSON.parse(localStorage.getItem('user')).Login) {
            return <div className='error'>404 - Not found</div>;
        } else {
            return <div>
                <ul className="nav nav-tabs" style={{'position': 'relative'}}>
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
            </div>;
        }
    }

}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(Tabs);