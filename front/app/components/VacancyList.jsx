let React = require('react');
let VacancyBlock = require('./VacancyBlock.jsx');

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: [],
            newVacanciesCount: 0,
            nextCount: 0,
            filter: props.filter
        };

        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);

        this.showNextVacancies(true);
        this.getNewVacanciesCount(this);
    }

    async getNextCount(context) {
        console.log('qq');
        console.log(context);
        console.log(context.state.positions[length-1]);

        let vacanciesCount = context.state.positions.length,
            id = context.state.positions[length-1] ? context.state.positions[length-1].vacancyId : undefined;

        await fetch(`/api/vacancies/next?id=${id}&filter=${context.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`ERR: /api/vacancies/next?count=${vacanciesCount} : ` +
                            response.status);
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

    async showNewVacancies() {
        let context = this,
            id = context.state.positions[0] ? context.state.positions[length-1].vacancyId : undefined;

        await fetch(`api/vacancies/new?id=${id}filter=${this.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('ERR: /api/vacancies/new : ' +
                            response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        data.forEach(function (item) {
                            context.setState({positions: [...context.state.positions, item]});
                        });

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

    async showNextVacancies(empty) {
        let context = this,
            id = context.state.positions[length-1] ? context.state.positions[length-1].vacancyId : undefined;

        console.log(id);

        await fetch(`/api/vacancies?id=${id}&` +
            `count=${empty ? 10 : this.state.nextCount}&filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: /api/vacancies?site=${vacanciesCount/10+1}&count=${this.state.nextCount} : ` +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        if(empty === true) {
                            context.setState({positions: data});
                        }
                        else {
                            data.forEach(function (item) {
                                context.setState({positions: [...context.state.positions, item]});
                            });
                        }
                        console.log(context.state);
                    }).then(function () {
                        context.getNextCount(context);
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    async getNewVacanciesCount(context) {
        let id = context.state.positions[0] ? context.state.positions[length-1].vacancyId : undefined;

        let timerId = await setTimeout(function request() {
            fetch(  `/api/vacancies/new/?id=${id}&filter=${context.state.filter}`)
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

    static getDerivedStateFromProps(props, state) {
        if (props.filter !== state.filter) {
            return {
                ...state,
                nextCount: 0,
                positions: [],
                filter: props.filter
            }
        }
    }

    render() {
        let filter = this.state.filter;

        return <div className="vacancy-list">
            {
                this.state.positions && this.state.positions.map(function(vacancy){
                    return <VacancyBlock position={vacancy} filter={filter} />
                })
            }
            <div id="show-new-vacancies-block" className={this.state.newVacanciesCount=== 0 ? 'show-new-vacancies-block-hide' : ''}
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

module.exports = VacancyList;

/*
async getNextCount(context) {
        let vacanciesCount = context.state.positions.length,
            id = context.state.positions[length-1] ? context.state.positions[length-1].vacancyId : undefined;

        await fetch(`/api/vacancies/next?id=${id}&filter=${context.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`ERR: /api/vacancies/next?count=${vacanciesCount} : ` +
                            response.status);
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

    async showNewVacancies() {
        let context = this,
            id = context.state.positions[0] ? context.state.positions[length-1].vacancyId : undefined;

        await fetch(`api/vacancies/new?id=${id}filter=${this.state.filter}`)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('ERR: /api/vacancies/new : ' +
                            response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        data.forEach(function (item) {
                            context.setState({positions: [...context.state.positions, item]});
                        });

                        context.setState({newVacanciesCount: 0});
                        //window.scrollTo(0, 0);
                    });
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    async showNextVacancies(empty) {
        let context = this,
            id = context.state.positions[length-1] ? context.state.positions[length-1].vacancyId : undefined;

        console.log(id);

        await fetch(`/api/vacancies?id=${id}&` +
            `count=${empty ? 10 : this.state.nextCount}&filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: showNextVacancies : ` + response.status);
                        return;
                    }

                    response.json().then(function(data) {
                            data.forEach(function (item) {
                                context.setState({positions: [...context.state.positions, item]});
                            });

                        context.getNextCount(context);
                        console.log(context.state);
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    async getNewVacanciesCount(context) {
        let id = context.state.positions[0] ? context.state.positions[length-1].vacancyId : undefined;

        let timerId = await setTimeout(function request() {
             fetch(  `/api/vacancies/new/?id=${id}&filter=${context.state.filter}`)
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
 */