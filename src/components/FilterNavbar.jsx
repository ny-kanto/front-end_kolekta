/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import Slider from "@mui/material/Slider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FilterNavbar({
  onFilterChange,
  onPriceChange,
  categories,
  typeProduits,
  localisations,
  minPrix,
  maxPrix
}) {
  const [priceRange, setPriceRange] = useState([minPrix, maxPrix]);
  const [prix_min, setPrix_min] = useState(minPrix);
  const [prix_max, setPrix_max] = useState(maxPrix);
  const [categorie, setCategorie] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [type_produit, setType_produit] = useState("");
  const [type_production, setType_production] = useState("");
  const [disponibilite, setDisponibilite] = useState(0);

  useEffect(() => {
    setPriceRange([minPrix, maxPrix]);
    setPrix_min(minPrix);
    setPrix_max(maxPrix);
  }, [minPrix, maxPrix]);

  const handlePriceChange = (e, newValue) => {
    if (newValue[0] > maxPrix - 1000) {
      newValue[0] = maxPrix - 1000;
    }
    if (newValue[1] < minPrix + 1000) {
      newValue[1] = minPrix + 1000;
    }

    const [min, max] = newValue;

    setPrix_min(min);
    setPrix_max(max);

    setPriceRange(newValue);

    onPriceChange(e, newValue);
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;

    onFilterChange(e);

    if (name === "categorie") {
      const updatedcategorie = name === "categorie" ? value : categorie;

      setCategorie(updatedcategorie);
    }

    if (name === "localisation") {
      const updatedlocalisation =
        name === "localisation" ? value : localisation;

      setLocalisation(updatedlocalisation);
    }

    if (name === "type_produit") {
      const updatedtype_produit =
        name === "type_produit" ? value : type_produit;

      setType_produit(updatedtype_produit);
    }

    if (name === "type_production") {
      const updatedtype_production =
        name === "type_production" ? value : type_production;

      setType_production(updatedtype_production);
    }

    if (name === "disponibilite") {
      const updateddisponibilite =
        name === "disponibilite" ? value : disponibilite;

      setDisponibilite(updateddisponibilite);
    }

    if (name === "disponibilite") {
      const updateddisponibilite = type === "checkbox" ? (checked ? 1 : 0) : disponibilite;
      setDisponibilite(updateddisponibilite);
    }
  };

  return (
    <div className="p-3 mb-4">
      <div className="container">
        <form>
          {/* Categorie */}
          <div className="row">
            <div className="col-xs-12 mb-3">
              <label htmlFor="categorie" className="form-label">
                Catégorie
              </label>
              <select
                id="categorie"
                name="categorie"
                className="form-select"
                value={categorie}
                onChange={handleFilterChange}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Localisation */}
          <div className="row">
            <div className="col-xs-12 mb-3">
              <label htmlFor="localisation" className="form-label">
                Localisation
              </label>
              <select
                id="localisation"
                name="localisation"
                className="form-select"
                value={localisation}
                onChange={handleFilterChange}
              >
                <option value="">Sélectionner une localisation</option>
                {localisations.map((localisation) => (
                  <option key={localisation.id} value={localisation.id}>
                    {localisation.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Production Type */}
          {/* <div className="row">
            <div className="col-xs-12 mb-3">
              <label htmlFor="type_production" className="form-label">
                Type de production
              </label>
              <select
                id="type_production"
                name="type_production"
                className="form-select"
                value={type_production}
                onChange={handleFilterChange}
              >
                <option value="">Sélectionner un type de production</option>
                <option value="1">Biologique</option>
                <option value="2">Durable</option>
              </select>
            </div>
          </div> */}

          {/* Product Type */}
          <div className="row">
            <div className="col-xs-12 mb-3">
              <label htmlFor="type_produit" className="form-label">
                Type de produit
              </label>
              <select
                id="type_produit"
                name="type_produit"
                className="form-select"
                value={type_produit}
                onChange={handleFilterChange}
              >
                <option value="">Sélectionner un type de produit</option>
                {typeProduits.map((typeProduit) => (
                  <option key={typeProduit.id} value={typeProduit.id}>
                    {typeProduit.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="row">
            <div className="col-xs-12 mb-3">
              <label htmlFor="priceRange" className="form-label">
                Prix
              </label>
              <Box sx={{ width: "100%" }}>
                <Typography id="range-slider" gutterBottom>
                  Sélectionnez une plage de prix :
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  onChangeCommitted={handleFilterChange}
                  valueLabelDisplay="auto"
                  name="prix"
                  min={minPrix}
                  max={maxPrix}
                  step={100}
                />
              </Box>
              <div className="d-flex justify-content-between mt-2">
                <span>
                  {prix_min} {minPrix === prix_min && <FontAwesomeIcon icon={faMinus} />} 
                </span>
                <span>
                  {prix_max} {maxPrix === prix_max && <FontAwesomeIcon icon={faPlus} />}
                </span>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12 mb-3 d-flex justify-content-between">
              <label htmlFor="priceRange" className="form-label">
                Produits disponibles
              </label>
              <div>
                <input type="checkbox" name="disponibilite" checked={disponibilite === 1} onChange={handleFilterChange} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FilterNavbar;
