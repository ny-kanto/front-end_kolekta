import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Loading from "../../components/Loading";

function Entree() {
  const [produits, setProduits] = useState([]);

  const [newEntree, setNewEntree] = useState({
    produit: { id: '' },
    quantite: '',
    dateEntree: ''
  });

  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchProduits = async () => {
      try {
        const response = await axios.get("http://localhost:8080/produit/all-product", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const rawProduits = response.data.data[0];
        const transformedProduits = rawProduits.map((produit) => ({
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          description: produit.description,
          minCommande: produit.minCommande,
          delaisLivraison: produit.delaisLivraison,
          id_unite: produit.unite.id,
          nom_unite: produit.unite.nom,
          id_categorie: produit.categorie.id,
          nom_categorie: produit.categorie.nom,
        }));
        setProduits(transformedProduits);
        console.log(response.data.data[0]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/error/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/error/404");
        } else {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchProduits();
  }, [navigate, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("id_produit", newEntree.produit.id);
    formDataToSend.append("quantite", newEntree.quantite);
    formDataToSend.append("date_entree", newEntree.dateEntree);

    console.log(formDataToSend);
    try {
      const response = await axios.post(
        "http://localhost:8080/stock/entree",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Réponse ", response.data);

      if (response.status === 200) {
        alert("Produit entrée dans le stock");
        setNewEntree({ produit: { id: '' }, quantite: '', dateEntree: '' });
      } else {
        alert("Erreur lors de l'entrée");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'produit') {
      setNewEntree({ ...newEntree, produit: { id: value } });
    } else {
      setNewEntree({ ...newEntree, [name]: value });
    }
  };

  if (!produits) {
    return <Loading />
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <Header />
      </div>
      <div className="mt-5 mb-5">
        <Navbar />
        <div className="mt-5" style={{ marginLeft: "350px" }} >
          <div className="min-vh-100">
            <div className="container-fluid">
              <div className="w-70 mt-5 p-5" style={{ border: "2px solid #ccc", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", }} >
                <h2 className="text-center mb-4">Entrée</h2>

                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-5">
                    <div className="row mb-4" style={{ width: "fit-content" }}>
                      <div className="col">
                        <h2>Entrée du produit</h2>
                      </div>
                    </div>

                    <div className="row mb-4 mt-1">
                      <div className="col-md-12">
                        <label>Produit</label>
                        <select
                          className="form-control"
                          name="produit"
                          value={newEntree.produit.id}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Sélectionnez votre produit</option>
                          {produits.map((produit) => (
                            <option key={produit.id} value={produit.id}>
                              {produit.nom} ({produit.nom_unite})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row g-3 mt-1">
                      <div className="col-sm-6">
                        <div className="input-group input-group-merge">
                          <div className="form-floating form-floating-outline">
                            <input
                              type="number"
                              className="form-control"
                              id="quantite"
                              name="quantite"
                              placeholder="Quantite"
                              value={newEntree.quantite}
                              onChange={handleInputChange}
                              required
                            />
                            <label htmlFor="password">Quantite</label>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-floating form-floating-outline">
                          <input
                            type="date"
                            className="form-control"
                            id="dateEntree"
                            name="dateEntree"
                            placeholder="Date d'entrée"
                            value={newEntree.dateEntree}
                            onChange={handleInputChange}
                            required
                          />
                          <label htmlFor="dateEntree">Date d&apos;entrée</label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-success">
                      VALIDER
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Entree;
