import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Stepper from "../../components/Stepper";
import axios from "axios";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import logo from "/assets/logo.jpeg";
import "../../assets/login.css";

function SignupForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    password: "",
    pass: "",
    nom: "",
    prenom: "",
    contact: "",
    code: "",
    adresse: "",
    role: "",
    typeProduction: "",
    dateNaissance: "",
  });

  const [role, setRole] = useState("");
  const [typeProduction, setTypeProduction] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    { title: "Compte", subtitle: "Détails du compte" },
    { title: "Personnel", subtitle: "Entrer information" },
    { title: "Profil", subtitle: "Détails du profil" },
  ];

  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "code") {
      let formattedValue = value.replace(/\D/g, ""); // Enlever tout sauf les chiffres

      // Limiter la saisie à 3 chiffres
      if (formattedValue.length > 3) {
        formattedValue = formattedValue.slice(0, 3);
      }

      // Mettre à jour l'état avec la valeur formatée
      setFormData({ ...formData, [name]: formattedValue });
    } else if (name === "contact") {
      let formattedValue = value.replace(/\D/g, ""); // Enlever tout sauf les chiffres

      // Limiter la saisie à 9 chiffres
      if (formattedValue.length > 9) {
        formattedValue = formattedValue.slice(0, 9);
      }

      // Ajouter les espaces après chaque groupe de chiffres
      formattedValue = formattedValue.replace(
        /(\d{2})(\d{2})(\d{3})(\d{2})/,
        "$1 $2 $3 $4"
      );

      // Mettre à jour l'état avec la valeur formatée
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Vérification des mots de passe
    if (name === "password" || name === "pass") {
      const updatedPassword = name === "password" ? value : formData.password;
      const updatedPass = name === "pass" ? value : formData.pass;

      console.log("password ", updatedPassword);
      console.log("pass ", updatedPass);

      if (updatedPassword !== updatedPass) {
        setPasswordError("Les mots de passe ne correspondent pas");
      } else {
        setPasswordError("");
      }
    }

    // Gestion du rôle et du type de production
    if (name === "role") {
      if (value === "1" || value === "") {
        setTypeProduction("");
        formData.typeProduction = typeProduction;
      }
      setRole(e.target.value);
      formData.role = role;
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const nextStep = () => setStep(step + 1);

  const prevStep = () => setStep(step - 1);

  const navigate = useNavigate();

  const [typeProductions, setTypeProductions] = useState([]);

  useEffect(() => {
    const fetchTypeProduction = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/type-production/all",
          {}
        );
        const rawType = response.data.data[0];
        const transformedType = rawType.map((type) => ({
          id: type.id,
          nom: type.nom,
        }));
        setTypeProductions(transformedType);

        console.log(response.data.data[0]);
      } catch (error) {
        console.error("Il y a eu une erreur!", error);
      }
    };

    fetchTypeProduction();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("nom", formData.nom);
    formDataToSend.append("prenom", formData.prenom);
    formDataToSend.append("pseudo", formData.pseudo);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("date_naissance", formData.dateNaissance);
    formDataToSend.append("code_postal", formData.code);
    formDataToSend.append("id_role", formData.role);
    formDataToSend.append("id_type_production", formData.typeProduction || "0");
    formDataToSend.append("contact", formData.contact);
    formDataToSend.append("localisation", formData.adresse);

    console.log(formDataToSend);
    try {
      const response = await axios.post(
        "http://localhost:8080/user/signup",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Réponse ", response.data);

      if (response.status === 200) {
        alert("Inscription réussie !");
        navigate("/login");
      } else {
        alert("Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container mt-5 mb-5 d-flex justify-content-center">
        <div
          className="w-70 mt-5 p-5"
          style={{
            border: "2px solid #ccc",
            borderRadius: "10px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(255, 255, 255, 0.5)"
          }}
        >
          {/* Branding Section */}
          <div className="text-center mb-4">
            <img src={logo} alt="Kolekta Logo" style={{ height: "100px" }} />
            <h2 className="mt-2" style={{ fontWeight: "bold" }}>Kolekta</h2>
          </div>

          {/* <h2 className="text-center mb-4">Inscription</h2> */}

          {/* Stepper */}
          <Stepper steps={steps} currentStep={step} />

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="form-group mb-5">
                {/* Step 1 Content */}
                <div className="row" style={{ width: "fit-content" }}>
                  <div className="col">
                    <h2>Détails du compte</h2>
                  </div>
                </div>
                <div className="row g-3 mt-1">
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        className="form-control"
                        id="pseudo"
                        name="pseudo"
                        placeholder="Pseudo"
                        value={formData.pseudo}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="pseudo">Pseudo</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="email">E-mail</label>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-sm-6">
                    <div className="input-group input-group-merge">
                      <div className="form-floating form-floating-outline">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          name="password"
                          placeholder="Mot de passe"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="password">Mot de passe</label>
                      </div>
                      <span
                        className="input-group-text"
                        onClick={toggleShowPassword}
                        style={{ cursor: "pointer" }}
                      >
                        <i
                          className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"
                            }`}
                          aria-hidden="true"
                        ></i>
                      </span>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="password"
                        className="form-control"
                        id="pass"
                        name="pass"
                        placeholder="Confirmer Mot de passe"
                        value={formData.pass}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="pass">Confirmer Mot de passe</label>
                    </div>
                    {passwordError && (
                      <div className="text-danger mt-2">{passwordError}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="form-group">
                {/* Step 2 Content */}
                <div className="row" style={{ width: "fit-content" }}>
                  <div className="col">
                    <h2>Entrer information</h2>
                  </div>
                </div>
                <div className="row g-3 mt-1">
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        className="form-control"
                        id="nom"
                        name="nom"
                        placeholder="Nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="nom">Nom</label>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        className="form-control"
                        id="prenom"
                        name="prenom"
                        placeholder="Prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="prenom">Prenom</label>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="date"
                        id="dateNaissance"
                        name="dateNaissance"
                        className="form-control"
                        placeholder="Date de naissance"
                        value={formData.dateNaissance}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="dateNaissance">Date de naissance</label>
                    </div>
                  </div>
                </div>

                <div className="row g-3 mt-1">
                  <div className="col-sm-6">
                    <div className="input-group input-group-merge">
                      <span className="input-group-text">MG (+261)</span>
                      <div className="form-floating form-floating-outline">
                        <input
                          type="tel"
                          id="contact"
                          name="contact"
                          className="form-control"
                          placeholder="XX XX XXX XX"
                          value={formData.contact}
                          onChange={handleInputChange}
                          required
                        />
                        <label htmlFor="contact">Mobile ex: 34 00 000 00</label>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        className="form-control"
                        id="code"
                        name="code"
                        placeholder="Code Postal"
                        value={formData.code}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="code">Code Postal ex: 101</label>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="form-floating form-floating-outline">
                      <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        className="form-control"
                        placeholder="Adresse"
                        value={formData.adresse}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="adresse">Adresse</label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="form-group">
                {/* Step 3 Content */}
                <div className="row" style={{ width: "fit-content" }}>
                  <div className="col">
                    <h2>Détails du profil</h2>
                  </div>
                </div>
                <div className="row mb-4">
                  <div
                    className="col-md text-center"
                    style={{ flex: "1", width: "300px", height: "200px" }}
                  >
                    <div
                      className="form-check"
                      style={{
                        border: "2px solid #007bff",
                        borderRadius: "10px",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      <div style={{ padding: "10px" }}>
                        <label
                          className="form-check-label"
                          style={{ paddingBottom: "30px" }}
                          htmlFor="acheteur"
                        >
                          <span
                            className=""
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                            }}
                          >
                            <span className="fs-4 d-block fw-medium text-heading">
                              Acheteur
                            </span>
                            <small>
                              Découvrez et achetez des produits locaux de
                              qualité directement auprès des agriculteurs et
                              éleveurs.
                            </small>
                            <span className="d-flex justify-content-center py-2">
                              <sup className="text-primary fs-6 lh-1 mt-2"></sup>
                              <span className="fw-medium display-5 text-primary"></span>
                              <sub className="lh-1 fs-big mt-auto mb-2"></sub>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div>
                        <input
                          name="role"
                          type="radio"
                          value="1"
                          id="acheteur"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md text-center"
                    style={{ flex: "1", width: "300px", height: "200px" }}
                  >
                    <div
                      className="form-check"
                      style={{
                        border: "2px solid #007bff",
                        borderRadius: "10px",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                      }}
                    >
                      <div style={{ padding: "10px" }}>
                        <label className="form-check-label" htmlFor="vendeur">
                          <span
                            className=""
                            style={{
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "normal",
                            }}
                          >
                            <span className="fs-4 d-block fw-medium text-heading">
                              Vendeur
                            </span>
                            <small>
                              Vendez vos produits agricoles et d&apos;élevages
                              directement aux consommateurs et développez votre
                              activité.
                            </small>
                            <span className="d-flex justify-content-center py-2">
                              <sup className="text-primary fs-6 lh-1 mt-2"></sup>
                              <span className="fw-medium display-5 text-primary"></span>
                              <sub className="lh-1 fs-big mt-auto mb-2"></sub>
                            </span>
                          </span>
                        </label>
                      </div>
                      <div>
                        <input
                          name="role"
                          type="radio"
                          value="2"
                          id="vendeur"
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {role === "2" && (
                  <div className="row mb-4">
                    <div className="col-md-12">
                      <label>Type de production</label>
                      <select
                        className="form-control"
                        name="typeProduction"
                        value={formData.typeProduction}
                        onChange={handleInputChange}
                      >
                        <option value="">
                          Sélectionnez votre type de production
                        </option>
                        {typeProductions.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="d-flex justify-content-between mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={step === 1}
              >
                <i className="fas fa-arrow-left"></i> PRECEDENT
              </button>

              {step < 3 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={nextStep}
                >
                  SUIVANT <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button type="submit" className="btn btn-success">
                  VALIDER
                </button>
              )}
            </div>
          </form>
          <div className="d-flex justify-content-center mt-4">
            <div>
              <small>Vous avez déjà un compte ?</small>{" "}
              <a href="/login"> Se connecter</a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SignupForm;
