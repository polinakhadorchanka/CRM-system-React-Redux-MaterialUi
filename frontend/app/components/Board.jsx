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
        backgroundColor: '#f1f1f1',
    },
    button: {
        marginLeft: 'auto',
        width: '30px'
    },
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
        if(project.boardStatus !== undefined) {
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
                console.log(err);
            });
        }
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
                console.log(err);
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
                    console.log(err);
                });
        }
    }

    //this is called when a Kanban card is dragged over a column (called by column)
    function handleOnDragEnter(e, stageValue) {
        if(stageValue !== undefined)
            draggedOverCol = stageValue;
    }

    //this is called when a Kanban card dropped over a column (called by card)
    function handleOnDragEnd(e, project) {
        project.BoardStatus = draggedOverCol;

        if(project.BoardStatus !== undefined) {
            let userId = props.store.user.ClientId;

            console.log(project);
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

                            return;
                        }

                        const updatedProjects = props.store.boardVacancies.slice(0);
                        updatedProjects.find((projectObject) => {
                            return projectObject.VacancyId === project.VacancyId;
                        }).BoardStatus = draggedOverCol;
                        props.addVacancy(updatedProjects, 'board');
                    }
                )
                .catch(function (err) {
                    console.log(err);
                });
        }
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
    let mouseIsHovering = false,
        projects = props.projects;

    function generateKanbanCards() {
        return projects.slice(0).map((project) => {
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
                            <VacancyDescription vacancy={this.props.project} changeComment={this.changeComment}/>
                            <IconButton onClick={(e) => this.props.deleteCard(e, this.props.project)}>
                                <ClearIcon/>
                            </IconButton>
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