class VacancyBlock extends React.Component {
    constructor() {
        super();
        this.state = {
            isOpening: false
        };

        this.onClickView = this.onClickView.bind(this);
    }

    onClickView() {
        this.setState({isOpening: true});
    }

    render() {
        return <div className={this.state.isOpening ? "vacancy-block open-block" : "vacancy-block"}>
            <div className="my-row">
                <div>
                    <span className="position">{this.props.position.position}</span> <br/>
                </div>
                <div>
                    <a href={this.props.position.url} target="_blank">
                        <input type="button" className="button" value="View" onClick={this.onClickView}/>
                    </a>
                </div>
            </div>

            <span className="company-name">
            <a href={this.props.position.Website} target="_blank">
            {this.props.position.company_name ? this.props.position.company_name : undefined}
            </a>
                {this.props.position.country ? ' / ' + this.props.position.country : undefined}
    </span>

            <span className="date">{this.props.position.SiteAddingDate}</span>
            <span className={this.props.position.location ? "company-name" : ""}>
                {this.props.position.location ? 'Location: ' + this.props.position.location : undefined}
            </span>
            <span className="company-name">Stack</span>
        </div>;
    }
}

class VacancyList extends React.Component {
    constructor() {
        super();

        this.state = {
            positions: vacancies,
            newVacanciesCount: 0
        };

        this.showNextVacancies = this.showNextVacancies.bind(this);
        this.showNewVacancies = this.showNewVacancies.bind(this);

        this.getNewVacanciesCount(this);
    }

    showNewVacancies() {
        let context = this;
        $.ajax({
            url: "/api/getNewVacancies",
            type: "GET",
            contentType: "application/json",
            success: function (result) {
                result.forEach(function(item, i, arr) {
                    context.setState({positions: [item, ...context.state.positions]});
                });

                window.scrollTo(0, 0);
            }
        });
    }

    showNextVacancies() {
        let context = this,
            vacanciesCount = context.state.positions.length;
        $.ajax({
            url: "/api/getVacancies/" + (vacanciesCount + 10),
            type: "GET",
            contentType: "application/json",
            success: function (result) {
                context.setState({positions: result});
            }
        });
    }

    getNewVacanciesCount(context) {
        setInterval(function() {
            $.ajax({
                url: "/api/getNewVacanciesCount",
                type: "GET",
                contentType: "application/json",
                success: function (result) {
                    context.setState({newVacanciesCount: result[0].count});
                    console.log(context.state.newVacanciesCount);
                }
            });
        }, 20000);
    }

    render() {
        return <div className="vacancy-list">
            {
                this.state.positions && this.state.positions.map(function(vacancy){
                    return <VacancyBlock position={vacancy} />
                })
            }
            <div id="bottom-block">
                <input type="button" value={"show " + this.state.newVacanciesCount + " new vacancies"}
                       onClick={this.showNewVacancies} />
            </div>
            <div id="show-new-vacancies-block" onClick={this.showNextVacancies}>
                &darr; show next 10 vacancies &darr;
            </div>
        </div>;
    }
}

function getVacancies() {
    $.ajax({
        url: "/api/getVacancies/10",
        type: "GET",
        contentType: "application/json",
        success: function (ff) {
            vacancies = ff;
            console.log(vacancies);
            ReactDOM.render(
                <VacancyList />,
                document.getElementById("container")
            );
        }
    });
}

//

let vacancies = {};
getVacancies();