import React, { Component } from "react";
import Pagination from "./common/pagination";
import { toast } from "react-toastify";
import ListGroup from "./common/listGroup";
import CustomerOrderTable from "./customerOrderTable";
import { Link } from "react-router-dom";
import {
  getCustomersOrders,
  deleteCustomerOrder
} from "../services/customerOrderService";
import { paginate } from "../utils/paginate";
import { getOrderStatuses } from "../services/orderStatusService";
import _ from "lodash";
import SearchBox from "./common/searchBox";
import { readlinkSync } from "fs";

class CustomerOrder extends Component {
  state = {
    customerOrders: [],
    orderStatuses: [],
    currentPage: 1,
    pageSize: 4,
    searchQuery: "",
    selectedPurchase: null,
    sortColumn: { path: "title", order: "asc" }
  };
  async componentDidMount() {
    const { data } = await getOrderStatuses();
    const orderStatuses = [
      { order_status_id: "", order_status_desc: "Todos los estados" },
      ...data
    ];
    const { data: customerOrders } = await getCustomersOrders();

    this.setState({ customerOrders, orderStatuses });
  }

  handleDelete = async item => {
    const originalState = this.state.customerOrders;

    const customerOrders = originalState.filter(
      m => m.purchase_number !== item.purchase_number
    );
    this.setState({ customerOrders });
    try {
      await deleteCustomerOrder(item.purchase_number);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Este producto ya no existe");
      if (ex.response && ex.response.status === 403)
        toast.error("No tiene los sufiecientes permisos");

      this.setState({ customerOrders: originalState });
    }
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleCategorySelect = itemSelected => {
    this.setState({
      selectedPurchase: itemSelected,
      searchQuery: "",
      currentPage: 1
    });
    console.log(itemSelected);
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
      customerOrders: allItems
    } = this.state;

    let filtered = allItems;
    if (searchQuery)
      filtered = allItems.filter(m =>
        m.purchase_date.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedPurchase && selectedPurchase.order_status_id)
      filtered = allItems.filter(
        m => m.order_status_id === selectedPurchase.order_status_id
      );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const customerOrders = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: customerOrders };
  };
  render() {
    const { length: count } = this.state.customerOrders;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { user } = this.props;

    if (count === 0) {
      return (
        <React.Fragment>
          {user && (
            <Link
              to="/customerorders/new"
              className="btn btn-primary"
              style={{ marginBottom: 20 }}
            >
              + Orden
            </Link>
          )}
          <p>No se encuentran compras en la base de datos...</p>
        </React.Fragment>
      );
    }

    const { totalCount, data: customerOrders } = this.getPageData();

    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.orderStatuses}
            selectedItem={this.state.selectedPurchase}
            onItemSelect={this.handleCategorySelect}
            textProperty={"order_status_desc"}
            valueProperty={"order_status_id"}
          />
        </div>
        <div className="col">
          {user && (
            <React.Fragment>
              <Link
                to="/customerOrders/new"
                className="btn btn-primary"
                style={{ marginBottom: 20 }}
              >
                + Orden
              </Link>
              <Link
                to="/brands/new"
                className="btn btn-info"
                style={{ marginBottom: 20, marginLeft: 10 }}
              >
                + Estados
              </Link>
            </React.Fragment>
          )}
          <p>Mostrando {totalCount} Ordenes de venta</p>
          <SearchBox value={searchQuery} onChange={this.handleSearch} />
          <CustomerOrderTable
            customerOrders={customerOrders}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
            propid={"order_id"}
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

export default CustomerOrder;
