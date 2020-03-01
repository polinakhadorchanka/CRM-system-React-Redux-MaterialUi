let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyList = require('./VacancyList.jsx');
let Board = require('./Board.jsx');

class Tabs extends React.Component {
    constructor(props) {
        super(props);

        props.addVacancy(props.startVacancies.all, 'all');
        props.addVacancy(props.startVacancies.unviewed, 'unviewed');
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