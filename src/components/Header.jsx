import { useEffect, useState } from "react";
import { Navbar, Nav, Dropdown, Badge, NavbarBrand } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from '/assets/logo.jpeg';

function Header(refresh) {
  const navigate = useNavigate();
  const [commandeCount, setCommandeCount] = useState(0);
  const [personne, setPersonne] = useState({
    id: "",
    nom: "",
    prenom: "",
    contact: "",
    localisation: "",
    codePostal: "",
    role: { id: "", nom: "" },
    utilisateur: { id: "", email: "", password: "", isAdmin: "", pseudo: "" },
    typeProduction: { id: "", nom: "" },
  });

  useEffect(() => {
    const fetchCommandeCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/commande/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setPersonne(response.data.data[0]);
          setCommandeCount(response.data.data[2]);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCommandeCount();
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
        <Nav className="d-flex flex-row align-items-center mx-5">
          <Navbar.Brand href="/dashboard-product">
            <img
              src={Logo}
              alt="Logo"
              // width="50"
              height="50"
            />
          </Navbar.Brand>
          <NavbarBrand>
            <Link className="navbar-brand fw-bold fs-4 text-warning" style={{ letterSpacing: "1px" }} to="/dashboard-product">Kolekta</Link>
          </NavbarBrand>
        </Nav>

        {/* Right Side Options */}
        <Nav className="d-flex flex-row align-items-center">
          {/* Cart */}
          <Nav.Item className="mx-2">
            <Nav.Link href="/commande/list" className="text-white d-flex align-items-center">
              <i className="bi bi-card-checklist fs-5"></i>
              <Badge bg="warning" text="dark" className="ms-1">{commandeCount}</Badge>
              <div className="ms-2">Commande</div>
            </Nav.Link>
          </Nav.Item>


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
                  {personne.prenom} {personne.nom}
                </span>
                <small className="text-muted">{personne.role.nom}</small>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item href={`/user/profile-vendeur/${personne.id}`}>
                Mon Profil
              </Dropdown.Item>
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

export default Header;
