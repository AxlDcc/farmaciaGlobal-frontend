import React, { Component } from "react";
import Pagination from "./common/pagination";
import { toast } from "react-toastify";
import ListGroup from "./common/listGroup";
import ProductTable from "./productTable";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/productService";
import { paginate } from "../utils/paginate";
import { getCategories } from "../services/productCategoryService";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Products extends Component {
  state = {
    products: [],
    categories: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedCategory: null,
    sortColumn: { path: "title", order: "asc" }
  };
  async componentDidMount() {
    const { data } = await getCategories();
    const categories = [
      { type_products_id: "", type_name: "Todas las categorias" },
      ...data
    ];
    const { data: products } = await getProducts();

    this.setState({ products, categories });
  }

  handleDelete = async item => {
    const originalProducts = this.state.products;

    const products = originalProducts.filter(
      m => m.product_id !== item.product_id
    );
    this.setState({ products });
    try {
      await deleteProduct(item.product_id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Este producto ya no existe");
      if (ex.response && ex.response.status === 403)
        toast.error("No tiene los sufiecientes permisos");

      this.setState({ products: originalProducts });
    }
  };

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
  render() {
    const { length: count } = this.state.products;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) {
      return <p>No se encuentran productos en la base de datos...</p>;
    }

    const { totalCount, data: products } = this.getPageData();

    return (
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
          {user && (
            <React.Fragment>
              <Link
                to="/products/new"
                className="btn btn-primary"
                style={{ marginBottom: 20 }}
              >
                + Producto
              </Link>
              <Link
                to="/brands/new"
                className="btn btn-info"
                style={{ marginBottom: 20, marginLeft: 10 }}
              >
                +Marca
              </Link>
              <Link
                to="/typesProduct/new"
                className="btn btn-info"
                style={{ marginBottom: 20, marginLeft: 10 }}
              >
                +Categoria
              </Link>
            </React.Fragment>
          )}
          <p>Mostrando {totalCount} Productos</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <ProductTable
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
    );
  }
}

export default Products;
