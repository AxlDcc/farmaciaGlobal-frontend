import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class ItemTable extends Component {
  columns = [
    { path: "product_id", label: "Product ID" },
    {
      path: "product_name",
      label: "Titulo"
    },
    { path: "type_products_id", label: "Categoria" },
    { path: "earnings", label: "Ganancia" }
  ];

  constructor() {
    super();
    const user = auth.getCurrentUser();
  }
  render() {
    const { products, onSort, sortColumn, propid } = this.props;

    return (
      <Table
        columns={this.columns}
        data={products}
        sortColumn={sortColumn}
        onSort={onSort}
        propid={propid}
      />
    );
  }
}

export default ItemTable;
