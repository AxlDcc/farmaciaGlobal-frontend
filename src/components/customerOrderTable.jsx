import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class CustomerOrderTable extends Component {
  columns = [
    {
      path: "order_id",
      label: "No. Orden",
      content: customItem => (
        <Link to={`/customerorders/${customItem.order_id}`}>
          {customItem.order_id}
        </Link>
      )
    },
    { path: "address_id", label: "Direccion" },
    { path: "order_date", label: "Fecha " },
    { path: "shipping_cost", label: "Costo Envio" },
    { path: "total", label: "Total" }
  ];

  deleteColumn = {
    key: "delete",
    content: customItem => (
      <button
        onClick={() => this.props.onDelete(customItem)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  addItemsColumn = {
    key: "addproduct",
    content: customItem => (
      <Link
        to={`/orderitems/${customItem.order_id}`}
        className="btn btn-success btn-sm"
      >
        Agregar Item
      </Link>
    )
  };

  constructor() {
    super();
    const user = auth.getCurrentUser();
    if (user && user.user_type_id === 1) {
      this.columns.push(this.deleteColumn);
      this.columns.push(this.addItemsColumn);
    }
  }
  render() {
    const { customerOrders, onSort, sortColumn, propid } = this.props;

    return (
      <Table
        columns={this.columns}
        data={customerOrders}
        sortColumn={sortColumn}
        onSort={onSort}
        propid={propid}
      />
    );
  }
}

export default CustomerOrderTable;
