import { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, NavbarBrand } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from '/assets/logo.jpeg';

function HeaderAdmin(refresh) {
  const navigate = useNavigate();

  const [utilisateur, setUtilisateur] = useState({
    id: "",
    pseudo: "",
    email: "",
    password: "",
    isAdmin: ""
  });

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/user/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setUtilisateur(response.data.data[1]);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, [refresh]);

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        sessionStorage.clear();
        navigate("/");
      } else {
        console.error("Logout failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Navbar
      bg="success"
      expand="lg"
      variant="dark"
      fixed="top"
      className="py-2"
    >
      <div className="container-fluid">
        {/* Logo */}
        <Nav className="d-flex flex-row align-items-center mx-5">
          <Navbar.Brand href="/admin-dashboard">
            <img
              src={Logo}
              alt="Logo"
              // width="50"
              height="50"
            />
          </Navbar.Brand>
          <NavbarBrand>
            <Link className="navbar-brand fw-bold fs-4 text-warning" style={{ letterSpacing: "1px" }} to="/admin-dashboard">Kolekta</Link>
          </NavbarBrand>
        </Nav>

        {/* Right Side Options */}
        <Nav className="d-flex flex-row align-items-center">
          {/* User Profile */}
          <Dropdown align="end" className="mx-2">
            <Dropdown.Toggle
              as={Nav.Link}
              className="text-white d-flex align-items-center"
            >
              <i className="bi bi-person fs-3"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                <span className="d-block fw-bold">
                  {utilisateur.pseudo}
                  (Admin)
                </span>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item href="#" onClick={handleLogout}>
                Se Déconnecter
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </Navbar>
  );
}

export default HeaderAdmin;
