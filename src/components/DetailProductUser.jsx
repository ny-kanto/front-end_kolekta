/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, EffectFade, Zoom, Thumbs } from "swiper/modules";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "swiper/css/zoom";
import "swiper/css/thumbs";
import "swiper/css/effect-fade";
import "../assets/detailProduct.css";
import Loading from "./Loading";
import Pagination from "./Pagination";

function DetailProductUser({ onAddToCart }) {
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [produitPhotos, setProduitPhotos] = useState([]);
  const [produits, setProduits] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [commentaire, setCommentaire] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [rating, setRating] = useState({
    note: 0,
    personne: { id: 0 },
    produit: { id: 0 },
  });
  const [hover, setHover] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [evaluationCountNote, setEvaluationCountNote] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [percentageCountNote, setPercentageCountNote] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const fetchProduits = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/produit/get-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setProduits(response.data.data[0]);
        setProduitPhotos(response.data.data[1]);
        setStock(response.data.data[2]);
        setRating(response.data.data[3]);
        setCommentaire(response.data.data[5]);
        setEvaluationCountNote(response.data.data[6]);
        setPercentageCountNote(response.data.data[7]);
        setTotalCount(response.data.data[8]);
        setAverageRating(response.data.data[9]);
        setTotalPages(response.data.data[10]);
        setNoPage(response.data.data[11]);
        console.log("Rating: ", response.data.data[3]);
        console.log("Total Count: ", response.data.data[8]);
        console.log("evatuation count Note: ", response.data.data[6]);
        console.log("percentage Note: ", response.data.data[7]);
        console.log("commentaire: ", response.data.data[5]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/error/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/error/404");
        } else {
          setError(error.response.data.message);
        }
      }
    };
    fetchProduits();
  }, [id, navigate, refresh]);

  const handlePagination = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/produit/get-user/${id}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });

      setProduits(response.data.data[0]);
      setProduitPhotos(response.data.data[1]);
      setStock(response.data.data[2]);
      setRating(response.data.data[3]);
      setCommentaire(response.data.data[5]);
      setEvaluationCountNote(response.data.data[6]);
      setPercentageCountNote(response.data.data[7]);
      setTotalCount(response.data.data[8]);
      setAverageRating(response.data.data[9]);
      setTotalPages(response.data.data[10]);
      setNoPage(response.data.data[11]);

      console.log("Rating: ", response.data.data[3]);
      console.log("Total Count: ", response.data.data[8]);
      console.log("evatuation count Note: ", response.data.data[6]);
      console.log("percentage Note: ", response.data.data[7]);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        navigate("/error/403");
      } else if (error.response && error.response.status === 404) {
        navigate("/error/404");
      } else {
        setError(error.response.data.message);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantite") {
      const quantityValue = Number(value);
      if (quantityValue > stock) {
        alert("Quantité dépasse le stock disponible");
        setQuantity(stock);
      } else {
        setQuantity(quantityValue);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/evaluation/save/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            note: rating.note,
          },
          withCredentials: true,
        }
      );

      console.log("note : ", rating.note);

      if (response.status === 200) {
        setRating((prevRating) => ({ ...prevRating, note: rating.note }));
        setShowModal(true);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      throw error;
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/commentaire/save/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            contenu_commentaire: comment,
          },
          withCredentials: true,
        }
      );

      console.log("Comment: ", comment);

      if (response.status === 200) {
        setComment("");
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      throw error;
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((star, index) => {
      index += 1;
      return (
        <span
          key={index}
          className="star"
          style={{
            color: index <= rating ? "gold" : "#ccc",
            fontSize: "4rem",
            letterSpacing: "10px",
          }}
        >
          &#9733;
        </span>
      );
    });
  };

  const handleCloseModal = () => setShowModal(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    try {
      const response = await axios.post(
        `http://localhost:8080/panier/save/${id}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            quantite: quantity,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onAddToCart();
        setQuantity(1);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.error("An error occurred:", error);
        navigate("/error/403");
      } else if (error.response && error.response.status === 404) {
        console.error("An error occurred:", error);
        navigate("/error/404");
      } else {
        console.error("An error occurred:", error);
        if (error.response && error.response.data) {
          setError(error.response.data.message);

          setTimeout(() => {
            setError("");
          }, 3000);
        }
      }
    }
  };

  if (!produits) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-4">
          <div style={{ borderRadius: "30px" }}>
            <Swiper
              effect={"fade"}
              spaceBetween={100}
              slidesPerView={"auto"}
              centeredSlides={true}
              grabCursor={true}
              zoom={true}
              thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
              modules={[EffectFade, Autoplay, Zoom, Thumbs]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {produitPhotos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`data:${photo.mimeType};base64,${photo.base64}`}
                    alt={produits.nom}
                    className="img-fluid d-block"
                    style={{ borderRadius: "10px" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Swiper des miniatures */}
            <Swiper
              modules={[Thumbs]}
              onSwiper={setThumbsSwiper}
              slidesPerView={4}
              spaceBetween={10}
              className="thumbSwiper"
            >
              {produitPhotos.map((photo, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={`data:${photo.mimeType};base64,${photo.base64}`}
                    alt={`Miniature ${index}`}
                    className="img-fluid"
                    style={{ cursor: "pointer" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        <div className="col-md-7 offset-1">
          <h3 className="text-uppercase">{produits.nom}</h3>
          <p className="text-muted">
            <a className="text-primary text-decoration-none" href={`/user/profile-vendeur-acheteur/${produits.personne.id}`}>
              Vendeur: {produits.personne.prenom} {produits.personne.nom}
            </a>
          </p>
          <div className="d-flex align-items-center">
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                const fullStar = index <= Math.floor(averageRating);
                const halfStar =
                  index === Math.ceil(averageRating) &&
                  !Number.isInteger(averageRating);

                return (
                  <span
                    key={index}
                    style={{
                      color: "gold",
                      letterSpacing: "10px",
                      fontSize: "17px",
                      marginRight: "10px",
                    }}
                  >
                    {fullStar ? (
                      <FaStar />
                    ) : halfStar ? (
                      <FaStarHalfAlt />
                    ) : (
                      <FaRegStar />
                    )}
                  </span>
                );
              })}
            </div>
            <span>({totalCount} note(s))</span>
          </div>

          <div className="mt-3">
            <h4 className="text-success">
              {produits.prix.toLocaleString("fr-FR")} Ar
            </h4>
            <p>
              Stocks disponibles:{" "}
              {stock ? (
                <span className="text-danger">{stock.toLocaleString('fr-FR')}</span>
              ) : (
                <span className="text-danger">{stock}</span>
              )}
            </p>
          </div>

          <div className="mt-3">
            <p>{produits.description}</p>
          </div>

          <div className="mt-5 mb-5">
            <h4>Conditions de vente</h4>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th>Minimum de commande</th>
                  <td>{produits.minCommande}</td>
                </tr>
                <tr>
                  <th>Délais de livraison</th>
                  <td>{produits.delaisLivraison} jours</td>
                </tr>
              </tbody>
            </table>
          </div>

          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          {/* Section pour ajouter la quantité et le bouton d'ajout au panier */}
          <div className="mt-5 mb-5">
            <form onSubmit={handleAddToCart}>
              <div className="row align-items-center">
                <div className="col-md-4 d-flex justify-content-between">
                  <label htmlFor="quantite" className="form-label">
                    Quantité :
                  </label>
                  <input
                    type="number"
                    id="quantite"
                    className="form-control w-50"
                    value={quantity}
                    name="quantite"
                    onChange={handleInputChange}
                    min="1"
                    disabled={stock === 0}
                  />
                </div>

                <div className="col-md-2">
                  {produits.unite.nom}
                </div>

                {stock > 0 ? (
                  <div className="col-md-4 offset-md-2 mt-3 mt-md-0 d-flex justify-content-center">
                    <button
                      className="btn btn-success w-fit-content"
                      type="submit"
                    >
                      Ajouter au panier
                      <i className="fa fa-cart-plus ms-2"></i>
                    </button>
                  </div>
                ) : (
                  <div className="col-md-4 offset-md-2 mt-3 mt-md-0 d-flex justify-content-center">
                    <button
                      className="btn btn-secondary w-fit-content"
                      type="button"
                      disabled
                    >
                      Rupture de stock
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div style={{ marginTop: "150px" }}>
            <h5>Evaluez le produit :</h5>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label className="form-label">Votre note :</label>
                <div className="star-rating">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <button
                        type="submit"
                        key={index}
                        className={
                          index <= (hover || (rating && rating.note))
                            ? "on"
                            : "off"
                        }
                        onClick={() => setRating({ note: index })}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(rating.note)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <span className="star">&#9733;</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
            <form onSubmit={handleSubmitComment}>
              <div className="mb-3">
                <label htmlFor="comment" className="form-label">
                  Votre commentaire :
                </label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="3"
                  value={comment}
                  name="comment"
                  onChange={(e) => setComment(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">
                Envoyer
              </button>
            </form>

            <Modal
              show={showModal}
              centered
              onHide={handleCloseModal}
              className="modal-grow"
            >
              <Modal.Header closeButton>
                <Modal.Title>Merci pour votre évaluation !</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Votre avis a été pris en compte avec une évaluation de :</p>
                <div className="star-rating d-flex justify-content-center">
                  {renderStars(rating ? rating.note : 0)}
                </div>
              </Modal.Body>
            </Modal>
          </div>

          <div className="mt-4">
            <h4>Notes & Commentaires</h4>
            <div className="row">
              {/* Section des évaluations globales */}
              <div className="col-md-5">
                <div className="d-flex align-items-center">
                  <div className="star-rating" style={{ width: "100%" }}>
                    {[...Array(5)].map((star, index) => {
                      index += 1;
                      const fullStar = index <= Math.floor(averageRating);
                      const halfStar =
                        index === Math.ceil(averageRating) &&
                        !Number.isInteger(averageRating);

                      return (
                        <span
                          key={index}
                          style={{
                            color: "gold",
                            letterSpacing: "10px",
                            fontSize: "17px",
                            marginRight: "10px",
                          }}
                        >
                          {fullStar ? (
                            <FaStar />
                          ) : halfStar ? (
                            <FaStarHalfAlt />
                          ) : (
                            <FaRegStar />
                          )}
                        </span>
                      );
                    })}
                  </div>
                  <h4 style={{ width: "100%" }}>{averageRating} sur 5</h4>
                </div>
                <p>Total {totalCount} note(s)</p>

                {/* Barres de progression pour les évaluations */}
                <div className="rating-bars">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>5 étoiles</span>
                    <div className="progress w-75" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${percentageCountNote[5]}%` }}
                      ></div>
                    </div>
                    <span>{evaluationCountNote[5]}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>4 étoiles</span>
                    <div className="progress w-75" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-info"
                        style={{ width: `${percentageCountNote[4]}%` }}
                      ></div>
                    </div>
                    <span>{evaluationCountNote[4]}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>3 étoiles</span>
                    <div className="progress w-75" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${percentageCountNote[3]}%` }}
                      ></div>
                    </div>
                    <span>{evaluationCountNote[3]}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span>2 étoiles</span>
                    <div className="progress w-75" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-warning"
                        style={{ width: `${percentageCountNote[2]}%` }}
                      ></div>
                    </div>
                    <span>{evaluationCountNote[2]}</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>1 étoile</span>
                    <div className="progress w-75" style={{ height: "8px" }}>
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${percentageCountNote[1]}%` }}
                      ></div>
                    </div>
                    <span>{evaluationCountNote[1]}</span>
                  </div>
                </div>
              </div>

              {/* Section des avis */}
              <div className="col-md-7">
                <h5>Commentaires:</h5>
                <div className='d-flex justify-content-end mt-3 mb-3'>
                  <Pagination
                    noPage={noPage}
                    totalPages={totalPages}
                    baseUrl={`http://localhost:8080/produit/get-user/${id}`}
                    onPageChange={handlePagination}
                  />
                </div>
                {commentaire.map((comment, index) => (
                  <div
                    className="review-card p-3 mb-3 border rounded"
                    key={index}
                  >
                    <div className="d-flex align-items-center">
                      <p className="mb-0">{comment.contenuCommentaire}</p>
                    </div>
                    <div className="d-flex align-items-center mt-2">
                      <p className="mb-0 ms-3">
                        {comment.personne.utilisateur.pseudo}
                      </p>
                      <p className="mb-0 ms-auto text-muted">
                        {/* {comment.dateCommentaire} */}
                        {new Date(comment.dateCommentaire).toLocaleString('fr-FR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-start mb-5">
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
}

export default DetailProductUser;
