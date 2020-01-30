let React = require('react');

class VacancyBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vacancy: props.position,
            isOpening: false
        };

        this.onClickView = this.onClickView.bind(this);
        this.openDescription = this.openDescription.bind(this);
        this.addToFavorite = this.addToFavorite.bind(this);
        this.removeVacancy = this.removeVacancy.bind(this);
    }

    onClickView() {
        this.setState({isOpening: true});
    }

    openDescription() {
        let description = document.getElementById(this.state.vacancy.url);

        if(description.classList.contains('hide'))
            description.classList.remove('hide');
        else description.classList.add('hide');
    }

    async addToFavorite(e) {
        e.stopPropagation();

        if(!this.state.vacancy.isFavorite || this.state.vacancy.isFavorite === 0) {
            await this.setState({vacancy: {...this.state.vacancy, isFavorite: 1}});
        }
        else await this.setState({vacancy: {...this.state.vacancy, isFavorite: 0}});

        let vacancy = this.state.vacancy;

        fetch(`/api/vacancy-status`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(vacancy)
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`/api/vacancy-status` +
                            response.status);
                        return;
                    }

                    response.json().then(function(data) {
                        console.log(data.message);
                    });
                }
            )
            .catch(function(err) {
                console.log('EXP: ', err);
            });
    }

    async removeVacancy(e) {
        e.stopPropagation();

        if (!this.state.vacancy.isRemoved || this.state.vacancy.isRemoved === 0) {
            await this.setState({vacancy: {...this.state.vacancy, isRemoved: 1}});
        } else await this.setState({vacancy: {...this.state.vacancy, isRemoved: 0}});

        let vacancy = this.state.vacancy;

        fetch(`/api/vacancy-status`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(vacancy)
            })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`/api/vacancy-status` +
                            response.status);
                        return;
                    }

                    response.json().then(function (data) {
                        console.log(data.message);
                    });
                }
            )
            .catch(function (err) {
                console.log('EXP: ', err);
            });
    }

    stopPropagation(e) {
        console.log(e);
        e.stopPropagation();
    }

    render() {
        return <div className={this.state.vacancy.isRemoved === 1 ? 'hide' : ''}>
            <div className='vacancy-block' onClick={this.openDescription}>
                <div className='vacancy-status'>
                    <img />
                </div>
                <div className='vacancy-information'>
                    <span className='vacancy-name'>{this.state.vacancy.position}</span> <br/>
                    <a href={this.state.vacancy.Website} target='_blank' onClick={this.stopPropagation}>
                    <span className={this.state.vacancy.company_name ? 'company-name' : 'hide'}>
                        {this.state.vacancy.company_name}
                    </span>
                    </a>
                    <span className={this.state.vacancy.country ? 'company-country' : 'hide'}>
                    {' / ' + this.state.vacancy.country}
                </span>
                    <span className='tech-stack'>stack</span> <br/>
                    <span className={this.state.vacancy.location ? 'location' : 'hide'}>
                    Location: {this.state.vacancy.location}
                </span>
                    <span className={this.state.vacancy.contacts ? 'contacts' : 'hide'}>
                    Contacts: {this.state.vacancy.contacts}
                </span>
                </div>
                <div className='date'>
                    {this.state.vacancy.SiteAddingDate}
                </div>
                <div className='vacancy-actions'>
                    <a href={this.state.vacancy.url} target='_blank' onClick={this.stopPropagation}>
                        <input type='button' value='View' title='view vacancy'/>
                    </a> <br/>
                    <div className='buttons'>
                        <img id='add-to-favorites' src='images/add-favorites.png'
                             title='add to favorites'
                             className={this.state.vacancy.isFavorite === 1 ? 'add-to-favorites-active' : ''}
                             onClick={this.addToFavorite}/>
                        <img id='remove' src='images/delete.png'
                             title='remove vacancy' onClick={this.removeVacancy}/>
                    </div>
                </div>
            </div>
            <div  id={this.state.vacancy.url} className='description hide'
                  dangerouslySetInnerHTML = {{__html: this.state.vacancy.Description}} />
        </div>;


        {/*<div className={this.state.isOpening ? "vacancy-block open-block" : "vacancy-block"}>*/}
        {/*    <div className="my-row">*/}
        {/*        <div>*/}
        {/*            <span className="position">{this.props.position.position}</span> <br/>*/}
        {/*        </div>*/}
        {/*        <div>*/}
        {/*            <a href={this.props.position.url} target="_blank">*/}
        {/*                <input type="button" className="button" value="View" onClick={this.onClickView}/>*/}
        {/*            </a>*/}
        {/*        </div>*/}
        {/*    </div>*/}

        {/*    <span className="company-name">*/}
        {/*        <a href={this.props.position.Website} target="_blank">*/}
        {/*        {this.props.position.company_name ? this.props.position.company_name : undefined}*/}
        {/*        </a>*/}
        {/*        {this.props.position.country ? ' / ' + this.props.position.country : undefined}*/}
        {/*    </span>*/}

        {/*    <span className="date">{this.props.position.SiteAddingDate}</span>*/}
        {/*    <span className={this.props.position.location ? "company-name" : ""}>*/}
        {/*        {this.props.position.location ? 'Location: ' + this.props.position.location : undefined}*/}
        {/*    </span>*/}
        {/*    <span className="company-name">Stack</span>*/}
        {/*</div>;*/}
    }
}

module.exports = VacancyBlock;