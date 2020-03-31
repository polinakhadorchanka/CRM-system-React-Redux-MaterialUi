import React from 'react';
import { connect } from 'react-redux';
import actions from "../actions.jsx";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from "@material-ui/core/IconButton";
import VacancyDescription from "./Material/VacancyDescription.jsx";

const useStyles = makeStyles({
    root: {
        width: '24%',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    card: {
        width: '90%',
        margin: '5%',
        backgroundColor: '#f1f1f1'
    }
});

function KanbanBoard(props) {
    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;
    const columns = [
        {name: 'new', stage: 1},
        {name: 'in the process', stage: 2},
        {name: 'completed', stage: 3},
        {name: 'deferred', stage: 4},
    ];
    const projects = props.store.boardVacancies;
    let draggedOverCol;

    function changeVacancy(project) {
        props.changeVacancy(project);
        let userId = props.store.user.ClientId;
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

    function deleteCard(e, project) {
        let vacancies = props.store.boardVacancies.filter((el) => el.VacancyId !== project.VacancyId),
            userId = props.store.user.ClientId;
        props.addVacancy(vacancies, 'board');
        props.changeVacancy(project);

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

    function handleOnOpenDescription(project) {
        if(project.IsViewed != true) {
            project.IsViewed = true;
            props.changeVacancy(project);

            let userId = props.store.user.ClientId;

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
    function handleOnDragEnter(e, stageValue) {
        draggedOverCol = stageValue;
    }

    //this is called when a Kanban card dropped over a column (called by card)
    function handleOnDragEnd(e, project) {
        const updatedProjects = props.store.boardVacancies.slice(0);
        updatedProjects.find((projectObject) => {return projectObject.VacancyId === project.VacancyId;}).BoardStatus = draggedOverCol;
        props.addVacancy(updatedProjects, 'board');

        let userId = props.store.user.ClientId;

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

    return (
        <div className='boardContainer'>
            {columns.map((column) => {
                return (
                    <Card className={classes.root}>
                        <KanbanColumn
                            name={ column.name }
                            stage={ column.stage }
                            projects={ props.store.boardVacancies.filter((project) => {return project.BoardStatus === column.name;}) }
                            onDragEnter={ handleOnDragEnter }
                            onDragEnd={ handleOnDragEnd }
                            deleteCard = { deleteCard }
                            changeVacancy = { changeVacancy }
                            handleOnOpenDescription = { handleOnOpenDescription }
                            key={ column.stage }
                        />
                    </Card>
                );
            })}
        </div>
    );
}

function KanbanColumn(props) {
    const classes = useStyles();
    let mouseIsHovering = false;

    function componentWillReceiveProps(nextProps) {
        mouseIsHovering = false;
    }

    function generateKanbanCards() {
        return props.projects.slice(0).map((project) => {
            return (
                <Card className={classes.card}>
                    <KanbanCard
                        project={project}
                        key={project.vacancyId}
                        onDragEnd={props.onDragEnd}
                        deleteCard = { props.deleteCard }
                        handleOnOpenDescription = { props.handleOnOpenDescription }
                        changeVacancy = { props.changeVacancy }
                    />
                </Card>
            );
        });
    }

    return (
        <div className='boardColumn'
             onDragEnter={(e) => {mouseIsHovering = true; props.onDragEnter(e, props.name);}}
             onDragExit={(e) => {mouseIsHovering = false;}}>
            <h4>{props.name} ({props.projects.length})</h4>
            {generateKanbanCards()}
        </div>
    );
}

class KanbanCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true
        };

        this.changeComment = this.changeComment.bind(this);
    }

    changeComment(e, comment) {
        let vacancy = this.props.project;
        vacancy.Comment = comment;
        this.props.changeVacancy(vacancy);
    }

    render() {
        return (
            <div>
                <div className='boardCard'
                     draggable={true}
                     onDragEnd={(e) => {this.props.onDragEnd(e, this.props.project);}}>
                    <div className='container'>
                        <div>
                            <span className='vacancy-name'>{this.props.project.Position}</span> <br/>
                            <span className={this.props.project.CompanyName ? 'company-name' : 'hide'}>
                    {this.props.project.CompanyName}
                </span>
                        </div>
                        <div>
                            <div><VacancyDescription vacancy={this.props.project} changeComment={this.changeComment}/></div>
                            <div><IconButton onClick={(e) => this.props.deleteCard(e, this.props.project)}>
                                <ClearIcon/>
                            </IconButton></div>
                        </div>
                    </div>
                </div>
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

/*
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
 */