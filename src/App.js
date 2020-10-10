import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Products from "./components/products";
import Purchase from "./components/purchase";
import NotFound from "./components/notFound";
import NavBar from "./components/navBar";
import NavBarLateral from "./components/navBarLateral";
import LoginForm from "./components/loginForm";
import ProductForm from "./components/productForm";
import PurchaseItemForm from "./components/purchaseItemForm";
import CustomerOrderForm from "./components/customerOrderForm";
import PurchaseForm from "./components/purchaseForm";
import OrderItemsForm from "./components/orderItemsForm";
import CustomerOrder from "./components/customerOrder";

import BrandForm from "./components/brandForm";
import TypeProductForm from "./components/typeProductForm";
import RegisterForm from "./components/registerForm";
import Logout from "./components/logout";
import ProtectedRoute from "./components/common/protectedRoute";
import auth from "./services/authService";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }
  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar user={this.state.user} />
        <div className="container-fluid">
          <div className="row">
            <NavBarLateral user={this.state.user} />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
              <Switch>
                <Route path="/register" component={RegisterForm} />
                <Route path="/login/" component={LoginForm} />
                <Route path="/logout/" component={Logout} />
                <ProtectedRoute
                  path="/orderitems/:id"
                  component={OrderItemsForm}
                />
                <ProtectedRoute
                  path="/customerorders/:id"
                  component={CustomerOrderForm}
                />
                <ProtectedRoute
                  path="/itempurchase/:id"
                  component={PurchaseItemForm}
                />
                <ProtectedRoute
                  path="/purchases/:id"
                  component={PurchaseForm}
                />
                <ProtectedRoute path="/products/:id" component={ProductForm} />
                <ProtectedRoute path="/brands/:id" component={BrandForm} />
                <ProtectedRoute
                  path="/typesProduct/:id"
                  component={TypeProductForm}
                />
                <Route
                  path="/customerorders"
                  render={props => (
                    <CustomerOrder {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/purchases"
                  render={props => (
                    <Purchase {...props} user={this.state.user} />
                  )}
                />
                <Route
                  path="/products"
                  render={props => (
                    <Products {...props} user={this.state.user} />
                  )}
                />

                <Route path="/not-found" component={NotFound} />
                <Redirect to="/not-found" />
              </Switch>
            </main>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
