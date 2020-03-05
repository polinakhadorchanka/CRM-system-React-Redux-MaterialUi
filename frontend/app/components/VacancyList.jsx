let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyBlock = require('./VacancyBlock.jsx');

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
            newVacanciesCount: 0,
            nextCount: 0,
            filter: props.filter
        };

        this.changeStore = this.changeStore.bind(this);
        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);
        this.getNextCount = this.getNextCount.bind(this);

        if(this.state.filter === 'all') this.getNewVacanciesCount(this);
    }

    async getNextCount() {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            context = this,
            id = positions[positions.length-1] ?
                positions[positions.length-1].vacancyId : undefined;

        await fetch(`/api/vacancies/next?id=${id}&filter=${context.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`ERR: getNextCount : ` + response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        data[0].count <= 10 ? context.setState({nextCount: data[0].count}) :
                            context.setState({nextCount: 10});
                    });
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    async showNextVacancies() {
        let context = this,
            positions = context.state.filter === 'all' ? context.props.store.allVacancies
            : context.props.store.unviewedVacancies,
            id = positions[positions.length-1] ?
                positions[positions.length-1].vacancyId : undefined;

        console.log(`/api/vacancies?id=${id}&` +
            `count=${this.state.nextCount}&filter=${this.state.filter}`);
        await fetch(`/api/vacancies?id=${id}&` +
            `count=${this.state.nextCount}&filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: showNextVacancies : ` + response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        context.changeStore('ADD_VACANCY', positions.concat(data));
                    }).then(function () {
                        context.getNextCount();
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    async getNewVacanciesCount(context) {
        let timerId = await setTimeout(function request() {
            let positions = context.state.filter === 'all' ? context.props.store.allVacancies
                : context.props.store.unviewedVacancies,
                id = positions[0] ? positions[0].vacancyId : undefined;

            console.log(`/api/vacancies/new/count?id=${id}&filter=${context.state.filter}`);
            fetch(  `/api/vacancies/new/count?id=${id}&filter=${context.state.filter}`)
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            console.log('ERR: /api/vacancies/new/count : ' +
                                response.status);
                            return;
                        }

                        response.json().then(function(data) {
                            context.setState({newVacanciesCount: data[0].count});

                            console.log(context.state.newVacanciesCount);

                            context.getNewVacanciesCount(context);
                        });
                    }
                )
                .catch(function(err) {
                    console.log('EXP: ', err);
                });
        }, 30000);
    }

    async showNewVacancies() {
        let context = this,
            positions = context.state.filter === 'all' ? context.props.store.allVacancies
            : context.props.store.unviewedVacancies,
            id = positions[0] ? positions[0].vacancyId : undefined;

        console.log(`api/vacancies/new?id=${id}filter=${this.state.filter}`);
        await fetch(`api/vacancies/new?id=${id}filter=${this.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('ERR: /api/vacancies/new : ' +
                            response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        console.log(data);
                        context.changeStore('ADD_VACANCY', data.concat(positions));

                        context.setState({newVacanciesCount: 0});

                        document.getElementById('show-new-vacancies-block').classList.toggle(
                            'show-new-vacancies-block-hide');
                        window.scrollTo(0, 0);
                    });
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    changeStore(type, data) {
        switch(type) {
            case 'ADD_VACANCY': this.props.addVacancy(data, this.state.filter); break;
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let positions = prevState.filter === 'all' ? prevProps.store.allVacancies : prevProps.store.unviewedVacancies;
        if(prevState.isLoad === false && positions.length > 0) {
            this.setState({isLoad: true});
            this.getNextCount();
        }
    }

    render() {
        let filter = this.state.filter,
        positions = this.state.filter === 'all' ? this.props.store.allVacancies : this.props.store.unviewedVacancies;

        return <div className="vacancy-list">
            {
                positions.map(function(vacancy, index){
                    return <VacancyBlock position={vacancy} filter={filter} index={index}/>
                })
            }
            <div id="show-new-vacancies-block" className={this.state.newVacanciesCount === 0 ?
                'show-new-vacancies-block-hide' : ''}
                 onClick={this.showNewVacancies}>
                {"show " + this.state.newVacanciesCount + " new vacancies"}
            </div>
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

module.exports = connect(mapStateToProps, actions)(VacancyList);