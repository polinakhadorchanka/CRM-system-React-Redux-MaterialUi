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

    changeStatus(vacancy) {
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

    async openDescription() {
        $('.dropdown-content').removeClass('open');
        $('.dropbtn').removeClass('open');

        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        if(!positions[this.props.index].isViewed || positions[this.props.index].isViewed === 0) {
            let vacancy = positions[this.props.index];
            vacancy.isViewed = 1;

            this.props.changeVacancy(vacancy);

            this.changeStatus(vacancy);
        }

        let description = document.getElementById(positions[this.props.index].url + this.state.filter);
        description.classList.toggle('description-hide');
    }

    async removeVacancy(e) {
        VacancyBlock.stopPropagation();

        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies,
            vacancy = positions[this.props.index];

        if (!positions[this.props.index].isRemoved || positions[this.props.index].isRemoved === 0) {
            vacancy.isRemoved = 1;
        } else vacancy.isRemoved = 0;

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy);
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
                vacancy.boardStatus = 'new';
                break;
            case 'in the process':
                vacancy.boardStatus = 'in the process';
                break;
            case 'completed':
                vacancy.boardStatus = 'completed';
                break;
            case 'deferred':
                vacancy.boardStatus = 'deferred';
                break;
        }

        if(this.props.store.boardVacancies.filter((e) => e.vacancyId === vacancy.vacancyId).length === 0)
            this.props.addVacancy(this.props.store.boardVacancies.concat(vacancy), 'board');

        this.props.changeVacancy(vacancy);

        this.changeStatus(vacancy);

        e.stopPropagation();
    }

    render() {
        let positions = this.state.filter === 'all' ? this.props.store.allVacancies
            : this.props.store.unviewedVacancies;

        return <div className={positions[this.props.index].isRemoved == 1 ||
        (positions[this.props.index].isFavorite == 0 && this.props.filter === 'favorites') ? 'hide' : ''}>
            <div className='vacancy-block' onClick={this.openDescription}>
                <div className='vacancy-status'>
                    <img src={positions[this.props.index].isViewed == 1 ?
                        (positions[this.props.index].isFavorite == 1 ? 'images/status-favorite.png' :
                            (positions[this.props.index].isRemoved == 1 ? 'images/status-removed.png' :
                                'images/status-viewed.png')) :
                        (positions[this.props.index].isFavorite == 1 ? 'images/status-favorite.png' :
                            'images/status-unviewed.png')}
                         title={positions[this.props.index].isViewed == 1 ?
                             (positions[this.props.index].isFavorite == 1 ? 'favorite' :
                                 (positions[this.props.index].isRemoved == 1 ? 'removed' :
                                     'viewed')) :
                             (positions[this.props.index].isFavorite == 1 ? 'favorite' : 'unviewed')}/>
                </div>
                <div className='vacancy-information'>
                    <span className='vacancy-name'>{positions[this.props.index].position}</span> <br/>
                    <a href={positions[this.props.index].website} target='_blank'
                       onClick={VacancyBlock.stopPropagation}>
                    <span className={positions[this.props.index].companyName ? 'company-name' : 'hide'}>
                        {positions[this.props.index].companyName}
                    </span>
                    </a>
                    <span className={positions[this.props.index].country ? 'company-country' : 'hide'}>
                    {' / ' + positions[this.props.index].country}
                </span>
                    <span className='tech-stack'>stack</span> <br/>
                    <span className={positions[this.props.index].location ? 'location' : 'hide'}>
                    Location: {positions[this.props.index].location}
                </span>
                    <span className={positions[this.props.index].contacts ? 'contacts' : 'hide'}>
                    Contacts: {positions[this.props.index].contacts}
                </span>
                </div>
                <div className='date'>
                    {positions[this.props.index].siteAddingDate}
                </div>
                <div className='vacancy-actions'>
                    <a href={positions[this.props.index].url} target='_blank'
                       onClick={(e) => e.stopPropagation()}>
                        <input type='button' value='View' title='view vacancy'/>
                    </a> <br/>
                    <div className='buttons'>
                        <div className="dropdown">
                            <button className="dropbtn" onClick={VacancyBlock.handleStatusList}/>
                            <div className="dropdown-content" onClick={this.handleChooseStatus}>
                                <a href='#'>new</a>
                                <a href='#'>in the process</a>
                                <a href='#'>completed</a>
                                <a href='#'>deferred</a>
                            </div>
                        </div>
                        <img id='remove' src='images/delete.png'
                             title='remove vacancy' onClick={this.removeVacancy}/>
                    </div>
                </div>
            </div>
            <div  id={positions[this.props.index].url + this.state.filter} className='description description-hide'
                  dangerouslySetInnerHTML = {{__html:positions[this.props.index].description}} />
        </div>;
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(VacancyBlock);