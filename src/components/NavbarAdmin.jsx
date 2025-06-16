import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "../assets/navbar.css";

function NavbarAdmin() {
  const location = useLocation();

  return (
    <div className="sidebar p-4">
      <div className="menu-section">
        <h6 className="menu-title text-uppercase">Menu</h6>
        <ul className="navbar-nav">
          <li className="nav-item mb-2">
            <a
              href="/admin-dashboard"
              className={`nav-link d-flex align-items-center ${location.pathname === "/admin-dashboard" ? "active" : ""
                }`}
            >
              <i className="ri-dashboard-line me-3"></i> Dashboard
            </a>
          </li>
        </ul>
      </div>

      <div className="menu-section mt-4">
        <h6 className="menu-title text-uppercase">Pages</h6>
        <ul className="navbar-nav">
          <li className="nav-item mb-2">
            <a
              href="/list-user"
              className={`nav-link d-flex align-items-center ${location.pathname === "/list-user"
                ? "text-warning"
                : ""
                }`}
            >
              <i className="ri-pages-line me-3"></i> Utilisateurs
            </a>
          </li>

          <li className="nav-item mb-2">
            <a
              href="/commande/list-admin"
              className={`nav-link d-flex align-items-center ${location.pathname === "/commande/list-admin"
                ? "text-warning"
                : ""
                }`}
            >
              <i className="ri-pages-line me-3"></i> Commandes
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default NavbarAdmin;
