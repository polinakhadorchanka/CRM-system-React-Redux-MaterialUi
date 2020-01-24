let React = require('react');
let VacancyBlock = require('./VacancyBlock.jsx');

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: this.props.vacancies,
            newVacanciesCount: 0,
            nextCount: 10
        };

        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);

        this.getNewVacanciesCount(this);
        this.getNextCount(this);
    }

    getNextCount(context) {
        let vacanciesCount = context.state.positions.length;
        console.log('getnext');
        console.log(`/api/vacancies/next?count=${vacanciesCount}`);
        fetch(`/api/vacancies/next?count=${vacanciesCount}`)
            .then((response) => response.json())
            .then((response) => {
                response[0].count <= 10 ? context.setState({nextCount: response[0].count}) :
                    context.setState({nextCount: 10});
            });
    }

    showNewVacancies() {
        let context = this;

        fetch("/api/vacancies/new")
            .then((response) => response.json())
            .then((response) => {
                response.forEach(function(item, i, arr) {
                    console.log(this);
                    console.log(context);
                    context.setState({positions: [item, ...context.state.positions], newVacanciesCount: 0});
                });

                window.scrollTo(0, 0);
            });
    }

    showNextVacancies() {
        let context = this,
            vacanciesCount = context.state.positions.length;
        console.log(`/api/vacancies?site=${vacanciesCount/10+1}&count=${this.state.nextCount}`);

        fetch(`/api/vacancies?site=${vacanciesCount/10+1}&count=${this.state.nextCount}`)
            .then((response) => response.json())
            .then((response) => {
                response.forEach(function(item, i, arr) {
                    context.setState({positions: [...context.state.positions, item]});
                });
            });

        this.getNextCount(this);
    }

    getNewVacanciesCount(context) {
        let delay = 30000;

        let timerId = setTimeout(function request() {

            fetch('/api/vacancies/new/count')
                .then((response) => response.json())
                .then((response) => {
                    context.setState({newVacanciesCount: response[0].count});
                    console.log(context.state.newVacanciesCount);
                });

            timerId = setTimeout(request, delay);

        }, delay);
    }

    render() {
        return <div className="vacancy-list">
            {
                this.state.positions && this.state.positions.map(function(vacancy){
                    return <VacancyBlock position={vacancy} />
                })
            }
            <div id="bottom-block" className={this.state.newVacanciesCount > 0 ? "animate" : "hide"}>
                <input type="button" className={this.state.newVacanciesCount > 0 ? "" : "hide"}
                       value={"show " + this.state.newVacanciesCount + " new vacancies"}
                       onClick={this.showNewVacancies} />
            </div>
            <div id="show-new-vacancies-block"
                 className={this.state.nextCount === 0 ? "hide" : ""}
                 onClick={this.showNextVacancies}>
                &darr; show next {this.state.nextCount} vacancies &darr;
            </div>
        </div>;
    }
}

module.exports = VacancyList;