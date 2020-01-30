let React = require('react');
let VacancyBlock = require('./VacancyBlock.jsx');

class VacancyList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: [],
            newVacanciesCount: 0,
            nextCount: 10,
            filter: 'all'
        };

        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);
        this.getVacanciesByFilter = this.getVacanciesByFilter.bind(this);

        this.showNextVacancies();
        this.getNewVacanciesCount(this);

        console.log(this.state);
    }

    getNextCount(context) {
        let vacanciesCount = context.state.positions.length;
        //let vacanciesCount = context.state.positions.filter(position => position.isRemoved === 0).length;
        //console.log('vacanciesCount : ' + vacanciesCount);

        fetch(`/api/vacancies/next?count=${vacanciesCount}&filter=${context.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: /api/vacancies/next?count=${vacanciesCount} : ` +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        data[0].count <= 10 ? context.setState({nextCount: data[0].count}) :
                            context.setState({nextCount: 10});
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    showNewVacancies() {
        let context = this;

        fetch(`api/vacancies/new?filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log('ERR: /api/vacancies/new : ' +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        data.forEach(function(item) {
                            console.log(this);
                            console.log(context);
                            context.setState({positions: [item, ...context.state.positions], newVacanciesCount: 0});
                        });

                        window.scrollTo(0, 0);
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    showNextVacancies() {
        let context = this,
            vacanciesCount = context.state.positions.length;

        fetch(`/api/vacancies?site=${vacanciesCount/10+1}&count=${this.state.nextCount}&filter=${this.state.filter}`)
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`ERR: /api/vacancies?site=${vacanciesCount/10+1}&count=${this.state.nextCount} : ` +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        data.forEach(function(item) {
                            context.setState({positions: [...context.state.positions, item]});
                        });

                        context.getNextCount(context);
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    getNewVacanciesCount(context) {
        let timerId = setTimeout(function request() {
            fetch(  `/api/vacancies/new/count?filter=${context.state.filter}`)
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

    async getVacanciesByFilter(e) {
        if (e.target.id === 'filter-all' && !e.target.classList.contains('active')) {
            $('.filter-button').removeClass('active');
            e.target.classList.add('active');

            await this.setState({positions: [], filter: 'all'});
            this.showNextVacancies();
        }
        else if(e.target.id === 'filter-unviewed' && !e.target.classList.contains('active')) {
            $('.filter-button').removeClass('active');
            e.target.classList.add('active');

            await this.setState({positions: [], filter: 'unviewed'});
            this.showNextVacancies();
        }
        else if(e.target.id === 'filter-favorites' && !e.target.classList.contains('active')) {
            $('.filter-button').removeClass('active');
            e.target.classList.add('active');

            await this.setState({positions: [], filter: 'favorites'});
            this.showNextVacancies();
        }
    }

    render() {
        return <div className="vacancy-list">
            <div className='system-name'>
                CRM system
            </div>
            <div className='filters'>
                <img id='filter-all' className='filter-button active' alt='all vacancies'
                     src='images/all-records.png' title='all vacancies' onClick={this.getVacanciesByFilter}/>
                <img id='filter-unviewed' className='filter-button'  alt='unviewed only'
                     src='images/unviewed-records.png' title='unviewed vacancies only'
                     onClick={this.getVacanciesByFilter}/>
                <img id='filter-favorites' className='filter-button'  alt='favorites'
                     src='images/favorites.png'  title='favorites' onClick={this.getVacanciesByFilter}/>
            </div>
            {
                this.state.positions && this.state.positions.map(function(vacancy){
                    return <VacancyBlock position={vacancy} />
                })
            }
            <div id="show-new-vacancies-block" className={this.state.newVacanciesCount > 0 ? "" : "hide"}>
                <input type="button" className={this.state.newVacanciesCount > 0 ? "" : "hide"}
                       value={"show " + this.state.newVacanciesCount + " new vacancies"}
                       onClick={this.showNewVacancies} />
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