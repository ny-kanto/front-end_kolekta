import { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Navbar from "../../components/Navbar";
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';
import Message from './Message';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

function ListCommande() {
  const [commandes, setCommandes] = useState([]);
  const [idCommandeNL, setIdCommandeNL] = useState([]);
  const [idCommandeEC, setIdCommandeEC] = useState([]);
  const [commandeProduit, setCommandeProduit] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [selectedAcheteurId, setSelectedAcheteurId] = useState(null);
  const [personne, setPersonne] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("token front : ", token);
    console.log("email front : ", sessionStorage.getItem("email"));

    if (!token) {
      navigate("/login");
    }

    const fetchCommandes = async () => {
      try {
        const response = await axios.get("http://localhost:8080/commande/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const rawCommandes = response.data.data[0];
        console.log("data 0 ", response.data.data[0]);
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
          montant_ttc: commande.montantTtc
        }));
        setCommandes(transformedCommandes);

        setNoPage(response.data.data[1]);
        setTotalPages(response.data.data[2]);
        setIdCommandeNL(response.data.data[3]);
        setIdCommandeEC(response.data.data[4]);
        setCommandeProduit(response.data.data[5]);
        setPersonne(response.data.data[6]);
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
  }, [navigate, refresh, selectedAcheteurId]);

  // PAGINATION
  const handlePagination = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/commande/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
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
        montant_ttc: commande.montantTtc
      }));
      setCommandes(transformedCommandes);

      setNoPage(response.data.data[1]);
      setTotalPages(response.data.data[2]);
      setIdCommandeNL(response.data.data[3]);
      setIdCommandeEC(response.data.data[4]);
      setCommandeProduit(response.data.data[5]);
      setPersonne(response.data.data[6]);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };


  const handleOpenMessage = (acheteurId) => {
    setSelectedAcheteurId(acheteurId);

    console.log("id_acheteur: ", acheteurId);
  };

  const genererFacture = (commande) => {
    const doc = new jsPDF();

    const produitsFiltres = commandeProduit.filter(
      (produit) => produit.commande.id === commande.id_commande
    );

    var image = new Image();
    image.src = '/assets/logo.jpeg';
    image.onload = function () {
      // Calculer la largeur pour que l'image conserve ses proportions
      const aspectRatio = image.width / image.height;
      const newHeight = 20;
      const newWidth = newHeight * aspectRatio;

      // Ajouter l'image avec les nouvelles dimensions
      doc.addImage(image, 'JPEG', 20, 5, newWidth, newHeight);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Kolekta", 40, 20);

      // Ajouter le titre de la facture et les informations
      doc.setFontSize(60);
      doc.setFont("helvetica", "bold");
      doc.text("FACTURE", 20, 45);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      // Coordonnées pour le texte "Facture n°"
      const factureText = `Facture n° ${commande.num_client}`;
      const dateText = `${new Date(commande.date_commande).toLocaleDateString()}`;

      // Mesurer la largeur du texte pour ajuster la bordure
      const factureWidth = doc.getTextWidth(factureText) + 15; // ajouter une marge
      const dateWidth = doc.getTextWidth(dateText) + 15; // ajouter une marge

      // Position des textes et des bordures
      const yPosition = 55; // Position Y pour les deux textes
      const factureX = 20;  // Position X pour "Facture n°"
      const dateX = 90;     // Position X pour la date

      // Dessiner les bordures
      doc.roundedRect(factureX - 5, yPosition - 5, factureWidth, 7, 3, 3); // Bordure autour de "Facture n°"
      doc.roundedRect(dateX - 5, yPosition - 5, dateWidth, 7, 3, 3);       // Bordure autour de la date

      // Ajouter le texte "Facture n°" et la date à l'intérieur des bordures
      doc.text(factureText, factureX, yPosition);
      doc.text(dateText, dateX, yPosition);

      // Ajouter une ligne horizontale avant la section du vendeur
      doc.setDrawColor(0); // Couleur de la ligne (noir)
      doc.setLineWidth(0.5); // Épaisseur de la ligne
      doc.line(20, 65, 190, 65); // (x1, y1, x2, y2)

      // Informations sur le vendeur
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${produitsFiltres[0].produit.personne.prenom} ${produitsFiltres[0].produit.personne.nom}`, 20, 75);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`E-mail : ${produitsFiltres[0].produit.personne.utilisateur.email}`, 20, 85);
      doc.text(`Téléphone : +261 ${produitsFiltres[0].produit.personne.contact}`, 20, 95);
      doc.text(`${produitsFiltres[0].produit.personne.codePostal}, ${produitsFiltres[0].produit.personne.localisation}`, 20, 105);

      // Informations sur le client
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`${commande.prenom_client} ${commande.nom_client}`, 130, 75);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(`E-mail : ${commande.email_client}`, 130, 85);
      doc.text(`Téléphone : +261 ${commande.contact_client}`, 130, 95);
      doc.text(`${commande.code_postal_client}, ${commande.localisation_client}`, 130, 105);
      doc.text(`Adresse Livraison : ${commande.adresse_livraison}`, 130, 115);

      // Ajouter une table pour les détails de la commande
      const tableColumn = ["DESCRIPTION", "QUANTITE", "UNITE", "P U (Ar)", "TOTAL (Ar)"];
      const tableRows = [];
      let totalGlobal = 0;
      produitsFiltres.forEach((filtre) => {
        totalGlobal += Number(filtre.total);
        const produitData = [
          `${filtre.produit.nom}`,
          `${Number(filtre.quantite)}`,
          `${filtre.produit.unite.nom}`,
          `${Number(filtre.prixUnitaire)}`,
          `${Number(filtre.total)}`
        ];
        tableRows.push(produitData);
      });

      let tva = totalGlobal * 0.2;
      let ttc = totalGlobal + tva;

      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 125,
      });

      // Ajouter les totaux
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`Sous-total : ${Number(totalGlobal)} Ar`, 140, 205);
      doc.text(`TVA (20%) : ${Number(tva)} Ar`, 140, 215);
      doc.text(`TOTAL : ${Number(ttc)} Ar`, 140, 225);

      // Ajouter une ligne horizontale avant la section du vendeur
      doc.setDrawColor(0); // Couleur de la ligne (noir)
      doc.setLineWidth(0.5); // Épaisseur de la ligne
      doc.line(20, 275, 190, 275); // (x1, y1, x2, y2)

      // Ajouter le message de remerciement et les informations supplémentaires
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("MERCI DE VOTRE CONFIANCE", 105, 285, { align: "center" });
      // doc.text("123-456-7890", 105, 260, { align: "center" });
      // doc.text("hello@reallygreatsite.com", 105, 270, { align: "center" });
      // doc.text("reallygreatsite.com", 105, 280, { align: "center" });

      // Télécharger le PDF
      doc.save(`Facture_${commande.num_client}.pdf`);
    };
  };


  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <Header />
      </div>
      <div className="mt-5 mb-5">
        <Navbar />
        <div
          style={{ marginLeft: "350px" }}
        >
          <div className="min-vh-100">
            <div className="container-fluid">
              <div className="row mt-4">
                <div className="col-lg-12">

                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="card">
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Commandes</h4>
                    </div>
                    <div className="card-body">
                      <div className="row bg-light p-2 border-bottom">
                        {/* <div className="col-1 text-center"><strong>Numero</strong></div> */}
                        <div className="col-2 text-center"><strong>Client</strong></div>
                        <div className="col-2 text-center"><strong>Adresse de Livraison</strong></div>
                        <div className="col-2 text-center"><strong>Date de Commande</strong></div>
                        <div className="col-1 text-center"></div>
                        <div className="col-2 text-center"></div>
                        <div className="col-2 text-center"></div>
                      </div>

                      {/* Liste des commandes */}
                      {commandes.map((commande) => (
                        <div
                          key={commande.id_commande}
                          className="row align-items-center py-2 border-bottom"
                          style={
                            (!idCommandeNL.includes(commande.id_commande)
                              && !idCommandeEC.includes(commande.id_commande)) ? { backgroundColor: "#e1e1e1", color: "white" }
                              : {}
                          }
                        >
                          {/* <div className="col-1 text-center">
                            {commande.num_client}
                          </div> */}

                          <div className="col-2 text-center">
                            {commande.prenom_client} {commande.nom_client}
                          </div>

                          <div className="col-2 text-center">
                            {commande.adresse_livraison}
                          </div>

                          <div className="col-2 text-center">
                            {new Date(commande.date_commande).toLocaleString('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>

                          <div className="col-1 text-center">
                            <a
                              href={`/commande-produit/list/${commande.id_commande}`}
                              className="text-info text-decoration-none"
                            >
                              Détails
                            </a>
                          </div>

                          <div className="col-2 text-center">
                            <button
                              className="btn btn-info text-decoration-none position-relative"
                              style={{ color: "white" }}
                              onClick={() => handleOpenMessage(commande.id_client)}
                            >
                              Messagerie
                              {commande.message_non_lus > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                                  {commande.message_non_lus}
                                </span>
                              )}
                            </button>
                          </div>

                          <div className="col-2 text-center">
                            <button className="btn btn-success text-decoration-none" style={{ color: "white" }} onClick={() => genererFacture(commande)}>
                              Générer facture
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                      <Pagination
                        noPage={noPage}
                        totalPages={totalPages}
                        baseUrl="http://localhost:8080/commande/list"
                        onPageChange={handlePagination}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {selectedAcheteurId && (
            <Message
              acheteurId={selectedAcheteurId}
              vendeurId={personne.id}
              onClose={() => setSelectedAcheteurId(null)}
            />
          )}
          <Footer />
        </div>
      </div>

    </div >
  );
}

export default ListCommande;
