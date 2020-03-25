import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

class KanbanBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            isLoading: true,
            projects: [],
            draggedOverCol: 0,
        });


        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragEnd = this.handleOnDragEnd.bind(this);
        this.deleteCard = this.deleteCard.bind(this);
        this.handleOnOpenDescription = this.handleOnOpenDescription.bind(this);
        this.changeVacancy = this.changeVacancy.bind(this);

        this.columns = [
            {name: 'new', stage: 1},
            {name: 'in the process', stage: 2},
            {name: 'completed', stage: 3},
            {name: 'deferred', stage: 4},
        ];
    }

    componentDidMount() {
        this.setState({ projects: this.props.store.boardVacancies, isLoading: false });
    }

    changeVacancy(project) {
        this.props.changeVacancy(project);
        let userId = this.props.store.user.ClientId;
        fetch(`/api/vacancy-status?userId=${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(project)
            }).catch(function (err) {
            console.log('EXP: ', err);
        });
    }

    deleteCard(e, project) {
        let vacancies = this.props.store.boardVacancies.filter((el) => el.VacancyId !== project.VacancyId),
            userId = this.props.store.user.ClientId;
        this.props.addVacancy(vacancies, 'board');
        this.props.changeVacancy(project);

        project.BoardStatus = null;
        fetch(`/api/vacancy-status?userId=${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(project)
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

        e.stopPropagation();
    }

    handleOnOpenDescription(project) {
        if(project.IsViewed != true) {
            project.IsViewed = true;
            this.props.changeVacancy(project);

            let userId = this.props.store.user.ClientId;

            fetch(`/api/vacancy-status?userId=${userId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(project)
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
    }

    //this is called when a Kanban card is dragged over a column (called by column)
    handleOnDragEnter(e, stageValue) {
        this.setState({ draggedOverCol: stageValue });
    }

    //this is called when a Kanban card dropped over a column (called by card)
    handleOnDragEnd(e, project) {
        const updatedProjects = this.props.store.boardVacancies.slice(0);
        updatedProjects.find((projectObject) => {return projectObject.VacancyId === project.VacancyId;}).BoardStatus = this.state.draggedOverCol;
        this.props.addVacancy(updatedProjects, 'board');

        let userId = this.props.store.user.ClientId;

        fetch(`/api/vacancy-status?userId=${userId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(project)
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

    render() {
        if (this.state.isLoading) {
            return (<div className='boardContainer'><h3>Loading...</h3></div>);
        }

        return  (
            <div className='boardContainer'>
                {this.columns.map((column) => {
                    return (
                        <KanbanColumn
                            name={ column.name }
                            stage={ column.stage }
                            projects={ this.props.store.boardVacancies.filter((project) => {return project.BoardStatus === column.name;}) }
                            onDragEnter={ this.handleOnDragEnter }
                            onDragEnd={ this.handleOnDragEnd }
                            deleteCard = { this.deleteCard }
                            changeVacancy = { this.changeVacancy }
                            handleOnOpenDescription = { this.handleOnOpenDescription }
                            key={ column.stage }
                        />
                    );
                })}
            </div>
        );
    }
}

class KanbanColumn extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({ mouseIsHovering: false });
    }

    componentWillReceiveProps(nextProps) {
        this.state = ({ mouseIsHovering: false });
    }

    generateKanbanCards() {
        return this.props.projects.slice(0).map((project) => {
            return (
                <KanbanCard
                    project={project}
                    key={project.vacancyId}
                    onDragEnd={this.props.onDragEnd}
                    deleteCard = { this.props.deleteCard }
                    handleOnOpenDescription = { this.props.handleOnOpenDescription }
                    changeVacancy = { this.props.changeVacancy }
                />
            );
        });
    }

    render() {
        return  (
            <div className='boardColumn'
                 onDragEnter={(e) => {this.setState({ mouseIsHovering: true }); this.props.onDragEnter(e, this.props.name);}}
                 onDragExit={(e) => {this.setState({ mouseIsHovering: false });}}>
                <h4>{this.props.name} ({this.props.projects.length})</h4>
                {this.generateKanbanCards()}
            </div>);
    }
}

class KanbanCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            isDescriptionOpen: false,
            commentState: 'text',
            comment: props.project.Comment !== null ? props.project.Comment : ''
        };

        this.onHandleEditComment = this.onHandleEditComment.bind(this);
        this.changeComment = this.changeComment.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
    }

    handleDescription(e) {
        if(this.props.project.isViewed != 1) {
            this.props.handleOnOpenDescription(this.props.project);
        }

        this.setState(function(prevState) {
            return {
                isDescriptionOpen: prevState.isDescriptionOpen !== true
            };
        });
        e.stopPropagation();
    }

    changeComment(e) {
        this.setState({comment : e.target.value});
    }

    onHandleEditComment(e) {
        if(e.type === 'click')
            this.setState({commentState : 'input'});
        else if(e.type === 'blur') {
            this.setState({commentState : 'text'});
            let vacancy = this.props.project;
            vacancy.Comment = this.state.comment;
            this.props.changeVacancy(vacancy);
        }
    }

    vacancyDescription(vacancy) {
        return (
            <div className='card-description'>
                <div className={this.state.isDescriptionOpen === true ? 'back-vacancy-information' :
                    ' back-vacancy-information hide'}> </div>
                <div className={this.state.isDescriptionOpen === true ? 'vacancy-information' :
                    'vacancy-information hide'}
                     onClick={this.handleDescription}>
                    <div className='vacancy-block' onClick={(e) => e.stopPropagation()}>
                        <div className='flex-block'>
                            <div>
                                <span className='vacancy-name'>{vacancy.Position}</span> <br/>
                                <a href={vacancy.Website} target='_blank'>
                            <span className={vacancy.CompanyName ? 'company-name' : 'hide'}>
                                {vacancy.CompanyName}
                            </span>
                                </a>
                                <span className={vacancy.Country ? 'company-country' : 'hide'}>
                                {' / ' + vacancy.Country}
                            </span> <br/>
                                <span className={vacancy.Location ? 'location' : 'hide'}>
                                Location: {vacancy.Location}
                            </span>
                                <span className={vacancy.Contacts ? 'contacts' : 'hide'}>
                                Contacts: {vacancy.Contacts}
                            </span>
                            </div>
                            <div>
                                <a href={vacancy.Url} target='_blank'
                                   onClick={(e) => e.stopPropagation()}>
                                    <input type='button' value='View' title='view vacancy'/>
                                </a>
                                <div className='date'>
                                    {vacancy.SiteAddingDate}
                                </div>
                            </div>
                        </div>
                        <div  id={vacancy.Url + 'board'} className='description'
                              dangerouslySetInnerHTML = {{__html:vacancy.Description}} />
                        <span className='comment'>
                            Comments:
                        </span>
                        <div className='user-comment'
                             title={ this.state.commentState === 'text' ? 'Click to change' : undefined}
                             onClick={this.state.commentState === 'text' ? this.onHandleEditComment : undefined}>
                            {this.state.commentState === 'text' ?
                                <div>
                                    {this.state.comment !== '' ? this.state.comment : 'Click to change'}
                                </div> :
                                <input autoFocus={true}
                                       onFocus={(e) => e.target.select()}
                                       onBlur={this.onHandleEditComment} onChange={this.changeComment}
                                       type='text' value={this.state.comment} maxLength='300' />}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div>
                <div className='boardCard'
                     draggable={true}
                     onDragEnd={(e) => {this.props.onDragEnd(e, this.props.project);}}
                     onClick={this.handleDescription}>
                    <div className='container'>
                        <div>
                            <span className='vacancy-name'>{this.props.project.Position}</span> <br/>
                            <span className={this.props.project.CompanyName ? 'company-name' : 'hide'}>
                    {this.props.project.CompanyName}
                </span>
                        </div>
                        <div className='delete-button'
                             onClick={(e) => this.props.deleteCard(e, this.props.project)}/>
                    </div>
                </div>
                {this.vacancyDescription(this.props.project)}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

const Connected = connect(mapStateToProps, actions) (KanbanBoard);

class Export extends React.Component {
    render(){
        return (<Connected/>);
    }
}

export default Export;