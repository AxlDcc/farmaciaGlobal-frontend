import React from "react";
import Pagination from "./common/pagination";
import { toast } from "react-toastify";
import ListGroup from "./common/listGroup";
import { getProducts } from "../services/productService";
import ItemTable from "./itemTable";
import { paginate } from "../utils/paginate";
import { getCategories } from "../services/productCategoryService";
import _ from "lodash";
import SearchBox from "./common/searchBox";
import Joi from "joi-browser";
import Form from "./common/form";

import { getOrderItem, saveOrderItem } from "../services/orderItemService";
import { getOrderStatuses } from "../services/orderStatusService";

class OrderItemsForm extends Form {
  state = {
    products: [],
    categories: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "title", order: "asc" },
    data: {
      order_item_id: this.props.match.params.id,
      product_id: "",
      order_status_id: "",
      item_quantity: ""
    },
    errors: {},
    orderStatus: {}
  };

  schema = {
    order_item_id: Joi.number().required(),
    order_id: Joi.number().required(),
    product_id: Joi.number().required(),
    order_status_id: Joi.number().required(),
    item_quantity: Joi.number()
      .integer()
      .required()
  };

  //Products Process
  async componentDidMount() {
    const { data } = await getCategories();
    const { data: orderStatus } = await getOrderStatuses();
    const categories = [
      { type_products_id: "", type_name: "Todas las categorias" },
      ...data
    ];
    const { data: products } = await getProducts();

    this.setState({ products, categories, orderStatus });
  }

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = category => {
    this.setState({
      selectedCategory: category,
      searchQuery: "",
      currentPage: 1
    });
    console.log(category);
  };
  handleSearch = query => {
    this.setState({
      searchQuery: query,
      selectedCategory: null,
      currentPage: 1
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      selectedCategory,
      searchQuery,
      products: allProducts
    } = this.state;

    let filtered = allProducts;
    if (searchQuery)
      filtered = allProducts.filter(m =>
        m.product_name.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedCategory && selectedCategory.type_products_id)
      filtered = allProducts.filter(
        m => m.type_products_id === selectedCategory.type_products_id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const products = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: products };
  };

  //Pruchase Procces.
  async populatePurchaseItem() {
    try {
      const staticId = this.props.match.params.id;
      if (staticId === "new") return;
      const { data: purchaseItem } = await getOrderItem(staticId);
      this.setState({ data: this.mapToViewModel(purchaseItem) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  doSubmit = async () => {
    await saveOrderItem(this.state.data);
    this.props.history.push("/customerorders");
  };

  mapToViewModel(item) {
    return {
      order_item_id: item.order_item_id,
      order_id: item.order_id,
      product_id: item.product_id,
      order_status_id: item.order_status_id,
      item_quantity: item.item_quantity
    };
  }
  //End
  render() {
    const { length: count } = this.state.products;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) {
      return <p>No se encuentran productos en la base de datos...</p>;
    }

    const { totalCount, data: products } = this.getPageData();

    return (
      <React.Fragment>
        <div>
          <h1>Formulario Items</h1>
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("order_item_id", "No.Orden")}
            {this.renderInput("product_id", "ID.Producto")}
            {this.renderSelect(
              "order_status_id",
              "Estado",
              this.state.orderStatus,
              "order_status_id",
              "order_status_desc"
            )}
            {this.renderInput("item_quantity", "Cantidad")}

            {this.renderButton("Guardar")}
          </form>
        </div>
        <div className="row">
          <div className="col-3">
            <ListGroup
              items={this.state.categories}
              selectedItem={this.state.selectedCategory}
              onItemSelect={this.handleCategorySelect}
              textProperty={"type_name"}
              valueProperty={"type_products_id"}
            />
          </div>
          <div className="col">
            <p>Mostrando {totalCount} Productos</p>
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <ItemTable
              products={products}
              sortColumn={sortColumn}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
              onSort={this.handleSort}
              propid={"product_id"}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default OrderItemsForm;
