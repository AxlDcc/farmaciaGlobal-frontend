import React from "react";
import { Link, NavLink } from "react-router-dom";

const NavBarLateral = ({ user }) => {
  function renderAdmin() {
    if (user && user.user_type_id === 1) {
      return (
        <React.Fragment>
          <ul className="nav flex-column">
            <li className="nav-item">
              {!user && (
                <React.Fragment>
                  <NavLink className="nav-item nav-link" to="/rentals">
                    Perfil
                  </NavLink>
                </React.Fragment>
              )}
              {user && (
                <React.Fragment>
                  <NavLink className="nav-item nav-link" to="/rentals">
                    {user.email}
                  </NavLink>
                </React.Fragment>
              )}
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Usuarios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Empleados
              </a>
            </li>
            <li className="nav-item">
              <NavLink className="nav-item nav-link " to="/products">
                Productos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-item nav-link " to="/purchases">
                Compras
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-item nav-link " to="/customerorders">
                Ordenes Venta
              </NavLink>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Transacciones
              </a>
            </li>
          </ul>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        {!user && (
          <React.Fragment>
            <ul className="nav flex-column">
              <li className="nav-item">
                {!user && (
                  <React.Fragment>
                    <NavLink className="nav-item nav-link" to="/rentals">
                      Perfil
                    </NavLink>
                  </React.Fragment>
                )}
                {user && (
                  <React.Fragment>
                    <NavLink className="nav-item nav-link" to="/rentals">
                      {user.email}
                    </NavLink>
                  </React.Fragment>
                )}
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Direcciones
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Historial compras
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Facturas
                </a>
              </li>
            </ul>
          </React.Fragment>
        )}
        {renderAdmin()}
      </div>
    </nav>
  );
};

export default NavBarLateral;
