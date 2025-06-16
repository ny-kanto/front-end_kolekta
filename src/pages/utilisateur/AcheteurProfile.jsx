import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import HeaderUser from '../../components/HeaderUser';

const AcheteurProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [personne, setPersonne] = useState({
    id: "",
    nom: "",
    prenom: "",
    contact: "",
    localisation: "",
    codePostal: "",
    role: { id: "", nom: "" },
    utilisateur: { id: "", email: "", password: "", isAdmin: "", pseudo: "", dateInscription: "" },
    typeProduction: { id: "", nom: "" },
  });

  useEffect(() => {
    const fetchDataProfile = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/user/profile-acheteur/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("data 0 : " + response.data.data[0]);

        if (response.status === 200) {
          setPersonne(response.data.data[0]);
        }
      } catch (error) {
        console.error("Error fetching profile :", error);
      }
    };

    fetchDataProfile();
  }, [id]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderUser />
      </div>
      <div className="container mt-5 mb-5">
        <div className="">
          {/* Flèche de retour */}
          <div className="position-absolute" style={{ top: '70px', left: '20px' }}>
            <i
              className="bi bi-arrow-left fs-3"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(-1)}
            ></i>
          </div>
          <div className="card-header d-flex justify-content-between align-items-center bg-light mb-5" style={{
            border: "none",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "20px 20px 20px 20px",
            borderRadius: "10px"
          }}>
            <div>
              <h2 className="mb-0">{personne.prenom} {personne.nom}</h2>
              <p className="text-muted">Date d&apos;inscription : {new Date(personne.utilisateur.dateInscription).toLocaleString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          <div className="card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4" style={{
                  border: "none",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}>
                  <div className="card-body">
                    <div className='mb-4'>
                      <h5 className="text-uppercase" style={{ fontSize: "17px", letterSpacing: "1px", marginBottom: "10px", opacity: "0.6" }}>À propos</h5>
                      <p><strong>Nom:</strong> {personne.nom}</p>
                      <p><strong>Prénom:</strong> {personne.prenom}</p>
                      <p><strong>Rôle:</strong> {personne.role.nom}</p>
                      <p><strong>Localisation:</strong> <FontAwesomeIcon icon={faMapMarkerAlt} /> {personne.codePostal}, {personne.localisation}</p>
                    </div>

                    <div>
                      <h5 className="text-uppercase" style={{ fontSize: "17px", letterSpacing: "1px", marginBottom: "10px", opacity: "0.6" }}>Contacts</h5>
                      <p><FontAwesomeIcon icon={faPhone} /> +261 {personne.contact}</p>
                      <p><FontAwesomeIcon icon={faEnvelope} /> {personne.utilisateur.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AcheteurProfile;
