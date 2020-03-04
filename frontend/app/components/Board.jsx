let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

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

    //this is called when a Kanban card is dragged over a column (called by column)
    handleOnDragEnter(e, stageValue) {
        this.setState({ draggedOverCol: stageValue });
    }

    //this is called when a Kanban card dropped over a column (called by card)
    handleOnDragEnd(e, project) {
        const updatedProjects = this.props.store.boardVacancies.slice(0);
        updatedProjects.find((projectObject) => {return projectObject.vacancyId === project.vacancyId;}).boardStatus = this.state.draggedOverCol;
        this.props.addVacancy(updatedProjects, 'board');

        fetch(`/api/vacancy-status`,
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
                            projects={ this.props.store.boardVacancies.filter((project) => {return project.boardStatus === column.name;}) }
                            onDragEnter={ this.handleOnDragEnter }
                            onDragEnd={ this.handleOnDragEnd }
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
            isDescriptionOpen: false
        };

        this.handleDescription = this.handleDescription.bind(this);
    }

    handleDescription(e) {
        this.setState(function(prevState) {
            return {
                isDescriptionOpen: prevState.isDescriptionOpen !== true
            };
        });
        e.stopPropagation();
    }

    vacancyDescription(vacancy) {
        let style = {
            'height': document.body.clientHeight
        };

        return (
            <div>
                <div className={this.state.isDescriptionOpen === true ? 'back-vacancy-information' :
                    ' back-vacancy-information hide'}
                     onClick={this.handleDescription}> </div>
                <div className={this.state.isDescriptionOpen === true ? 'vacancy-information' :
                    'vacancy-information hide'}
                     onClick={(e) => e.stopPropagation()}>
                    <div className='flex-block'>
                        <div>
                            <span className='vacancy-name'>{vacancy.position}</span> <br/>
                            <a href={vacancy.website} target='_blank'>
                            <span className={vacancy.companyName ? 'company-name' : 'hide'}>
                                {vacancy.companyName}
                            </span>
                            </a>
                            <span className={vacancy.country ? 'company-country' : 'hide'}>
                                {' / ' + vacancy.country}
                            </span>
                            <span className='tech-stack'>stack</span> <br/>
                            <span className={vacancy.location ? 'location' : 'hide'}>
                                Location: {vacancy.location}
                            </span>
                            <span className={vacancy.contacts ? 'contacts' : 'hide'}>
                                Contacts: {vacancy.contacts}
                            </span>
                        </div>
                        <div>
                            <a href={vacancy.url} target='_blank'
                               onClick={(e) => e.stopPropagation()}>
                                <input type='button' value='View' title='view vacancy'/>
                            </a>
                            <div className='date'>
                                {vacancy.siteAddingDate}
                            </div>
                        </div>
                    </div>
                    <div  id={vacancy.url + 'board'} className='description'
                          dangerouslySetInnerHTML = {{__html:vacancy.description}} />
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className='boardCard'
                 draggable={true}
                 onDragEnd={(e) => {this.props.onDragEnd(e, this.props.project);}}
                 onClick={this.handleDescription}>
                <span className='vacancy-name'>{this.props.project.position}</span> <br/>
                <span className={this.props.project.companyName ? 'company-name' : 'hide'}>
                    {this.props.project.companyName}
                </span>
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

module.exports = connect(mapStateToProps, actions)(KanbanBoard);