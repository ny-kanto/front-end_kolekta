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
import Categorie from '../../components/Categorie';

function ListCategorie() {
    const [categories, setCategories] = useState([]);
    const [typeProduits, setTypeProduits] = useState([]);

    const [refresh, setRefresh] = useState(false);
    const token = sessionStorage.getItem("token");
    const navigate = useNavigate();


    useEffect(() => {
        console.log("token front : ", token);
        console.log("email front : ", sessionStorage.getItem("email"));
        if (!token) {
            navigate("/login");
        }

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/categorie/list`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true
                });

                const url = `http://localhost:8080/categorie/list`;

                console.log("Requête complète :", url);

                const rawCategories = response.data.data[0];
                const transformedCategories = rawCategories.map(categorie => ({
                    id: categorie.id,
                    nom: categorie.nom,
                    id_type_produit: categorie.typeProduit.id,
                    nom_type_produit: categorie.typeProduit.nom,
                }));
                setCategories(transformedCategories);
                setTypeProduits(response.data.data[1].map(typeProduit => ({
                    id: typeProduit.id,
                    nom: typeProduit.nom,
                })));
                console.log("response data 0 : ", response.data.data[0]);

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

        fetchCategories();
    }, [navigate, token, refresh]);

    // MODIFICATION
    const handleUpdate = (updatedCategorie) => {
        console.log('Categorie à mettre à jour:', updatedCategorie);
        setCategories((prevCategories) =>
            prevCategories.map((categorie) =>
                categorie.id === updatedCategorie.id ? updatedCategorie : categorie
            )
        );

        setRefresh(!refresh);
    };

    // AJOUT
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [newCategorieData, setNewCategorieData] = useState({
        nom: '',
        typeProduit: { id: '' },
    });

    const handleShowAdd = () => setShowModalAdd(true);
    const handleCloseAdd = () => setShowModalAdd(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'id_type_produit') {
            setNewCategorieData({ ...newCategorieData, typeProduit: { id: value } });
        } else {
            setNewCategorieData({ ...newCategorieData, [name]: value });
        }
    };

    const onAddCategorie = (newCategorie) => {
        console.log('Categorie ajouté avec succès:', newCategorie);
        setCategories(prevCategories => [...prevCategories, newCategorie]);

        setRefresh(!refresh);
    };

    const handleAddCategorie = async () => {
        try {

            const response = await axios.post('http://localhost:8080/categorie/save', {}, {
                params: {
                    nom: newCategorieData.nom,
                    id_type_produit: newCategorieData.typeProduit.id
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            });

            console.log("Réponse ", response.data);

            if (response.status === 200) {
                onAddCategorie(response.data);
                setShowModalAdd(false);
            } else {
                console.error('Erreur lors de l\'ajout du categorie:', response.statusText);
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du categorie:', error);
        }
    };

    if (!categories) {
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
                                            <h4 className="card-title mb-0 flex-grow-1">Catégorie</h4>
                                        </div>
                                        <div className="card-body">
                                            <div className="live-preview">
                                                <div className="row g-4 mb-3">
                                                    <div className="col-sm-auto">
                                                        <div>
                                                            <button type="button" onClick={handleShowAdd} className="btn btn-success add-btn"><i
                                                                className="fas fa-plus"></i> Ajouter une catégorie</button>
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
                                                                <th scope="col">Type Produit</th>
                                                                <th scope="col">Action</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {categories.map((cat) => (
                                                                <Categorie
                                                                    categories={cat}
                                                                    typeProduits={typeProduits}
                                                                    key={cat.id}
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

                            {/* Modal d'ajout de categories */}
                            <Modal show={showModalAdd} onHide={handleCloseAdd} centered size="lg">
                                <Modal.Header closeButton>
                                    <Modal.Title>Ajouter une catégorie</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group controlId="formNom">
                                            <Form.Label>Nom</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nom"
                                                value={newCategorieData.nom}
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formTypeProduit">
                                            <Form.Label>Type Produit</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="id_type_produit"
                                                value={newCategorieData.typeProduit.id}
                                                onChange={handleChange}
                                            >
                                                <option value="">Sélectionnez un type de categorie</option>
                                                {typeProduits.map((tp) => (
                                                    <option key={tp.id} value={tp.id}>{tp.nom}</option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseAdd}>
                                        Annuler
                                    </Button>
                                    <Button variant="primary" onClick={handleAddCategorie}>
                                        Ajouter la catégorie
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

export default ListCategorie;
