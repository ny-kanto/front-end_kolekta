/* eslint-disable react/prop-types */
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Loading from './Loading';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
// import SockJS from 'sockjs-client';
// import { over } from 'stompjs';

const stripePromise = loadStripe('pk_test_51PzdXHP9aFNqJB143LDifNXBs64NFDborMhWlid9lXHJADhNbf5cqSPZHriljO01rfY7LckxDq4rsrm8iP9fP6ni00yS7KPeUJ');

const Order = ({ orders, onQuantityChange, onRemoveProduct, error, totalGlobal, tvaGlobal, ttc, personne }) => {
    const navigate = useNavigate();
    const [address, setAddress] = useState("");
    const [addressError, setAddressError] = useState(false);

    if (!orders) {
        return <Loading />
    }

    const handlePaiement = async (e) => {
        e.preventDefault();

        if (address.trim() === "") {
            setAddressError(true);
            return;
        }
        setAddressError(false);
        sessionStorage.setItem("adresse_livraison", address);

        const stripe = await stripePromise;
        try {
            const token = sessionStorage.getItem("token");

            const response = await axios.post("http://localhost:8080/panier/checkout-payment",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

            console.log("response paiement : " + response.data.data);

            // Redirection vers Stripe Checkout
            const { error } = await stripe.redirectToCheckout({
                sessionId: response.data.data,
            });


            if (error) {
                console.error('Error during Stripe Checkout:', error);
            } else {
                // let sock = new SockJS('http://localhost:8080/ws');
                // let stompClient = over(sock);

                // stompClient.connect({}, (frame) => {
                //     console.log("Connected: " + frame);
                //     orders.map((order) => {
                //         let chatMessage = {
                //             senderName: personne.nom,
                //             receiverName: order.vendeur.nom,
                //             message: 'Vous avez reçu une nouvelle commande',
                //             date: new Date().toISOString()
                //         };

                //         stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
                //         console.log("Message envoyé au vendeur");
                //     });
                // });
            }


        } catch (error) {
            console.error("Erreur lors de l'envoi des données :", error);
        }
    };

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-12">
                    <h4>Votre Panier</h4>
                </div>
            </div>

            {/* Champ d'adresse de livraison */}
            <div className="mb-4">
                <label htmlFor="address" className="form-label">Adresse de livraison</label>
                <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Entrez votre adresse de livraison"
                    required
                />
                {addressError && (
                    <div className="alert alert-danger mt-2" role='alert'>
                        Veuillez entrer une adresse de livraison.
                    </div>
                )}
            </div>

            {error && (
                <div className="alert alert-danger mt-3" role="alert">
                    {error}
                </div>
            )}

            <div className="row bg-light p-2">
                <div className="col-6"><strong>Produit</strong></div>
                <div className="col-2 text-center"><strong>Prix Unitaire (Ar)</strong></div>
                <div className="col-1 text-center"><strong>Quantité</strong></div>
                <div className="col-1 text-center"><strong>Total (Ar)</strong></div>
            </div>

            {orders.map((order, index) => (
                <div className="row py-3 border-bottom align-items-center" key={index}>
                    <div className="col-6 d-flex">
                        <img src={`data:${order.photoMimeType};base64,${order.photoBase64}`} alt={order.nom_produit} className="img-fluid object-fit-cover" style={{ maxWidth: '80px', marginRight: '20px' }} />
                        <div>
                            <h6 className='text-uppercase'>{order.nom_produit}</h6>
                            <a className='text-primary text-decoration-none' href={`/user/profile-vendeur-acheteur/${order.id_vendeur}`}>Vendeur : {order.prenom_vendeur} {order.nom_vendeur}</a>
                        </div>
                    </div>
                    <div className="col-2 text-center">{order.prix_produit.toLocaleString('fr-FR')}</div>
                    <div className="col-1 text-center">
                        <div className="d-flex justify-content-center align-items-center">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => onQuantityChange(order.id_produit, order.quantite - 1)}
                                disabled={order.quantite <= 1}
                            >
                                <FontAwesomeIcon icon={faMinus} />
                            </button>
                            <span className="mx-2">{order.quantite}</span>
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => onQuantityChange(order.id_produit, order.quantite + 1)}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                    </div>
                    <div className="col-1 text-center">{order.total.toLocaleString('fr-FR')}</div>
                    <div className='ms-5 w-auto d-flex justify-content-end' style={{ marginBottom: "75px" }}>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onRemoveProduct(order.id_produit)}
                        >
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                </div>
            ))}

            <div className="row pt-4 mt-4 justify-content-end">
                <div className="col-3 offset-1">
                    <p className="d-flex justify-content-between">
                        <strong>Prix HT (Ar) :</strong>
                        {totalGlobal ? (
                            <strong>{totalGlobal.toLocaleString('fr-FR')}</strong>
                        ) : (
                            <strong>{totalGlobal}</strong>
                        )}
                    </p>
                    <p className="d-flex justify-content-between">
                        <strong>Prix TVA (Ar) :</strong>
                        {tvaGlobal ? (
                            <strong>{tvaGlobal.toLocaleString('fr-FR')}</strong>
                        ) : (
                            <strong>{tvaGlobal}</strong>
                        )}
                    </p>
                    <hr />
                    <p className="d-flex justify-content-between">
                        <strong>Prix TTC (Ar) :</strong>

                        {error && (
                            <div className="alert alert-danger mt-3" role="alert">
                                {error}
                            </div>
                        )}

                        {ttc ? (
                            <strong>{ttc.toLocaleString('fr-FR')}</strong>
                        ) : (
                            <strong>{ttc}</strong>
                        )}
                    </p>
                </div>
            </div>

            <div className="row mt-4">
                <div className="d-flex justify-content-between">
                    <div className="col-4 text-end">
                        <button
                            type="button"
                            className="btn btn-info bg-gradient text-white"
                            onClick={() => navigate(-1)}
                        >
                            Retour
                        </button>
                    </div>
                    <div className="col-4 text-end" onClick={handlePaiement}>
                        <a className='btn btn-success' style={{ textDecoration: "none", color: "white" }}>Accéder au paiement</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
