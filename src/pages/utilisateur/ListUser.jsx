import { useState, useEffect } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from '../../components/Footer';
import HeaderAdmin from '../../components/HeaderAdmin';
import NavbarAdmin from "../../components/NavbarAdmin";
import Pagination from '../../components/Pagination';
import { useNavigate } from 'react-router-dom';

function ListUser() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [noPage, setNoPage] = useState();
  const [totalPages, setTotalPages] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("token front : ", token);
    console.log("email front : ", sessionStorage.getItem("email"));

    if (!token) {
      navigate("/login");
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("data 2 : ", response.data.data[2]);
        setUsers(response.data.data[2]);
        setNoPage(response.data.data[3]);
        setTotalPages(response.data.data[4]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.error("An error occurred:", error);
          navigate("/error/403");
        } else if (error.response && error.response.status === 404) {
          console.error("An error occurred:", error);
          navigate("/error/404");
        } else {
          setError(error.message);
        }
      }
    };

    fetchUsers();
  }, [navigate, refresh]);

  // PAGINATION
  const handlePagination = async (pageNumber) => {
    try {
      const token = sessionStorage.getItem("token");
      const params = new URLSearchParams({
        noPage: pageNumber
      });

      const response = await axios.get(`http://localhost:8080/user/list?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      console.log("data 2 : ", response.data.data[2]);
      setUsers(response.data.data[2]);
      setNoPage(response.data.data[3]);
      setTotalPages(response.data.data[4]);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderAdmin />
      </div>
      <div className="mt-5 mb-5">
        <NavbarAdmin />
        <div
          style={{ marginLeft: "350px" }}
        >
          <div className="min-vh-100">
            <div className="container-fluid">
              <div className="row mt-4">
                <div className="col-lg-12">

                  <div className="card">
                    <div className="card-header align-items-center d-flex">
                      <h4 className="card-title mb-0 flex-grow-1">Utilisateurs</h4>
                    </div>
                    <div className="card-body">
                      <div className="row bg-light p-2 border-bottom">
                        <div className="col text-center"><strong>Nom</strong></div>
                        <div className="col text-center"><strong>Prénom</strong></div>
                        <div className="col text-center"><strong>Date de naissance</strong></div>
                        <div className="col text-center"><strong>Rôle</strong></div>
                      </div>

                      {/* Liste des utilisateurs */}
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="row align-items-center py-2 border-bottom"
                        >
                          <div className="col text-center">
                            {user.nom}
                          </div>

                          <div className="col text-center">
                            {user.prenom}
                          </div>

                          <div className="col text-center">
                            {new Date(user.dateNaissance).toLocaleString('fr-FR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}
                          </div>

                          <div className="col text-center">
                            {user.role.nom}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className='d-flex justify-content-end mt-3'>
                      <Pagination
                        noPage={noPage}
                        totalPages={totalPages}
                        baseUrl="http://localhost:8080/user/list"
                        onPageChange={handlePagination}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>

    </div >
  );
}

export default ListUser;
