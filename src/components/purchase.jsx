import React, { Component } from "react";
import Pagination from "./common/pagination";
import { toast } from "react-toastify";
import ListGroup from "./common/listGroup";
import PurchaseTable from "./purchaseTable";
import { Link } from "react-router-dom";
import { getPurchases, deletePurchase } from "../services/purchaseService";
import { paginate } from "../utils/paginate";
import { getSuppliers } from "../services/supplierService";
import _ from "lodash";
import SearchBox from "./common/searchBox";

class Purchase extends Component {
  state = {
    purchases: [],
    suppliers: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedPurchase: null,
    sortColumn: { path: "title", order: "asc" }
  };
  async componentDidMount() {
    const { data } = await getSuppliers();
    const suppliers = [
      { supplier_id: "", supplier_name: "Todas los proveedores" },
      ...data
    ];
    const { data: purchases } = await getPurchases();

    this.setState({ purchases, suppliers });
  }

  handleDelete = async item => {
    const originalPurchase = this.state.purchases;

    const purchases = originalPurchase.filter(
      m => m.purchase_number !== item.purchase_number
    );
    this.setState({ purchases });
    try {
      await deletePurchase(item.purchase_number);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Este producto ya no existe");
      if (ex.response && ex.response.status === 403)
        toast.error("No tiene los sufiecientes permisos");

      this.setState({ purchases: originalPurchase });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = supplier => {
    this.setState({
      selectedPurchase: supplier,
      searchQuery: "",
      currentPage: 1
    });
    console.log(supplier);
  };
  handleSearch = query => {
    this.setState({
      searchQuery: query,
      selectedPurchase: null,
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
      selectedPurchase,
      searchQuery,
      purchases: allPurchase
    } = this.state;

    let filtered = allPurchase;
    if (searchQuery)
      filtered = allPurchase.filter(m =>
        m.purchase_date.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedPurchase && selectedPurchase.supplier_id)
      filtered = allPurchase.filter(
        m => m.supplier_id === selectedPurchase.supplier_id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const purchases = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: purchases };
  };
  render() {
    const { length: count } = this.state.purchases;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) {
      return <p>No se encuentran compras en la base de datos...</p>;
    }

    const { totalCount, data: purchases } = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.suppliers}
            selectedItem={this.state.selectedPurchase}
            onItemSelect={this.handleCategorySelect}
            textProperty={"supplier_name"}
            valueProperty={"supplier_id"}
          />
        </div>
        <div className="col">
          {user && (
            <React.Fragment>
              <Link
                to="/purchases/new"
                className="btn btn-primary"
                style={{ marginBottom: 20 }}
              >
                + Compra
              </Link>
              <Link
                to="/brands/new"
                className="btn btn-info"
                style={{ marginBottom: 20, marginLeft: 10 }}
              >
                + Proveedor
              </Link>
            </React.Fragment>
          )}
          <p>Mostrando {totalCount} Compras</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <PurchaseTable
            purchases={purchases}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            propid={"purchase_number"}
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

export default Purchase;
