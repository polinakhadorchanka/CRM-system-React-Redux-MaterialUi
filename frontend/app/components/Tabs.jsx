let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyList = require('./VacancyList.jsx');
let Board = require('./Board.jsx');
let Header = require('./Header.jsx');

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
        await this.props.setUser(JSON.parse(sessionStorage.getItem('user')));
        await this.showNextVacancies('all', this.props.store.user.ClientId);
        await this.showNextVacancies('unviewed', this.props.store.user.ClientId);
        await this.showNextVacancies('board', this.props.store.user.ClientId);

        this.props.addVacancy(startVacancies.all, 'all');
        this.props.addVacancy(startVacancies.unviewed, 'unviewed');
        this.props.addVacancy(startVacancies.board, 'board');
    }

    async showNextVacancies(filter, userId) {
        await fetch(`/api/vacancies?userId=${userId}&id=undefined&` +
            `count=10&filter=${filter}`)
            .then(response => response.json()).then(function (data) {
                console.log(data);
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
        if (!sessionStorage.getItem('user') ||
            this.props.match.params.userLogin !== JSON.parse(sessionStorage.getItem('user')).Login) {
            return <h1>error 404</h1>;
        } else {
            return <div>
                <Header/>
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

}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(Tabs);