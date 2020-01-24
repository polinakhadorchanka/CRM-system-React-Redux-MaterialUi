let React = require('react');

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

module.exports = VacancyBlock;