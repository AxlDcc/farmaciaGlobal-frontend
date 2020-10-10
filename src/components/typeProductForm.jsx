import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

import {
  getCategories,
  saveTypesProduct
} from "../services/productCategoryService";

class TypeProductForm extends Form {
  state = {
    data: {
      type_name: "",
      status: ""
    },
    errors: {}
  };

  schema = {
    type_name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    status: Joi.number()
      .integer()
      .required()
  };
  async populateTypesProduct() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: items } = await getCategories(staticId);
      this.setState({ data: this.mapToViewModel(items) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  doSubmit = async () => {
    await saveTypesProduct(this.state.data);
    this.props.history.push("/products");
  };

  mapToViewModel(item) {
    return {
      type_products_id: item.type_products_id,
      type_name: item.type_name,
      status: item.status
    };
  }
  render() {
    return (
      <div>
        <h1>Formulario Categoria</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("type_name", "Nombre")}
          {this.renderInput("status", "Estado")}
          {this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default TypeProductForm;
