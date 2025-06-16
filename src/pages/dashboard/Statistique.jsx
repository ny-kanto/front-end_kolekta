import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Statistique() {
  const [chartData, setChartData] = useState(null);
  const [stat, setStat] = useState([]);
  const [nbCommande, setNbCommande] = useState(0);
  const [produits, setProduits] = useState([
    {
      id: 0,
      nom: "",
      description: "",
      prix: 0,
      minCommande: 0,
      delaisLivraison: 0,
      new: false,
      localisation: "",
      averageRating: 0,
      totalCount: 0,
      dateAjout: "",
      categorie: {},
      personne: {},
      unite: {},
      region: {},
    },
  ]);
  const currentYear = new Date().getFullYear();
  const [idProduit, setIdProduit] = useState(0);
  const [annees, setAnnees] = useState([currentYear]);
  const [annee, setAnnee] = useState(currentYear);
  const [totalVentes, setTotalVentes] = useState(0);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/statistique/all",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { idProduit: idProduit, annee: annee },
            withCredentials: true,
          }
        );

        const stats = response.data.data[0];

        const monthOrder = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];

        const orderedStats = monthOrder.map((month) => {
          const stat = stats.find((s) => s.mois === month);
          return {
            mois: month,
            totalVentes: stat ? stat.totalVentes : 0,
            nomProduit: stat ? stat.nomProduit : "",
            nomUnite: stat ? stat.nomUnite : "",
            totalVendus: stat ? stat.totalVendus : 0,
            annee: stat ? stat.annee : currentYear,
          };
        });

        setChartData({
          labels: monthOrder,
          datasets: [
            {
              label: "Total des ventes",
              data: orderedStats.map((s) => s.totalVentes),
              borderColor: "#007bff",
              backgroundColor: "rgba(0, 123, 255, 0.2)",
              fill: true,
              tension: 0.3,
              pointBackgroundColor: "#007bff",
              pointBorderColor: "#007bff",
              pointRadius: 5,
            },
          ],
        });

        setProduits(response.data.data[1]);
        setStat(orderedStats);
        setAnnees(response.data.data[2]);
        setTotalVentes(response.data.data[3]);
        setNbCommande(response.data.data[4]);

        console.log("data 0 : ", response.data.data[0]);
        // console.log("data 1 : ", response.data.data[1]);
        console.log("stat : ", orderedStats);
        console.log("data 2 : ", response.data.data[2]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/error/403");
        } else if (error.response && error.response.status === 404) {
          navigate("/error/404");
        } else {
          console.error("An error occurred:", error);
        }
      }
    };

    fetchData();
  }, [idProduit, annee, token, navigate]); // Ajout de idProduit dans les dépendances

  const cardColor = "#ffffff"; // Couleur de fond de la carte
  const borderColor = "#e0e0e0"; // Couleur de la bordure
  const labelColor = "#6c757d"; // Couleur des labels
  const headingColor = "#343a40"; // Couleur du texte principal
  const legendColor = "#495057"; // Couleur des légendes

  // Options du graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: borderColor,
          drawBorder: false,
          borderColor: borderColor,
          drawOnChartArea: false,
        },
        ticks: {
          color: labelColor,
        },
      },
      y: {
        min: 0,
        ticks: {
          color: labelColor,
          stepSize: 10000,
        },
        grid: {
          color: borderColor,
          drawBorder: false,
          borderColor: borderColor,
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: cardColor,
        titleColor: headingColor,
        bodyColor: legendColor,
        borderWidth: 1,
        borderColor: borderColor,
      },
      legend: {
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          padding: 35,
          boxWidth: 6,
          boxHeight: 6,
          color: legendColor,
        },
      },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "id_produit") {
      setIdProduit(value);
    } else if (name == "annee") {
      setAnnee(value);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <Header />
      </div>
      <div className="mt-5 mb-5">
        <Navbar />
        <div
          style={{ marginLeft: "350px" }}
        >
          <div className="row mb-4 min-vh-100">
            <div className="col-12 text-center mt-5">
              <div className="row">
                <div
                  className="col-3 w-auto badge d-flex text-black flex-column justify-content-center align-items-center"
                  style={{
                    height: "100px",
                    fontSize: "1.5rem",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    padding: "10px",
                  }}
                >
                  <p className="mb-0" style={{ fontWeight: "bold" }}>
                    Total des ventes
                  </p>
                  {totalVentes ? (
                    <p className="mb-0 mt-3 text-success">{totalVentes.toLocaleString("fr-FR")} Ar</p>
                  ) : (
                    <p className="mb-0 mt-3 text-success">{totalVentes} Ar</p>
                  )}
                </div>

                <div
                  className="col-3 w-auto offset-1 badge d-flex text-black flex-column justify-content-center align-items-center"
                  style={{
                    height: "100px",
                    fontSize: "1.5rem",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    padding: "10px",
                  }}
                >
                  <p className="mb-0" style={{ fontWeight: "bold" }}>
                    Nb total de commandes reçues
                  </p>
                  {nbCommande ? (
                    <p className="mb-0 mt-3 text-info">{nbCommande.toLocaleString("fr-FR")}</p>
                  ) : (
                    <p className="mb-0 mt-3 text-info">{nbCommande}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="row mt-5">
              <div className="col-12">
                <div
                  className="card"
                  style={{
                    border: "none",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="card-header header-elements d-flex flex-wrap">
                    <div className="me-1 mt-2">
                      <select
                        className="form-select w-auto me-1"
                        aria-label="Produit"
                        name="id_produit"
                        value={idProduit}
                        onChange={handleChange}
                      >
                        <option value="">Produit</option>
                        {produits.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="me-1 mt-2">
                      <select
                        className="form-select w-auto me-1"
                        aria-label="Année"
                        name="annee"
                        value={annee}
                        onChange={handleChange}
                      >
                        <option value="">Année</option>
                        {annees.map((anneeObj) => (
                          <option key={anneeObj} value={anneeObj}>
                            {anneeObj}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div
                    className="card-body pt-2"
                    style={{ height: "500px", position: "relative" }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        padding: "10px",
                        fontWeight: "bold",
                        fontSize: "30px",
                      }}
                    >
                      {annee || currentYear}
                    </div>

                    {chartData ? (
                      <Line data={chartData} options={options} />
                    ) : (
                      <Loading />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-12">
                <div
                  className="card"
                  style={{
                    border: "none",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Produit</h4>
                  </div>
                  <div className="card-body">
                    <div className="live-preview">
                      <div className="table-responsive modal-body-pdf">
                        <table
                          className="table align-middle table-nowrap mb-0"
                          id="myTable"
                        >
                          <thead>
                            <tr>
                              <th scope="col">Produit</th>
                              {idProduit != 0 && <th scope="col">Unité</th>}
                              {idProduit != 0 && <th scope="col">Total Vendus</th>}
                              <th scope="col">Total Ventes (Ar)</th>
                              <th scope="col">Mois</th>
                              <th scope="col">Année</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stat.map((st, index) => (
                              <tr key={`${st.idProduit}-${index}`}>
                                <td>{st.nomProduit}</td>
                                {idProduit != 0 && <td>{st.nomUnite}</td>}
                                {idProduit != 0 && <td>{st.totalVendus.toLocaleString("fr-FR")}</td>}
                                <td>
                                  {st.totalVentes.toLocaleString("fr-FR")}
                                </td>
                                <td>{st.mois}</td>
                                <td>{st.annee}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Statistique;
