import { useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleRetour = async () => {
        const token = sessionStorage.getItem("token");
        const adresseLivraison = sessionStorage.getItem("adresse_livraison");
        const fetchSaveCommande = async () => {
            if (!token) {
                navigate("/login");
                return;
            }

            try {
                await axios.post("http://localhost:8080/panier/save-commande", {}, {
                    params: {
                        adresse_livraison: adresseLivraison
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true
                });
                console.log("Commande enregistrée avec succès");

            } catch (error) {
                console.error("Il y a eu une erreur lors de l'enregistrement de la commande!", error);
            }
        };
        await fetchSaveCommande();
        sessionStorage.removeItem("adresse_livraison");
        navigate("/product-user/list");
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '50px', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#10B981', color: '#fff', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        ✓
                    </div>
                </div>
                <h1>Merci pour votre paiement</h1>
                <p>Un paiement en faveur de <strong>Stripe</strong> apparaîtra sur votre relevé.</p>
                <button
                    onClick={handleRetour}
                    style={{
                        backgroundColor: '#10B981',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }}>
                    Retour
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;
