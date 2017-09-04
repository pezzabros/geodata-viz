import React, {Component} from 'react';
import ReactTable from 'react-table'
import moment from 'moment'

export default class TableContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        const columns = [{
            Header: 'IP SRC',
            accessor: 'ip_src' // String-based value accessors!
        }, {
            Header: 'IP DST',
            accessor: 'ip_dst',
        }, {
            Header: 'COUNTRY DST',
            accessor: 'country_dst'
        }, {
            Header: 'TOTAL INTERACTIONS',
            accessor: 'times'
        },
        {
            Header: 'LAST INTERACTION',
            accessor: 'last',
            Cell: props => moment(parseInt(props.value)).format("DD/MM/YYYY hh:mm:ss")
        }]

        return (
            <div className="table-container">
                <ReactTable
                    data={this.props.data}
                    columns={columns}
                    className="-striped -highlight"
                    defaultPageSize={5}
                    loading={this.props.loading}
                />
            </div>
        );
    }

}
