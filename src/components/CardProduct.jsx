/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/cardProduct.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CardProduct = ({ image, oldPrice, isNew }) => {
  return (
    <div className="col">
      <div
        className="card"
        style={{
          height: "475px",
          border: "none",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ height: "60%" }}>
          <img
            src={`data:${image.photoMimeType};base64,${image.photoBase64}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            className="card-img-top img-fluid d-block"
          />
          {isNew && (
            <span className="badge bg-danger position-absolute top-0 start-0 m-2">
              NOUVEAU
            </span>
          )}
        </div>
        <div className="card-body" style={{ height: "40%" }}>
          <h5 className="card-title text-center text-black fw-bold text-uppercase">
            {image.nom}
          </h5>
          <a className='text-primary text-decoration-none' href={`/user/profile-vendeur-acheteur/${image.id_personne}`}>Vendeur : {image.prenom_personne} {image.nom_personne}</a>
          <div className="d-flex align-items-center">
            <div className="star-rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                const fullStar = index <= Math.floor(image.average_rating);
                const halfStar =
                  index === Math.ceil(image.average_rating) &&
                  !Number.isInteger(image.average_rating);

                return (
                  <span
                    key={index}
                    style={{
                      color: "gold",
                      letterSpacing: "10px",
                      fontSize: "20px",
                      marginRight: "5px",
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
              <span>{image.total_count}</span>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="">
              <span className="price-container">
                <span className="currency-unit">Ar</span>
                {image.prix ? (
                  <span className="price-text">{image.prix.toLocaleString('fr-FR')}</span>
                ) : (
                  <span className="price-text">{image.prix}</span>
                )}
                <span className="unit-label">/ {image.nom_unite}</span>
              </span>

              {oldPrice && (
                <span className="text-muted text-decoration-line-through">
                  {oldPrice.toLocaleString("fr-FR")}
                </span>
              )}
            </div>
            <a
              href={`/product-user/${image.id}`}
              className="link-info fs-15 text-decoration-none"
            >
              Détails{" "}
              <i className="fa fa-angle-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
