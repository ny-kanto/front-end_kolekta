/* eslint-disable react/prop-types */
import { Navbar, Nav, Dropdown, Form, Badge, Button, NavbarBrand } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Logo from '/assets/logo.jpeg';

function HeaderUser({refresh, onHandleSearch}) {
  const [cartCount, setCartCount] = useState(0);
  const [messageNonLus, setMessageNonLus] = useState(0);
  const [nom, setNom] = useState("");
  const [personne, setPersonne] = useState({
    id: '',
    nom: '',
    prenom: '',
    contact: '',
    localisation: '',
    codePostal: '',
    role: { id: '', nom: '' },
    utilisateur: { id: '', email: '', password: '', isAdmin: '', pseudo: '' },
    typeProduction: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/panier/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        if (response.status === 200) {
          setCartCount(response.data.data[0]);

          setPersonne(response.data.data[1]);

          setMessageNonLus(response.data.data[2]);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();
  }, [refresh]);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
  
    onHandleSearch(e);

    if (name === "nom") {
      const updatednom = name === "nom" ? value : nom;

      setNom(updatednom);
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post('http://localhost:8080/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      if (response.status === 200) {
        sessionStorage.clear();
        navigate('/');
      } else {
        console.error('Logout failed.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Navbar bg="success" expand="lg" variant="dark" fixed="top" className="py-2">
      <div className="container-fluid">
        {/* Logo */}
        <Nav className="d-flex flex-row align-items-center mx-5">
          <Navbar.Brand href="/product-user/list">
            <img
              src={Logo}
              alt="Logo"
              // width="50"
              height="50"
            />
          </Navbar.Brand>
          <NavbarBrand>
            <Link className="navbar-brand fw-bold fs-4 text-warning" style={{ letterSpacing: "1px" }} to="/product-user/list">Kolekta</Link>
          </NavbarBrand>
        </Nav>

        {/* Search Box */}
        <Form className="d-flex flex-grow-1 mx-3 justify-content-center">
          <Button variant="warning" size="sm" type="submit">
            <i className="bi bi-search"></i>
          </Button>
          <Form.Control
            type="text"
            value={nom}
            placeholder="Rechercher des produits"
            name="nom"
            className="w-50 mx-3"
            size="sm"
            onChange={handleSearchChange}
          />
        </Form>

        {/* Right Side Options */}
        <Nav className="d-flex flex-row align-items-center">

          {/* Discussion */}
          <Nav.Item className="mx-2">
            <Nav.Link href="/chat" className="text-white d-flex align-items-center">
              <i className="bi bi-chat-dots fs-5"></i>
              <Badge bg="warning" text="dark" className="ms-1">{messageNonLus}</Badge>
              <div className="ms-2">Discussion</div>
            </Nav.Link>
          </Nav.Item>

          {/* Cart */}
          <Nav.Item className="mx-2">
            <Nav.Link href="/order/detail" className="text-white d-flex align-items-center">
              <i className="bi bi-cart fs-5"></i>
              <Badge bg="warning" text="dark" className="ms-1">{cartCount}</Badge>
              <div className="ms-2">Panier</div>
            </Nav.Link>
          </Nav.Item>

          {/* User Profile */}
          <Dropdown align="end" className="mx-2">
            <Dropdown.Toggle as={Nav.Link} className="text-white d-flex align-items-center">
              <i className="bi bi-person fs-3"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.ItemText>
                <span className="d-block fw-bold">{personne.prenom} {personne.nom}</span>
                <small className="text-muted">{personne.role.nom}</small>
              </Dropdown.ItemText>
              <Dropdown.Divider />
              <Dropdown.Item href={`/user/profile-acheteur/${personne.id}`}>Mon Profil</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item href="#" onClick={handleLogout}>Se Déconnecter</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </div>
    </Navbar>
  );
}

export default HeaderUser;
