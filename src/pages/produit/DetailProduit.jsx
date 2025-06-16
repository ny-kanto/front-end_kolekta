import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay, Navigation, Pagination, Scrollbar, Zoom, EffectCoverflow } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import 'swiper/css/effect-coverflow';
import '../../assets/detailProduit.css';
import Loading from "../../components/Loading";
import Paginations from "../../components/Pagination";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const DetailProduit = () => {
  const { id } = useParams();
  const [produits, setProduits] = useState();
  const [stock, setStock] = useState(0);
  const [produitPhotos, setProduitPhotos] = useState([]);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  const [commentaire, setCommentaire] = useState([]);
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [error, setError] = useState(null);
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
  const [totalCount, setTotalCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/produit/get/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        setProduits(response.data.data[0]);
        setProduitPhotos(response.data.data[1]);
        setStock(response.data.data[2]);
        setCommentaire(response.data.data[3]);
        setTotalPages(response.data.data[4]);
        setNoPage(response.data.data[5]);
        setEvaluationCountNote(response.data.data[7]);
        setPercentageCountNote(response.data.data[8]);
        setTotalCount(response.data.data[9]);
        setAverageRating(response.data.data[10]);

        console.log("Total Count: ", response.data.data[9]);
        console.log("evatuation count Note: ", response.data.data[7]);
        console.log("percentage Note: ", response.data.data[8]);
        console.log("average Rating: ", response.data.data[10]);
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      }
      console.log(produitPhotos);
    };

    fetchProduct();
  }, [id, navigate, token]);

  const handlePagination = async (pageNumber) => {
    try {
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/produit/get/${id}?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      setProduits(response.data.data[0]);
      setProduitPhotos(response.data.data[1]);
      setStock(response.data.data[2]);
      setCommentaire(response.data.data[3]);
      setTotalPages(response.data.data[4]);
      setNoPage(response.data.data[5]);
      setEvaluationCountNote(response.data.data[7]);
      setPercentageCountNote(response.data.data[8]);
      setTotalCount(response.data.data[9]);
      setAverageRating(response.data.data[10]);

      console.log("Total Count: ", response.data.data[9]);
      console.log("evatuation count Note: ", response.data.data[7]);
      console.log("percentage Note: ", response.data.data[8]);
      console.log("average Rating: ", response.data.data[10]);
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


  if (!produits && !stock) {
    return <Loading />
  }

  return (
    <div>
      <div className="main-content d-flex flex-column min-vh-100 mt-5">
        <div className="mb-5">
          <Header />
        </div>
        <div className="page-content mt-5">
          <div className="container">
            {error && (
              <div className="alert alert-danger mt-3" role="alert">
                {error}
              </div>
            )}
            <div className="row mt-4">
              <div className="col-lg-12">
                <div>
                  <Swiper
                    effect={'coverflow'}
                    spaceBetween={100}
                    slidesPerView={'auto'}
                    centeredSlides={true}
                    navigation
                    grabCursor={true}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    zoom={true}
                    coverflowEffect={{
                      rotate: 50,
                      stretch: 0,
                      depth: 100,
                      modifier: 1,
                      slideShadows: true,
                    }}
                    modules={[EffectCoverflow, Autoplay, Navigation, Pagination, Scrollbar, Zoom]}
                    autoplay={{
                      delay: 3000,
                      disableOnInteraction: false,
                    }}
                  >
                    {produitPhotos.map((photo, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={`data:${photo.mimeType};base64,${photo.base64}`}
                          alt={produits.nom}
                          className="img-fluid d-block"
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="row mt-4">
                <div className="col-lg-12">
                  <h1 className="text-center text-uppercase">{produits.nom}</h1>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-5 offset-lg-1">
                  <h3>Description</h3>
                  <p>{produits.description}</p>

                  {/* Section des évaluations globales */}
                  <h3 className="mt-5">Notes & Commentaires</h3>
                  <div className="col-lg-12">
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
                  <div className="col-lg-12 mt-5">
                    <h5>Commentaires:</h5>
                    <div className='d-flex justify-content-end mt-3 mb-3'>
                      <Paginations
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
                <div className="col-lg-5 offset-lg-1">
                  <h3>Détails</h3>
                  <div className="col-lg-12 col-sm-6">
                    <div className="p-2 border border-dashed rounded">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-2">
                          <div className="avatar-title rounded bg-transparent text-success fs-24">
                            <i className="ri-file-copy-2-fill"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">
                            Prix :
                          </p>
                          <h5 className="mb-0">
                            {produits.prix.toLocaleString('fr-FR')} Ar
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 mt-1">
                    <div className="p-2 border border-dashed rounded">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-2">
                          <div className="avatar-title rounded bg-transparent text-success fs-24">
                            <i className="ri-file-copy-2-fill"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">
                            Unite :
                          </p>
                          <h5 className="mb-0">
                            {produits.unite.nom}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 mt-1">
                    <div className="p-2 border border-dashed rounded">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-2">
                          <div className="avatar-title rounded bg-transparent text-success fs-24">
                            <i className="ri-file-copy-2-fill"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">
                            Stock :
                          </p>
                          <h5 className="mb-0">
                            {stock.toLocaleString('fr-FR')}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-12 col-sm-6 mt-1">
                    <div className="p-2 border border-dashed rounded">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm me-2">
                          <div className="avatar-title rounded bg-transparent text-success fs-24">
                            <i className="ri-file-copy-2-fill"></i>
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <p className="text-muted mb-1">
                            Catégorie :
                          </p>
                          <h5 className="mb-0">
                            {produits.categorie.nom}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2" style={{ color: '#28a745', borderBottom: '2px solid #28a745', paddingBottom: '5px' }}>
                    Conditions de vente
                  </h5>
                  <ul style={{ paddingLeft: '20px', lineHeight: '1.7', color: '#555' }}>
                    <li style={{ marginBottom: '10px' }}>
                      <strong>Minimum de commande :</strong> {produits.minCommande}
                    </li>
                    <li>
                      <strong>Délais de livraison :</strong> {produits.delaisLivraison} j
                    </li>
                  </ul>
                </div>

                <div className="text-start mb-5">
                  <button
                    type="button"
                    className="btn btn-info bg-gradient"
                    onClick={() => navigate(-1)}
                    style={{ color: "white" }}
                  >
                    Retour
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >

  );
};

export default DetailProduit;
