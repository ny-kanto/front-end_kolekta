/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import Loading from "./Loading";
import Pagination from "./Pagination";
import { Switch } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CommandeProduit = ({
    commandes,
    error,
    noPage,
    totalPages,
    handlePagination,
    count,
    countLivree,
    countNonLivree,
    countEnCours,
    handleStatusChange,
    handleToggleStatus,
    handleCheckDelivered,
    status
}) => {
    const navigate = useNavigate();

    if (!commandes) {
        return <Loading />;
    }

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-12">
                    <h4>Vos Commandes</h4>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <div className="d-flex justify-content-end mt-3 mb-4">
                <Pagination
                    noPage={noPage}
                    totalPages={totalPages}
                    baseUrl={`http://localhost:8080/commande/list-produit/${commandes.id_commande}`}
                    onPageChange={handlePagination}
                />
            </div>

            {/* Navigation avec nav-tabs de Bootstrap */}
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a
                        className={`nav-link text-black ${status === -1 ? 'active' : ''}`}
                        href="#"
                        onClick={() => handleStatusChange(-1)}
                    >
                        Tous ({count})
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link text-black ${status === 0 ? 'active' : ''}`}
                        href="#"
                        onClick={() => handleStatusChange(0)}
                    >
                        Non livrée ({countNonLivree})
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link text-black ${status === 1 ? 'active' : ''}`}
                        href="#"
                        onClick={() => handleStatusChange(1)}
                    >
                        En cours ({countEnCours})
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link text-black ${status === 11 ? 'active' : ''}`}
                        href="#"
                        onClick={() => handleStatusChange(11)}
                    >
                        Livrée ({countLivree})
                    </a>
                </li>
            </ul>

            <div className="row bg-light p-2">
                <div className="col-1"></div>
                <div className="col-1"></div>
                <div className="col-3">
                    <strong>Produit</strong>
                </div>
                <div className="col-2 text-center">
                    <strong>P U (Ar)</strong>
                </div>
                <div className="col-2 text-center">
                    <strong>Quantité</strong>
                </div>
                <div className="col-2 text-center">
                    <strong>Total (Ar)</strong>
                </div>
            </div>

            {commandes.map((commande, index) => (
                <div
                    className="row py-3 border-bottom align-items-center"
                    style={commande.status === 11 ? { backgroundColor: "#e1e1e1", color: "white" } : {}}
                    key={index}
                >

                    <div className="col-1 text-center">
                        {(commande.status === 1 || commande.status === 11) && (
                            <input
                                type="checkbox"
                                onChange={() => handleCheckDelivered(commande.id_commande, commande.id_produit)}
                                checked={commande.status === 11}
                            />
                        )}
                    </div>


                    <div className="col-1 text-center">
                        {commande.status <= 1 && (
                            <>
                                <Switch
                                    checked={commande.status === 1}
                                    onChange={() => handleToggleStatus(commande.id_commande, commande.id_produit)}
                                    color="primary"
                                />
                            </>
                        )}
                    </div>
                    <div className="col-3 d-flex">
                        <div style={{ width: "100px", height: "100px", marginRight: "20px" }}>
                            <img
                                src={`data:${commande.photoMimeType};base64,${commande.photoBase64}`}
                                alt={commande.nom_produit}
                                className="img-fluid object-fit-cover"
                                style={{ width: "100%", height: "100%" }}
                            />
                        </div>
                        <div>
                            <h6 className="text-uppercase">
                                {commande.nom_produit} ({commande.unite})
                            </h6>
                        </div>
                    </div>
                    {commande.prix_produit ? (
                        <div className="col-2 text-center">{commande.prix_produit.toLocaleString('fr-FR')}</div>
                    ) : (
                        <div className="col-2 text-center">{commande.prix_produit}</div>
                    )}
                    {commande.quantite ? (
                        <div className="col-2 text-center">{commande.quantite.toLocaleString('fr-FR')}</div>
                    ) : (
                        <div className="col-2 text-center">{commande.quantite}</div>
                    )}
                    {commande.total ? (
                        <div className="col-2 text-center">{commande.total.toLocaleString('fr-FR')}</div>
                    ) : (
                        <div className="col-2 text-center">{commande.total}</div>
                    )}
                </div>
            ))}

            <div className="row mt-4">
                <div className="d-flex justify-content-start">
                    <button
                        type="button"
                        className="btn btn-info bg-gradient text-white"
                        onClick={() => navigate(-1)}
                    >
                        Retour
                    </button>
                </div>
            </div>

        </div>
    );
};

export default CommandeProduit;
