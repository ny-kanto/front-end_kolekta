import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Navbar from "../../components/Navbar";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function EtatStock() {
  const [stock, setStock] = useState([]);
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }

    const fetchStock = async () => {
      try {
        const response = await axios.get("http://localhost:8080/stock/etat", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        const rawStock = response.data.data[0];
        const transformedStock = rawStock.map((stockEtat) => ({
          idProduit: stockEtat.idProduit,
          nomProduit: stockEtat.nomProduit,
          nomUnite: stockEtat.nomUnite,
          sommeEntree: stockEtat.sommeEntree,
          sommeSortie: stockEtat.sommeSortie,
          sommeReserve: stockEtat.sommeReserve,
          reste: stockEtat.reste
        }));
        setStock(transformedStock);
        console.log("response", response.data.data[0]);

        setTotalPages(response.data.data[1]);

        setNoPage(response.data.data[2]);
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

    fetchStock();
  }, [navigate, token]);

  // PAGINATION
  const handlePagination = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/stock/etat?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const rawStock = response.data.data[0];
      const transformedStock = rawStock.map(stockEtat => ({
        idProduit: stockEtat.idProduit,
        nomProduit: stockEtat.nomProduit,
        nomUnite: stockEtat.nomUnite,
        sommeEntree: stockEtat.sommeEntree,
        sommeSortie: stockEtat.sommeSortie,
        sommeReserve: stockEtat.sommeReserve,
        reste: stockEtat.reste
      }));
      setStock(transformedStock);

      setTotalPages(response.data.data[1]);
      setNoPage(pageNumber);

      console.log("total page " + totalPages);

      console.log(response.data.data[0])
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  if (!stock) {
    return <Loading />
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <Header />
      </div>
      <div className="mt-5 mb-5">
        <Navbar />
        <div
          className="mt-5"
          style={{ marginLeft: "350px" }}
        >
          <div className="min-vh-100">
            <div className="container-fluid">
              <div className="row mt-4">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Etat de stock</h4>
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
                                <th scope="col">
                                  Nom du Produit
                                </th>
                                <th scope="col">
                                  Unité
                                </th>
                                <th scope="col">
                                  Quantité Entrant
                                </th>
                                <th scope="col">
                                  Quantité Sortant
                                </th>
                                <th scope="col">
                                  Quantité Réservé
                                </th>
                                <th scope="col">
                                  Reste
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {stock.map((stockItem) => (
                                <tr key={stockItem.idProduit}>
                                  <td>{stockItem.nomProduit}</td>
                                  <td>{stockItem.nomUnite}</td>
                                  <td>{stockItem.sommeEntree.toLocaleString('fr-FR')}</td>
                                  <td>{stockItem.sommeSortie.toLocaleString('fr-FR')}</td>
                                  <td>{stockItem.sommeReserve.toLocaleString('fr-FR')}</td>
                                  <td>{stockItem.reste.toLocaleString('fr-FR')}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className='d-flex justify-content-end mt-3'>
                          <Pagination
                            noPage={noPage}
                            totalPages={totalPages}
                            baseUrl="http://localhost:8080/stock/etat"
                            onPageChange={handlePagination}
                          />
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
      </div>
    </div>
  );
}

export default EtatStock;
