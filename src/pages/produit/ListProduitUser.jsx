import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import CardProduct from "../../components/CardProduct";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import FilterNavbar from "../../components/FilterNavbar";
import HeaderUser from "../../components/HeaderUser";
import Loading from "../../components/Loading";

function ListProduitUser() {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [typeProduits, setTypeProduits] = useState([]);
  const [localisations, setLocalisations] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const navigate = useNavigate();
  const [sort, setSort] = useState(1);
  const [column, setColumn] = useState("id_produit");
  const [noPage, setNoPage] = useState(1);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(0);
  const [filters, setFilters] = useState({
    nom: "",
    prix_min: 0.0,
    prix_max: 0.0,
    categorie: "",
    localisation: "",
    type_produit: "",
    type_production: "",
    disponibilite: 0
  });

  const [selectedSortOption, setSelectedSortOption] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }

    const params = new URLSearchParams({
      ...filters,
      noPage,
      column,
      sort,
    });

    const fetchProduits = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/produit/user-all?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        const url = `http://localhost:8080/produit/user-all?${params.toString()}`;

        console.log("Requête complète :", url);

        const rawTempProduits = response.data.data[0];
        const tempProduit = rawTempProduits.map((produit) => ({
          id: produit.id,
          nom: produit.nom,
          prix: produit.prix,
          description: produit.description,
          minCommande: produit.minCommande,
          delaisLivraison: produit.delaisLivraison,
          id_unite: produit.unite.id,
          nom_unite: produit.unite.nom,
          id_categorie: produit.categorie.id,
          nom_categorie: produit.categorie.nom,
          id_region: produit.region.id,
          nom_region: produit.region.nom,
          localisation: produit.localisation,
          id_personne: produit.personne.id,
          nom_personne: produit.personne.nom,
          prenom_personne: produit.personne.prenom,
          average_rating: produit.averageRating,
          total_count: produit.totalCount,
          is_new: produit.new,
        }));

        const transformedProduits = tempProduit.map((produit) => {
          const photo = response.data.data[1][produit.id] || {};
          return {
            id: produit.id,
            nom: produit.nom,
            prix: produit.prix,
            description: produit.description,
            minCommande: produit.minCommande,
            delaisLivraison: produit.delaisLivraison,
            id_unite: produit.id_unite,
            nom_unite: produit.nom_unite,
            id_categorie: produit.id_categorie,
            nom_categorie: produit.nom_categorie,
            id_region: produit.id_region,
            nom_region: produit.nom_region,
            localisation: produit.localisation,
            average_rating: produit.average_rating,
            id_personne: produit.id_personne,
            nom_personne: produit.nom_personne,
            prenom_personne: produit.prenom_personne,
            total_count: produit.total_count,
            is_new: produit.is_new,
            photoBase64: photo.base64 || "",
            photoMimeType: photo.mimeType || "",
          };
        });

        setProduits(transformedProduits);
        setTotalPages(response.data.data[2]);
        setCategories(response.data.data[3]);
        setTypeProduits(response.data.data[5]);
        setNoPage(response.data.data[6]);
        setSort(response.data.data[7]);
        setColumn(response.data.data[8]);
        setPriceMin(response.data.data[9]);
        setPriceMax(response.data.data[10]);
        setLocalisations(response.data.data[11]);

        console.log();
      } catch (error) {
        if (error.response && error.response.status === 404) {
          navigate("/error/404");
        } else {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchProduits();
  }, [navigate, filters, sort, column, noPage]);

  const handleSortChange = (e) => {
    const { value } = e.target;

    setSelectedSortOption(value);

    if (value === "prix_croi") {
      setColumn("prix_produit");
      setSort(1);
    } else if (value === "prix_de") {
      setColumn("prix_produit");
      setSort(2);
    } else if (value === "dernieres_arrivees") {
      setColumn("date_ajout_produit");
      setSort(2);
    } else if (value === "meilleures_notes") {
      setColumn("note_produit");
      setSort(2);
    } else {
      setColumn("id_produit");
      setSort(1);
    }
  };

  const handlePagination = (pageNumber) => {
    setNoPage(pageNumber);
  };

  const handlePriceChange = (e, newValue) => {
    const { name } = e.target;

    let [min, max] = newValue;

    if (min == priceMin) {
      min = 0.0;
    }

    if (max == priceMax) {
      max = 0.0;
    }

    filters.prix_min = min;
    filters.prix_max = max;

    setFilters({ ...filters, [name]: filters });
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (name === "categorie") {
      const updatedcategorie = name === "categorie" ? value : filters.categorie;

      setFilters({ ...filters, [name]: updatedcategorie });
    }

    if (name === "localisation") {
      const updatedlocalisation =
        name === "localisation" ? value : filters.localisation;

      setFilters({ ...filters, [name]: updatedlocalisation });
    }

    if (name === "type_produit") {
      const updatedtype_produit =
        name === "type_produit" ? value : filters.type_produit;

      setFilters({ ...filters, [name]: updatedtype_produit });
    }

    if (name === "type_production") {
      const updatedtype_production =
        name === "type_production" ? value : filters.type_production;

      setFilters({ ...filters, [name]: updatedtype_production });
    }

    if (name === "disponibilite") {
      const updateddisponibilite = type === "checkbox" ? (checked ? 1 : 0) : filters.disponibilite;
      setFilters({ ...filters, [name]: updateddisponibilite });
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    if (name === "nom") {
      const updatednom = name === "nom" ? value : filters.nom;

      setFilters({ ...filters, [name]: updatednom });
    }
  }

  if (!produits) {
    return <Loading />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderUser onHandleSearch={handleSearchChange} />
      </div>
      <div className="row mt-5 mb-5 min-vh-100">
        <div className="col-md-2 mt-5">
          <FilterNavbar
            onFilterChange={handleFilterChange}
            onPriceChange={handlePriceChange}
            categories={categories}
            typeProduits={typeProduits}
            localisations={localisations}
            minPrix={priceMin}
            maxPrix={priceMax}
          />
        </div>
        <div className="col-md-10" style={{ maxWidth: "1510px" }}>
          <div className="container-fluid">
            <div
              className="d-flex justify-content-between align-items-center mb-3 mt-4"
              style={{ padding: "10px" }}
            >
              <div style={{ flexShrink: 0 }}>
                <select
                  className="form-select"
                  value={selectedSortOption}
                  name="sort"
                  onChange={handleSortChange}
                >
                  <option value="">Trié par</option>
                  <option value="prix_croi">Prix : croissant</option>
                  <option value="prix_de">Prix : décroissant</option>
                  <option value="dernieres_arrivees">Dernières arrivées</option>
                  <option value="meilleures_notes">Meilleures notes</option>
                </select>
              </div>
              <div style={{ flexShrink: 0 }}>
                <Pagination
                  noPage={noPage}
                  totalPages={totalPages}
                  baseUrl="http://localhost:8080/produit/user-all"
                  onPageChange={handlePagination}
                />
              </div>
            </div>
            <div className="row row-cols-md-4 g-3 mb-5 mt-4">
              {produits.map((product) => (
                <CardProduct
                  key={product.id}
                  image={product}
                  isNew={product.is_new}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ListProduitUser;
