let React = require('react');
let connect = require("react-redux").connect;
let actions = require("../actions.jsx");

class ParsersTable extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props.store.parsers);
        return (
            <div>
                <table>
                    <tr>
                        <th>IP key</th>
                        <th>IP tocken</th>
                        <th>Comment</th>
                        <th>State</th>
                    </tr>
                    {
                        this.props.store.parsers.map(function (parser, index) {
                            return (
                                <tr>
                                    <td>{parser.IpKey}</td>
                                    <td>{parser.IpTocken}</td>
                                    <td>{parser.Comment}</td>
                                    <td>{parser.State}</td>
                                    <td>Run parser</td>
                                </tr>
                            );
                        })
                    }
                </table>
                <form>
                    <table>
                        <tr>
                            <td>
                                <input type='text' placeholder='IP key' name='ipKey'/>
                            </td>
                            <td>
                                <input type='text' placeholder='IP key' name='ipTocken'/>
                            </td>
                            <td>
                                <input type='text' placeholder='IP key' name='comment'/>
                            </td>
                            <td>
                                <input type='text' placeholder='IP key' name='state'/>
                            </td>
                            <td>
                                <input type='submit' value='Add'/>
                            </td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        store: state
    };
}

module.exports = connect(mapStateToProps, actions)(ParsersTable);