import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class ProductTable extends Component {
  columns = [
    {
      path: "product_name",
      label: "Titulo",
      content: product => (
        <Link to={`/products/${product.product_id}`}>
          {product.product_name}
        </Link>
      )
    },
    { path: "type_products_id", label: "Categoria" },
    { path: "earnings", label: "Ganancia" },
    { path: "product_price", label: "Precio" }
  ];

  deleteColumn = {
    key: "delete",
    content: product => (
      <button
        onClick={() => this.props.onDelete(product)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.user_type_id === 1) {
      this.columns.push(this.deleteColumn);
    }
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

export default ProductTable;
