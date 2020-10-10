import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

import { getPurchase, savePurchase } from "../services/purchaseService";
import { getSuppliers } from "../services/supplierService";

class PurchaseForm extends Form {
  state = {
    data: {
      supplier_id: "",
      purchase_date: "",
      purchase_total: "",
      status: ""
    },
    suppliers: [],
    errors: {}
  };

  schema = {
    supplier_id: Joi.number().required(),
    purchase_date: Joi.date(),
    purchase_total: Joi.number()
      .precision(2)
      .required(),
    status: Joi.number()
      .integer()
      .required()
  };

  async populateSuppliers() {
    const { data: suppliers } = await getSuppliers();
    this.setState({ suppliers });
  }
  async populatePurchase() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: purchase } = await getPurchase(staticId);
      this.setState({ data: this.mapToViewModel(purchase) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }
  async componentDidMount() {
    await this.populateSuppliers();
    await this.populatePurchase();
  }

  doSubmit = async () => {
    await savePurchase(this.state.data);
    this.props.history.push("/purchases");
  };

  mapToViewModel(item) {
    return {
      purchase_number: item.purchase_number,
      supplier_id: item.supplier_id,
      purchase_date: item.purchase_date,
      purchase_total: item.purchase_total,
      status: item.status
    };
  }
  render() {
    return (
      <div>
        <h1>Formulario Compra</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderSelect(
            "supplier_id",
            "Categoria",
            this.state.suppliers,
            "supplier_id",
            "supplier_name"
          )}

          {this.renderInput("purchase_date", "Fecha")}
          {this.renderInput("purchase_total", "total")}
          {this.renderInput("status", "Estado")}
          {this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default PurchaseForm;
