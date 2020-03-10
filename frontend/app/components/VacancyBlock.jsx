let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class VacancyBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: props.filter,
            isOpening: false
        };

        this.onClickView = this.onClickView.bind(this);
        this.openDescription = this.openDescription.bind(this);
        this.removeVacancy = this.removeVacancy.bind(this);
        this.handleChooseStatus = this.handleChooseStatus.bind(this);
    }

    onClickView() {
        this.setState({isOpening: true});
    }

    changeStatus(vacancy, userId) {
        fetch(`/api/vacancy-status?userId=${userId}`,
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

    async openDescription() {
        $('.dropdown-content').removeClass('open');
        $('.dropbtn').removeClass('open');

        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        if(!positions[this.props.index].IsViewed || positions[this.props.index].IsViewed === 0) {
            let vacancy = positions[this.props.index];
            vacancy.IsViewed = 1;

            this.props.changeVacancy(vacancy);

            this.changeStatus(vacancy, this.props.store.user.ClientId);
        }

        let description = document.getElementById(positions[this.props.index].Url + this.state.filter);
        description.classList.toggle('description-hide');
    }

    async removeVacancy(e) {
        VacancyBlock.stopPropagation();

        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            vacancy = positions[this.props.index];

        if (!positions[this.props.index].IsRemoved || positions[this.props.index].IsRemoved === 0) {
            vacancy.IsRemoved = 1;
        } else vacancy.IsRemoved = 0;

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy, this.props.store.user.ClientId);
    }

    static handleStatusList(e) {
        e.target.classList.toggle('open');
        $(e.target).next().toggleClass('open');
        e.stopPropagation();
    }

    handleChooseStatus(e) {
        $('.dropdown-content').removeClass('open');
        $('.dropbtn').removeClass('open');

        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            vacancy = positions[this.props.index];

        switch(e.target.innerText) {
            case 'new':
                vacancy.BoardStatus = 'new';
                break;
            case 'in the process':
                vacancy.BoardStatus = 'in the process';
                break;
            case 'completed':
                vacancy.BoardStatus = 'completed';
                break;
            case 'deferred':
                vacancy.BoardStatus = 'deferred';
                break;
        }

        if(this.props.store.boardVacancies.filter((e) => e.VacancyId === vacancy.VacancyId).length === 0)
            this.props.addVacancy(this.props.store.boardVacancies.concat(vacancy), 'board');

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy, this.props.store.user.ClientId);

        e.stopPropagation();
    }

    render() {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        return <div className={positions[this.props.index].IsRemoved == 1 ? 'hide' : ''}>
            <div className='vacancy-block' onClick={this.openDescription}>
                <div className='vacancy-status'>
                    <img src={positions[this.props.index].IsViewed == 1 ?
                        (positions[this.props.index].IsFavorite == 1 ? 'images/status-favorite.png' :
                            (positions[this.props.index].IsRemoved == 1 ? 'images/status-removed.png' :
                                'images/status-viewed.png')) :
                        (positions[this.props.index].IsFavorite == 1 ? 'images/status-favorite.png' :
                            'images/status-unviewed.png')}
                         title={positions[this.props.index].IsViewed == 1 ?
                             (positions[this.props.index].IsFavorite == 1 ? 'favorite' :
                                 (positions[this.props.index].IsRemoved == 1 ? 'removed' :
                                     'viewed')) :
                             (positions[this.props.index].IsFavorite == 1 ? 'favorite' : 'unviewed')}/>
                </div>
                <div className='vacancy-information'>
                    <span className='vacancy-name'>{positions[this.props.index].Position}</span> <br/>
                    <a href={positions[this.props.index].Website} target='_blank'
                       onClick={VacancyBlock.stopPropagation}>
                    <span className={positions[this.props.index].CompanyName ? 'company-name' : 'hide'}>
                        {positions[this.props.index].CompanyName}
                    </span>
                    </a>
                    <span className={positions[this.props.index].Country ? 'company-country' : 'hide'}>
                    {' / ' + positions[this.props.index].Country}
                </span>
                    <span className='tech-stack'>stack</span> <br/>
                    <span className={positions[this.props.index].Location ? 'location' : 'hide'}>
                    Location: {positions[this.props.index].Location}
                </span>
                    <span className={positions[this.props.index].Contacts ? 'contacts' : 'hide'}>
                    Contacts: {positions[this.props.index].Contacts}
                </span>
                </div>
                <div className='date'>
                    {positions[this.props.index].SiteAddingDate}
                </div>
                <div className='vacancy-actions'>
                    <a href={positions[this.props.index].Url} target='_blank'
                       onClick={(e) => e.stopPropagation()}>
                        <input type='button' value='View' title='view vacancy'/>
                    </a> <br/>
                    <div className='buttons'>
                        <div className="dropdown">
                            <button className="dropbtn" onClick={VacancyBlock.handleStatusList}/>
                            <div className="dropdown-content" onClick={this.handleChooseStatus}>
                                <span className='status-element'>new</span>
                                <span className='status-element'>in the process</span>
                                <span className='status-element'>completed</span>
                                <span className='status-element'>deferred</span>
                            </div>
                        </div>
                        <img id='remove' src='images/delete.png'
                             title='remove vacancy' onClick={this.removeVacancy}/>
                    </div>
                </div>
            </div>
            <div  id={positions[this.props.index].Url + this.state.filter} className='description description-hide'
                  dangerouslySetInnerHTML = {{__html:positions[this.props.index].Description}} />
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(VacancyBlock);