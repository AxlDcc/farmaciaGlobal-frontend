import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

import { getBrands, saveBrand } from "../services/brandService";

class BrandForm extends Form {
  state = {
    data: {
      brand_name: "",
      status: ""
    },
    errors: {}
  };

  schema = {
    brand_name: Joi.string()
      .min(3)
      .max(50)
      .required(),
    status: Joi.number()
      .integer()
      .required()
  };
  async populateBrand() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: brand } = await getBrands(staticId);
      this.setState({ data: this.mapToViewModel(brand) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  doSubmit = async () => {
    await saveBrand(this.state.data);
    this.props.history.push("/products");
  };

  mapToViewModel(item) {
    return {
      brand_id: item.brand_id,
      brand_name: item.brand_name,
      status: item.status
    };
  }
  render() {
    return (
      <div>
        <h1>Formulario Marcas</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("brand_name", "Nombre")}
          {this.renderInput("status", "Estado")}
          {this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default BrandForm;
