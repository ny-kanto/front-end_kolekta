import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import Unite from '../../components/Unite';

function ListUnite() {
    const [unites, setUnites] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        console.log("token front : ", token);
        console.log("email front : ", sessionStorage.getItem("email"));
        if (!token) {
            navigate("/login");
        }

        const fetchUnites = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/unite/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                const url = `http://localhost:8080/unite/list`;

                console.log("Requête complète :", url);

                const rawUnites = response.data.data[0];
                const transformedUnites = rawUnites.map(unite => ({
                    id: unite.id,
                    nom: unite.nom,
                }));
                setUnites(transformedUnites);
                console.log("response data 0 : ", response.data.data[0]);
                console.log("transformed Unite : ", transformedUnites);

            } catch (error) {
                if (error.response && error.response.status === 403) {
                    navigate("/error/403");
                } else if (error.response && error.response.status === 404) {
                    navigate("/error/404");
                } else {
                    console.error('An error occurred:', error);
                }
            }
        };

        fetchUnites();
    }, [navigate, token, refresh]);

    // MODIFICATION
    const handleUpdate = (updatedUnite) => {
        console.log('Unite à mettre à jour:', updatedUnite);
        setUnites((prevUnites) =>
            prevUnites.map((Unite) =>
                Unite.id === updatedUnite.id ? updatedUnite : Unite
            )
        );

        setRefresh(!refresh);
    };

    // AJOUT
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [newUniteData, setNewUniteData] = useState({
        nom: '',
    });

    const handleShowAdd = () => setShowModalAdd(true);
    const handleCloseAdd = () => setShowModalAdd(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id_type_produit') {
            setNewUniteData({ ...newUniteData, typeProduit: { id: value } });
        } else {
            setNewUniteData({ ...newUniteData, [name]: value });
        }
    };

    const onAddUnite = (newUnite) => {
        console.log('Unite ajouté avec succès:', newUnite);
        setUnites(prevUnites => [...prevUnites, newUnite]);

        setRefresh(!refresh);
    };

    const handleAddUnite = async () => {
        try {

            const response = await axios.post('http://localhost:8080/unite/save', {}, {
                params: {
                    nom: newUniteData.nom,
                    id_type_produit: newUniteData.typeProduit.id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            console.log("Réponse ", response.data);

            if (response.status === 200) {
                onAddUnite(response.data);
                setShowModalAdd(false);
            } else {
                console.error('Erreur lors de l\'ajout du unite:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du unite:', error);
        }
    };

    if (!unites) {
        return <Loading />
    }

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="mb-5">
                <Header refresh={refresh} />
            </div>
            <div className="mt-5 mb-5">
                <Navbar />
                <div className="mt-5" style={{ marginLeft: "350px" }}>
                    <div className="min-vh-100">
                        <div className="container-fluid">
                            <div className="row mt-4">
                                <div className="col-lg-12">
                                    <div className="card">
                                        <div className="card-header align-items-center d-flex">
                                            <h4 className="card-title mb-0 flex-grow-1">Unité</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="live-preview">
                                                <div className="row g-4 mb-3">
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <button type="button" onClick={handleShowAdd} className="btn btn-success add-btn"><i
                                                                className="fas fa-plus"></i> Ajouter une unité</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="table-responsive modal-body-pdf">
                                                    <table
                                                        className="table align-middle table-nowrap mb-0"
                                                        id="myTable">
                                                        <thead>
                                                            <tr>
                                                                <th scope="col">#</th>
                                                                <th scope="col">Nom</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {unites.map((u) => (
                                                                <Unite
                                                                    unites={u}
                                                                    key={u.id}
                                                                    onUpdate={handleUpdate}
                                                                />
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal d'ajout de unites */}
                            <Modal show={showModalAdd} onHide={handleCloseAdd} centered size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Ajouter une unité</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="formNom">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nom"
                                                value={newUniteData.nom}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseAdd}>
                                        Annuler
                                    </Button>
                                    <Button variant="primary" onClick={handleAddUnite}>
                                        Ajouter l&apos;unité
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>

        </div>
    );
}

export default ListUnite;
