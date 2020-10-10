import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";
import auth from "./../services/authService";

import {
  getCustomerOrder,
  saveCustomerOrder
} from "../services/customerOrderService";
import { getOrderStatuses } from "../services/orderStatusService";

class CustomerOrderForm extends Form {
  state = {
    data: {
      user_id: "",
      order_status_id: "",
      address_id: "",
      order_date: "",
      shipping_cost: "",
      total: ""
    },
    orderStatuses: [],
    errors: {}
  };

  schema = {
    user_id: Joi.number().required(),
    order_status_id: Joi.number().required(),
    address_id: Joi.number().required(),
    order_date: Joi.date().required(),
    shipping_cost: Joi.number().precision(2),
    total: Joi.number().precision(2)
  };

  async populateOrderStatuses() {
    const { data: orderStatuses } = await getOrderStatuses();
    this.setState({ orderStatuses });
  }
  async populateCustomerOrders() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: purchase } = await getCustomerOrder(staticId);
      this.setState({ data: this.mapToViewModel(purchase) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }
  async componentDidMount() {
    await this.populateOrderStatuses();
    await this.populateCustomerOrders();
  }

  doSubmit = async () => {
    await saveCustomerOrder(this.state.data);
    this.props.history.push("/customerorders");
  };

  mapToViewModel(item) {
    return {
      order_id: item.order_id,
      user_id: item.user_id,
      order_status_id: item.order_status_id,
      address_id: item.address_id,
      order_date: item.order_date,
      shipping_cost: item.shipping_cost,
      total: item.total
    };
  }
  render() {
    return (
      <div>
        <h1>Formulario Orden</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("user_id", "Usuario Actual")}

          {this.renderSelect(
            "order_status_id",
            "Categoria",
            this.state.orderStatuses,
            "order_status_id",
            "order_status_desc"
          )}

          {this.renderInput("address_id", "Direccion")}
          {this.renderInput("order_date", "Fecha")}
          {this.renderInput("shipping_cost", "Costo Envio")}
          {this.renderInput("total", "Total")}

          {this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default CustomerOrderForm;
