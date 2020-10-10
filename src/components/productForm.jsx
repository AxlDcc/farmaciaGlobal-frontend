import React from "react";
import Joi from "joi-browser";
import Form from "./common/form";

import { getProduct, saveProduct } from "../services/productService";
import { getCategories } from "../services/productCategoryService";
import { getBrands } from "../services/brandService";

class ProductForm extends Form {
  state = {
    data: {
      product_name: "",
      type_products_id: "",
      brand_id: "",
      earnings: "",
      product_price: "",
      product_img: "",
      status: ""
    },
    categories: [],
    brands: [],
    errors: {}
  };

  schema = {
    product_id: Joi.number(),
    type_products_id: Joi.number().required(),
    brand_id: Joi.number()
      .required()
      .label("Marca"),
    product_name: Joi.string()
      .min(3)
      .max(80)
      .required()
      .label("Nombre"),
    earnings: Joi.number()
      .precision(2)
      .required()
      .label("Ganancia"),
    product_price: Joi.number()
      .precision(2)
      .label("Precio"),
    product_img: Joi.string().label("URL IMG"),
    status: Joi.number()
      .integer()
      .required()
      .label("Status")
  };
  async populateBrand() {
    const { data: brands } = await getBrands();
    this.setState({ brands });
  }
  async populateCategory() {
    const { data: categories } = await getCategories();
    this.setState({ categories });
  }
  async populateProduct() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: product } = await getProduct(staticId);
      this.setState({ data: this.mapToViewModel(product) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }
  async componentDidMount() {
    await this.populateBrand();
    await this.populateProduct();
    await this.populateCategory();
  }

  doSubmit = async () => {
    await saveProduct(this.state.data);
    this.props.history.push("/products");
  };

  mapToViewModel(item) {
    return {
      product_id: item.product_id,
      type_products_id: item.type_products_id,
      brand_id: item.brand_id,
      product_name: item.product_name,
      earnings: item.earnings,
      product_price: item.product_price,
      product_img: item.product_img,
      status: item.status
    };
  }
  render() {
    return (
      <div>
        <h1>Formulario Producto</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("product_name", "Nombre")}
          {this.renderSelect(
            "brand_id",
            "Marca",
            this.state.brands,
            "brand_id",
            "brand_name"
          )}
          {this.renderSelect(
            "type_products_id",
            "Categoria",
            this.state.categories,
            "type_products_id",
            "type_name"
          )}

          {this.renderInput("earnings", "Ganancia")}
          {this.renderInput("product_price", "Precio")}
          {this.renderInput("product_img", "Ruta Imagen")}
          {this.renderInput("status", "Estado")}
          {this.renderButton("Guardar")}
        </form>
      </div>
    );
  }
}

export default ProductForm;
