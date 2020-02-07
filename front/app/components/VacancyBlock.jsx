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

    async openDescription() {
        if(!this.state.vacancy.isViewed || this.state.vacancy.isViewed === 0) {
            await this.setState({vacancy: {...this.state.vacancy, isViewed: 1}});

            let vacancy = this.state.vacancy;

            fetch(`/api/vacancy-status`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
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

        let description = document.getElementById(this.state.vacancy.url);

        description.classList.toggle('description-hide');
    }

    async addToFavorite(e) {
        e.stopPropagation();

        if(!this.state.vacancy.isFavorite || this.state.vacancy.isFavorite == 0) {
            await this.setState({vacancy: {...this.state.vacancy, isFavorite: 1}});
        }
        else await this.setState({vacancy: {...this.state.vacancy, isFavorite: 0}});

        let vacancy = this.state.vacancy;

        fetch(`/api/vacancy-status`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(vacancy)
            })
            .then(
                function(response) {
                    if (response.status !== 200) {
                        console.log(`/api/vacancy-status` +
                            response.status);
                    }
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
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(vacancy)
            })
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log(`/api/vacancy-status` +
                            response.status);
                    }
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
        return <div className={this.state.vacancy.isRemoved == 1 ||
        (this.state.vacancy.isFavorite == 0 && this.props.filter === 'favorites') ? 'hide' : ''}>
            <div className='vacancy-block' onClick={this.openDescription}>
                <div className='vacancy-status'>
                    <img src={this.state.vacancy.isViewed == 1 ?
                        (this.state.vacancy.isFavorite == 1 ? 'images/status-favorite.png' :
                            (this.state.vacancy.isRemoved == 1 ? 'images/status-removed.png' :
                            'images/status-viewed.png')) :
                        (this.state.vacancy.isFavorite == 1 ? 'images/status-favorite.png' :
                            'images/status-unviewed.png')}
                    title={this.state.vacancy.isViewed == 1 ?
                        (this.state.vacancy.isFavorite == 1 ? 'favorite' :
                            (this.state.vacancy.isRemoved == 1 ? 'removed' :
                                'viewed')) :
                        (this.state.vacancy.isFavorite == 1 ? 'favorite' : 'unviewed')}/>
                </div>
                <div className='vacancy-information'>
                    <span className='vacancy-name'>{this.state.vacancy.position}</span> <br/>
                    <a href={this.state.vacancy.website} target='_blank' onClick={this.stopPropagation}>
                    <span className={this.state.vacancy.companyName ? 'company-name' : 'hide'}>
                        {this.state.vacancy.companyName}
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
                    {this.state.vacancy.siteAddingDate}
                </div>
                <div className='vacancy-actions'>
                    <a href={this.state.vacancy.url} target='_blank' onClick={this.stopPropagation}>
                        <input type='button' value='View' title='view vacancy'/>
                    </a> <br/>
                    <div className='buttons'>
                        <img id='add-to-favorites' src={this.state.vacancy.isFavorite ?
                            'images/add-favorites-active.png' : 'images/add-favorites.png'}
                             title={!this.state.vacancy.isFavorite || this.state.vacancy.isFavorite === 0 ?
                                 'add to favorites' : 'remove from favorites'}
                             className={this.state.vacancy.isFavorite === 1 ? 'add-to-favorites-active' : ''}
                             onClick={this.addToFavorite}/>
                        <img id='remove' src='images/delete.png'
                             title='remove vacancy' onClick={this.removeVacancy}/>
                    </div>
                </div>
            </div>
            <div  id={this.state.vacancy.url} className='description description-hide'
                  dangerouslySetInnerHTML = {{__html: this.state.vacancy.description}} />
        </div>;
    }
}

module.exports = VacancyBlock;