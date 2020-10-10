import React, { Component } from "react";
import auth from "../services/authService";
import Table from "./common/table";
import { Link } from "react-router-dom";

class PurchaseTable extends Component {
  columns = [
    {
      path: "purchase_number",
      label: "Numero Factura",
      content: purchase => (
        <Link to={`/purchases/${purchase.purchase_number}`}>
          {purchase.purchase_number}
        </Link>
      )
    },
    { path: "supplier_id", label: "Proveedor" },
    { path: "purchase_date", label: "Fecha " },
    { path: "purchase_total", label: "Total" }
  ];

  deleteColumn = {
    key: "delete",
    content: purchase => (
      <button
        onClick={() => this.props.onDelete(purchase)}
        className="btn btn-danger btn-sm"
      >
        Eliminar
      </button>
    )
  };

  addItemsColumn = {
    key: "addproduct",
    content: purchase => (
      <Link
        to={`/itemPurchase/${purchase.purchase_number}`}
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
    const { purchases, onSort, sortColumn, propid } = this.props;

    return (
      <Table
        columns={this.columns}
        data={purchases}
        sortColumn={sortColumn}
        onSort={onSort}
        propid={propid}
      />
    );
  }
}

export default PurchaseTable;
