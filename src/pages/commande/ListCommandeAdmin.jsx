import { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from '../../components/Footer';
import { Badge } from 'react-bootstrap';
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import HeaderAdmin from '../../components/HeaderAdmin';
import NavbarAdmin from '../../components/NavbarAdmin';

function ListCommandeAdmin() {
  const [commandes, setCommandes] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("token front : ", token);
    console.log("email front : ", sessionStorage.getItem("email"));

    if (!token) {
      navigate("/login");
    }

    const fetchCommandes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/commande/list-admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("data 0 : ", response.data.data[0]);

        const rawCommandes = response.data.data[0];
        const transformedCommandes = rawCommandes.map(commande => ({
          id_commande: commande.id,
          adresse_livraison: commande.adresseLivraison,
          date_commande: commande.dateCommande,
          id_client: commande.personne.id,
          nom_client: commande.personne.nom,
          prenom_client: commande.personne.prenom,
          num_client: commande.numClient,
          email_client: commande.personne.utilisateur.email,
          contact_client: commande.personne.contact,
          localisation_client: commande.personne.localisation,
          code_postal_client: commande.personne.codePostal,
          message_non_lus: commande.messageNonLus,
          montant_total: commande.montantTotal,
          montant_tva: commande.montantTva,
          montant_ttc: commande.montantTtc,
          status: commande.status,
          reference: commande.reference
        }));
        setCommandes(transformedCommandes);
        console.log("transformed Commandes : ", transformedCommandes);
        setNoPage(response.data.data[1]);
        setTotalPages(response.data.data[2]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error("An error occurred:", error);
          navigate("/error/403");
        } else if (error.response && error.response.status === 404) {
          console.error("An error occurred:", error);
          navigate("/error/404");
        } else {
          setError(error.message);
        }
      }
    };

    fetchCommandes();
  }, [navigate, refresh]);

  // PAGINATION
  const handlePagination = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/commande/list-admin?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("data 0 : ", response.data.data[0]);

      const rawCommandes = response.data.data[0];
      const transformedCommandes = rawCommandes.map(commande => ({
        id_commande: commande.id,
        adresse_livraison: commande.adresseLivraison,
        date_commande: commande.dateCommande,
        id_client: commande.personne.id,
        num_client: commande.numClient,
        nom_client: commande.personne.nom,
        prenom_client: commande.personne.prenom,
        email_client: commande.personne.utilisateur.email,
        contact_client: commande.personne.contact,
        localisation_client: commande.personne.localisation,
        code_postal_client: commande.personne.codePostal,
        message_non_lus: commande.messageNonLus,
        montant_total: commande.montantTotal,
        montant_tva: commande.montantTva,
        montant_ttc: commande.montantTtc,
        status: commande.status,
        reference: commande.reference
      }));
      setCommandes(transformedCommandes);
      console.log("transformed Commandes : ", transformedCommandes);
      setNoPage(response.data.data[1]);
      setTotalPages(response.data.data[2]);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  const handleCheckDelivered = async (commandeId) => {

    const newEtat = commandes.find(
      (commande) => commande.id_commande === commandeId
    ).status === 1 ? 0 : 1;

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(`http://localhost:8080/commande/update_status-admin/${commandeId}?etat=${newEtat}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        setCommandes((prevCommandes) =>
          prevCommandes.map((commande) =>
            commande.id_commande === commandeId
              ? { ...commande, status: newEtat }
              : commande
          )
        );
        setRefresh(!refresh);
      } else {
        console.error('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderAdmin />
      </div>
      <div className="mt-5 mb-5">
        <NavbarAdmin />
        <div
          style={{ marginLeft: "350px" }}
        >
          <div className="min-vh-100">
            <div className="container-fluid">
              <div className="row mt-4">
                <div className="col-lg-12">

                  <div className="card">
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Commandes</h4>
                    </div>
                    <div className="card-body">
                      <div className="row bg-light p-2 border-bottom">
                        <div className="col text-center"><strong>Etat de Paiement</strong></div>
                        <div className="col text-center"><strong>Client</strong></div>
                        <div className="col text-center"><strong>Adresse de Livraison</strong></div>
                        <div className="col text-center"><strong>Date de Commande</strong></div>
                        <div className="col text-center"><strong>Référence de Paiement</strong></div>
                      </div>

                      {/* Liste des commandes */}
                      {commandes.map((commande, index) => (
                        <div
                          className="row py-3 border-bottom align-items-center"
                          // style={commande.status === 1 ? { backgroundColor: "#e1e1e1", color: "white" } : {}}
                          key={index}
                        >

                          <div className="col text-center">
                            {/* <input
                              type="checkbox"
                              onChange={() => handleCheckDelivered(commande.id_commande)}
                              checked={commande.status === 1}
                            /> */}
                            {commande.status == 1 ? (
                              <strong><Badge bg="success" text="white" className="ms-1 btn" onClick={() => handleCheckDelivered(commande.id_commande)}>Validé</Badge></strong>
                            ) : (
                              <strong><Badge bg="danger" text="white" className="ms-1 btn" onClick={() => handleCheckDelivered(commande.id_commande)}>Non Validé</Badge></strong>
                            )}
                            
                          </div>

                          <div className="col text-center">
                            {commande.prenom_client} {commande.nom_client}
                          </div>

                          <div className="col text-center">
                            {commande.adresse_livraison}
                          </div>

                          <div className="col text-center">
                            {new Date(commande.date_commande).toLocaleString('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>

                          <div className="col text-center">
                            {commande.reference}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                      <Pagination
                        noPage={noPage}
                        totalPages={totalPages}
                        baseUrl="http://localhost:8080/commande/list-admin"
                        onPageChange={handlePagination}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div >
  );
}

export default ListCommandeAdmin;
