import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
    const navigate = useNavigate();
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
            <div style={{ flex: 1, textAlign: 'center', padding: '50px', backgroundColor: '#F9FAFB' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#ea313c', color: '#fff', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        ✕
                    </div>
                </div>
                <h1>Le paiement a échoué</h1>
                <p>Malheureusement, votre paiement n&apos;a pas pu être traité. Veuillez réessayer.</p>
                <button
                    style={{
                        backgroundColor: '#ea313c',
                        color: '#fff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px'
                    }} onClick={() => navigate("/order/detail")} >
                    Retour
                </button>
            </div>
        </div>
    );
};

export default PaymentFailure;
