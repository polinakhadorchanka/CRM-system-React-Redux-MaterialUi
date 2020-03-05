let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyList = require('./VacancyList.jsx');
let Board = require('./Board.jsx');

let startVacancies = {
    all : [],
    unviewed: [],
    board : []
};

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        this.setStartVacancies = this.setStartVacancies.bind(this);
        this.setStartVacancies();
    }

    async setStartVacancies() {
        await this.showNextVacancies('all');
        await this.showNextVacancies('unviewed');
        await this.showNextVacancies('board');

        this.props.addVacancy(startVacancies.all, 'all');
        this.props.addVacancy(startVacancies.unviewed, 'unviewed');
        this.props.addVacancy(startVacancies.board, 'board');
    }

    async showNextVacancies(filter) {
        await fetch(`/api/vacancies?id=undefined&` + `count=10&filter=${filter}`)
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
        return <div>
            <div className='system-name'>
            </div>
            <ul className="nav nav-tabs">
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
            </div>
        </div>;
    }
}

module.exports = connect(null, actions)(Tabs);