let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

let VacancyBlock = require('./VacancyBlock.jsx');

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoad: false,
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
                positions[positions.length-1].VacancyId : undefined,
            userId = this.props.store.user.ClientId;

        await fetch(`/api/vacancies/next?userId=${userId}&id=${id}&filter=${context.state.filter}`)
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
                positions[positions.length-1].VacancyId : undefined,
            userId = this.props.store.user.ClientId;

        await fetch(`/api/vacancies?userId=${userId}&id=${id}&` +
            `count=${this.state.nextCount}&filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: showNextVacancies : ` + response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        context.changeStore('ADD_VACANCY', positions.concat(data), context.state.filter);
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
                id = positions[0] ? positions[0].VacancyId : undefined,
                userId = context.props.store.user.ClientId;

            console.log(`/api/vacancies/new/count?userId=${userId}&id=${id}&filter=${context.state.filter}`);
            fetch(  `/api/vacancies/new/count?userId=${userId}&id=${id}&filter=${context.state.filter}`)
                .then(
                    function(response) {
                        if (response.status !== 200) {
                            console.log('ERR: /api/vacancies/new/count : ' +
                                response.status);
                            return;
                        }

                        response.json().then(function(data) {
                            context.changeStore('CHANGE_COUNT', data[0].count);
                            context.getNewVacanciesCount(context);
                        });
                    }
                )
                .catch(function(err) {
                    console.log('EXP: ', err);
                });
        }, 30000);
    }

    async showNewVacancies(e) {
        let context = this,
            allPositions = context.props.store.allVacancies,
            unviewedPositions = context.props.store.unviewedVacancies,
            id = allPositions[0] ? allPositions[0].VacancyId : undefined,
            userId = this.props.store.user.ClientId;

        $('.description').addClass('description-hide');

        console.log(`api/vacancies/new?userId=${userId}&id=${id}&filter=${this.state.filter}`);
        await fetch(`api/vacancies/new?userId=${userId}&id=${id}&filter=${this.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('ERR: /api/vacancies/new : ' +
                            response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        context.changeStore('CHANGE_COUNT', 0);
                        context.changeStore('ADD_VACANCY', data.concat(allPositions), 'all');
                        context.changeStore('ADD_VACANCY', data.concat(unviewedPositions), 'unviewed');

                        window.scrollTo(0, 0);
                    });
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    changeStore(type, data, filter) {
        switch(type) {
            case 'ADD_VACANCY': this.props.addVacancy(data, filter); break;
            case 'CHANGE_COUNT': this.props.changeNewVacanciesCount(data); break;
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
            <div id="show-new-vacancies-block" className={this.props.store.newVacanciesCount === 0 ?
                'show-new-vacancies-block-hide' : ''}
                 onClick={this.showNewVacancies}>
                {"show " + this.props.store.newVacanciesCount + " new vacancies"}
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