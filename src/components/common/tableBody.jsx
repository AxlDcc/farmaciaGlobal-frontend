import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    return _.get(item, column.path);
  };

  createKey = (item, column, propid) => {
    return item[propid] + (column.path || column.key);
  };

  render() {
    const { data, columns, propid } = this.props;
    return (
      <tbody>
        {data.map(item => (
          <tr key={item[propid]}>
            {columns.map(column => (
              <td key={this.createKey(item, column, propid)}>
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
