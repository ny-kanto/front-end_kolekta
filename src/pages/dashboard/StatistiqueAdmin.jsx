import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import HeaderAdmin from "../../components/HeaderAdmin";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import NavbarAdmin from "../../components/NavbarAdmin";
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import Loading from "../../components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function StatistiqueAdmin() {
  const labelColor = "#000000"; // Couleur des labels


  const [statCategory, setStatCategory] = useState([]);
  const [statLocalisation, setStatLocalisation] = useState([]);
  const [statType, setStatType] = useState([]);

  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/statistique/admin",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );

        setStatCategory(response.data.data[0]);
        setStatLocalisation(response.data.data[1]);
        setStatType(response.data.data[2]);

        console.log("data 0 : ", response.data.data[0]);
        console.log("data 1 : ", response.data.data[1]);
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
  }, [token, navigate]);

  // Configuration du Pie Chart
  const pieData = {
    labels: statType.map((st) => st.nom),
    datasets: [
      {
        label: "",
        backgroundColor: [
          "#54AB54", "#DC4E28"
        ],
        data: statType.map((st) => st.totalVentes),
      },
    ],
  };

  const pieOptions = {
    animation: {
      duration: 1000,
    },
    cutout: '0%',
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            label += context.parsed + " Ar";
            return label;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };


  // Configuration du Bar Chart
  const barData = {
    labels: statCategory.map((s) => s.nom),
    datasets: [
      {
        label: "Total des ventes",
        data: statCategory.map((s) => s.totalVentes),
        borderColor: "#799cf4",
        backgroundColor: "rgba(121, 156, 244, 0.7)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#799cf4",
        pointBorderColor: "#799cf4",
        pointRadius: 5,
        barThickness: 40,
      },
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: labelColor,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y: {
        ticks: {
          color: labelColor,
          stepSize: 10000,
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };


  // Configuration du Bar Horizontal Chart
  const barHorizontalData = {
    labels: statLocalisation.map((s) => s.nom),
    datasets: [
      {
        label: "Total des ventes",
        data: statLocalisation.map((s) => s.totalVentes),
        borderColor: "#a0df58",
        backgroundColor: "rgba(160, 223, 88, 0.7)",
        fill: true,
        tension: 0.3,
        pointBackgroundColor: "#a0df58",
        pointBorderColor: "#a0df58",
        pointRadius: 5,
        barThickness: 40,
      },
    ]
  };

  const barHorizontalOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: labelColor,
          stepSize: 10000,
        },
      },
      y: {
        ticks: {
          color: labelColor,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        // position: 'top',
      },
    },
  };


  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderAdmin />
      </div>
      <div className="mt-5 mb-5">
        <NavbarAdmin />
        <div style={{ marginLeft: "350px" }}>
          <div className="row mb-4 min-vh-100">

            {/* TYPE PRODUIT */}
            <div className="row mt-5">
              <div className="col-8">
                <div
                  className="card"
                  style={{
                    border: "none",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div className="card-header align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">Type Produit</h4>
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
                              <th scope="col">Type Produit</th>
                              <th scope="col">Total Ventes (Ar)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {statType.map((st, index) => (
                              <tr key={`${st.id}-${index}`}>
                                <td>{st.nom}</td>
                                <td>
                                  {st.totalVentes.toLocaleString("fr-FR")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div
                  className="card"
                  style={{
                    border: "none",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <div
                    className="card-body pt-2"
                    style={{ height: "400px", position: "relative" }}
                  >

                    {pieData ? (
                      <Pie data={pieData} options={pieOptions} />
                    ) : (
                      <Loading />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CATEGORIE */}
            <div className="row mt-5">
              <div className="row">
                <div className="col-12">
                  <div
                    className="card"
                    style={{
                      border: "none",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Catégorie</h4>
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
                                <th scope="col">Catégorie</th>
                                <th scope="col">Total Ventes (Ar)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {statCategory.map((st, index) => (
                                <tr key={`${st.id}-${index}`}>
                                  <td>{st.nom}</td>
                                  <td>
                                    {st.totalVentes.toLocaleString("fr-FR")}
                                  </td>
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
              <div className="row mt-4">
                <div className="col-12">
                  <div
                    className="card"
                    style={{
                      border: "none",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      className="card-body pt-2"
                      style={{ height: "400px", position: "relative" }}
                    >

                      {barData ? (
                        <Bar data={barData} options={barOptions} />
                      ) : (
                        <Loading />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LOCALISATION */}
            <div className="row mt-5">
              <div className="row">
                <div className="col-12">
                  <div
                    className="card"
                    style={{
                      border: "none",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Localisation</h4>
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
                                <th scope="col">Localisation</th>
                                <th scope="col">Total Ventes (Ar)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {statLocalisation.map((st, index) => (
                                <tr key={`${st.id}-${index}`}>
                                  <td>{st.nom}</td>
                                  <td>
                                    {st.totalVentes.toLocaleString("fr-FR")}
                                  </td>
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
              <div className="row mt-4">
                <div className="col-12">
                  <div
                    className="card"
                    style={{
                      border: "none",
                      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <div
                      className="card-body pt-2"
                      style={{ height: "1200px", position: "relative" }}
                    >

                      {barHorizontalData ? (
                        <Bar data={barHorizontalData} options={barHorizontalOptions} />
                      ) : (
                        <Loading />
                      )}
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

export default StatistiqueAdmin;
