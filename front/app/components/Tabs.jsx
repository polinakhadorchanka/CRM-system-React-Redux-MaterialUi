let React = require('react');
let VacancyList = require('./VacancyList.jsx');

class Tabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: 'all',
        };

        this.changeActive = this.changeActive.bind(this);
    }

    async changeActive(e) {
        await this.setState({active: e.target.id});
        this.refs.list.showNextVacancies(true)
    }

    render() {
        return <div>
            <div className='system-name'>
            </div>
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a id='all' className="nav-link active" data-toggle="tab" href="#list"
                       onClick={this.changeActive}>All</a>
                </li>
                <li className="nav-item">
                    <a id='unviewed'
                       className="nav-link" data-toggle="tab" href="#list" onClick={this.changeActive}>Unviewed</a>
                </li>
                <li className="nav-item">
                    <a id='favorites'
                       className="nav-link" data-toggle="tab" href="#list" onClick={this.changeActive}>Favorites</a>
                </li>
                <li className="nav-item">
                    <a id='board'
                       className="nav-link" data-toggle="tab" href="#board-tab">Board</a>
                </li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane fade show active" id="list">
                    <VacancyList filter={this.state.active} ref='list'/>
                </div>
                <div className="tab-pane fade" id="board-tab">
                    Доска
                </div>
            </div>
        </div>;
    }
}

module.exports = Tabs;