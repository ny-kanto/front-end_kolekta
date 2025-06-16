import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import CommandeProduit from "../../components/CommandeProduit";

function ListCommandeProduit() {
    const { idCommande } = useParams();
    const [commandes, setCommandes] = useState([]);
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [error, setError] = useState("");
    const [noPage, setNoPage] = useState();
    const [totalPages, setTotalPages] = useState();
    const [count, setCount] = useState(0);
    const [countLivree, setCountLivree] = useState(0);
    const [countNonLivree, setCountNonLivree] = useState(0);
    const [countEnCours, setCountEnCours] = useState(0);
    const [status, setStatus] = useState(-1);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        console.log("token front : ", token);
        console.log("email front : ", sessionStorage.getItem("email"));

        if (!token) {
            navigate("/login");
        }

        const fetchCommandes = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/commande/list-produit/${idCommande}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                console.log("data 0 : ", response.data.data[0]);
                const rawTempCommandes = response.data.data[0];
                const produitPhotos = response.data.data[1];

                const transformedCommandes = rawTempCommandes.map((commande) => {
                    const photo = produitPhotos[commande.id] || {};

                    return {
                        id_commande: commande.id_commande,
                        id_produit: commande.id,
                        nom_produit: commande.nom,
                        prix_produit: commande.prix,
                        quantite: commande.quantite,
                        total: commande.total,
                        unite: commande.unite,
                        nom_vendeur: commande.nom_vendeur,
                        prenom_vendeur: commande.prenom_vendeur,
                        pseudo_vendeur: commande.pseudo_vendeur,
                        email_vendeur: commande.email_vendeur,
                        contact_vendeur: commande.contact_vendeur,
                        id_acheteur: commande.id_acheteur,
                        nom_acheteur: commande.nom_acheteur,
                        prenom_acheteur: commande.prenom_acheteur,
                        pseudo_acheteur: commande.pseudo_acheteur,
                        email_acheteur: commande.email_acheteur,
                        contact_acheteur: commande.contact_acheteur,
                        status: commande.status,
                        photoBase64: photo.base64 || "",
                        photoMimeType: photo.mimeType || "",
                    };
                });

                console.log("transformed Commandes : ", transformedCommandes);

                setCommandes(transformedCommandes);
                setNoPage(response.data.data[3]);
                setTotalPages(response.data.data[4]);
                setCount(response.data.data[5]);
                setCountLivree(response.data.data[6]);
                setCountNonLivree(response.data.data[7]);
                setCountEnCours(response.data.data[8]);
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
    }, [navigate, refresh, idCommande]);

    if (!commandes) {
        return <Loading />;
    }

    // PAGINATION
    const handlePagination = async (pageNumber) => {
        try {
            const token = sessionStorage.getItem("token");
            const params = new URLSearchParams({
                noPage: pageNumber,
                status: status
            });

            const response = await axios.get(`http://localhost:8080/commande/list-produit/${idCommande}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log("data 0 : ", response.data.data[0]);
            const rawTempCommandes = response.data.data[0];
            const produitPhotos = response.data.data[1];

            const transformedCommandes = rawTempCommandes.map((commande) => {
                const photo = produitPhotos[commande.id] || {};

                return {
                    id_commande: commande.id_commande,
                    id_produit: commande.id,
                    nom_produit: commande.nom,
                    prix_produit: commande.prix,
                    quantite: commande.quantite,
                    total: commande.total,
                    unite: commande.unite,
                    nom_vendeur: commande.nom_vendeur,
                    prenom_vendeur: commande.prenom_vendeur,
                    pseudo_vendeur: commande.pseudo_vendeur,
                    email_vendeur: commande.email_vendeur,
                    contact_vendeur: commande.contact_vendeur,
                    id_acheteur: commande.id_acheteur,
                    nom_acheteur: commande.nom_acheteur,
                    prenom_acheteur: commande.prenom_acheteur,
                    pseudo_acheteur: commande.pseudo_acheteur,
                    email_acheteur: commande.email_acheteur,
                    contact_acheteur: commande.contact_acheteur,
                    status: commande.status,
                    photoBase64: photo.base64 || "",
                    photoMimeType: photo.mimeType || "",
                };
            });

            console.log("transformed Commandes : ", transformedCommandes);

            setCommandes(transformedCommandes);
            setNoPage(response.data.data[3]);
            setTotalPages(response.data.data[4]);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {

        try {
            const token = sessionStorage.getItem("token");
            const params = new URLSearchParams({
                noPage: 1,
                status: newStatus
            });

            const response = await axios.get(`http://localhost:8080/commande/list-produit/${idCommande}?${params.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            console.log("data 0 : ", response.data.data[0]);
            const rawTempCommandes = response.data.data[0];
            const produitPhotos = response.data.data[1];

            const transformedCommandes = rawTempCommandes.map((commande) => {
                const photo = produitPhotos[commande.id] || {};

                return {
                    id_commande: commande.id_commande,
                    id_produit: commande.id,
                    nom_produit: commande.nom,
                    prix_produit: commande.prix,
                    quantite: commande.quantite,
                    total: commande.total,
                    unite: commande.unite,
                    nom_vendeur: commande.nom_vendeur,
                    prenom_vendeur: commande.prenom_vendeur,
                    pseudo_vendeur: commande.pseudo_vendeur,
                    email_vendeur: commande.email_vendeur,
                    contact_vendeur: commande.contact_vendeur,
                    id_acheteur: commande.id_acheteur,
                    nom_acheteur: commande.nom_acheteur,
                    prenom_acheteur: commande.prenom_acheteur,
                    pseudo_acheteur: commande.pseudo_acheteur,
                    email_acheteur: commande.email_acheteur,
                    contact_acheteur: commande.contact_acheteur,
                    status: commande.status,
                    photoBase64: photo.base64 || "",
                    photoMimeType: photo.mimeType || "",
                };
            });

            console.log("transformed Commandes : ", transformedCommandes);

            setCommandes(transformedCommandes);
            setNoPage(response.data.data[3]);
            setTotalPages(response.data.data[4]);

            setStatus(newStatus);
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    };

    const handleToggleStatus = async (commandeId, produitId) => {
        const newStatus = commandes.find(
            (commande) => commande.id_commande === commandeId && commande.id_produit === produitId
        ).status === 1 ? 0 : 1;

        try {

            const token = sessionStorage.getItem("token");
            const response = await axios.put(`http://localhost:8080/commande/update_status/${commandeId}/${produitId}?status=${newStatus}`,
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
                        commande.id_commande === commandeId && commande.id_produit === produitId
                            ? { ...commande, status: newStatus }
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


    const handleCheckDelivered = async (commandeId, produitId) => {

        const newStatus = commandes.find(
            (commande) => commande.id_commande === commandeId && commande.id_produit === produitId
        ).status === 11 ? 1 : 11;

        try {

            const token = sessionStorage.getItem("token");
            const response = await axios.put(`http://localhost:8080/commande/update_status/${commandeId}/${produitId}?status=${newStatus}`,
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
                        commande.id_commande === commandeId && commande.id_produit === produitId
                            ? { ...commande, status: newStatus }
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
                <Header />
            </div>
            <div className="mt-5 mb-5">
                <Navbar />
                <div
                    style={{ marginLeft: "350px" }}
                >
                    <div className="min-vh-100 mb-4">
                        <CommandeProduit
                            commandes={commandes}
                            error={error}
                            noPage={noPage}
                            totalPages={totalPages}
                            handlePagination={handlePagination}
                            count={count}
                            countLivree={countLivree}
                            countNonLivree={countNonLivree}
                            countEnCours={countEnCours}
                            handleStatusChange={handleStatusChange}
                            handleToggleStatus={handleToggleStatus}
                            handleCheckDelivered={handleCheckDelivered}
                            status={status}
                        />
                    </div>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

export default ListCommandeProduit;
