/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Loading from './Loading';

function Produit({ produit, categories, unites, regions, onDelete, onUpdate }) {
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editData, setEditData] = useState({
    nom: '',
    description: '',
    prix: '',
    unite: { id: '' },
    minCommande: '',
    delaisLivraison: '',
    categorie: { id: '' },
    localisation: '',
    region: { id: '' }
  });

  // Charger les données du produit dans editData lorsque le modal est ouvert
  useEffect(() => {
    if (showModalEdit) {
      setEditData({
        nom: produit.nom,
        description: produit.description,
        prix: produit.prix,
        unite: { id: produit.id_unite },
        minCommande: produit.minCommande,
        delaisLivraison: produit.delaisLivraison,
        categorie: { id: produit.id_categorie },
        localisation: produit.localisation,
        region: { id: produit.id_region }
      });
    }
  }, [showModalEdit, produit]);

  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete(`http://localhost:8080/produit/delete/${produit.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        onDelete(produit.id);
        setShowModalDelete(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(`http://localhost:8080/produit/update/${produit.id}`, editData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Réponse de l\'API lors de la mise à jour:', response.data);

      if (response.status === 200) {
        onUpdate(produit.id);
        setShowModalEdit(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du produit:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'id_unite') {
      setEditData({ ...editData, unite: { id: value } });
    } else if (name === 'id_categorie') {
      setEditData({ ...editData, categorie: { id: value } });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };


  if (!produit) {
    return <Loading />
  }

  return (
    <>
      <tr>
        <td></td>
        <td>{produit.nom}</td>
        {/* <td>{produit.prix.toLocaleString('fr-FR')}</td> */}
        {produit.prix ? (
          <td>{produit.prix.toLocaleString('fr-FR')}</td>
        ) : (
          <td>{produit.prix}</td>
        )}
        <td>{produit.nom_unite}</td>
        <td>{produit.nom_categorie}</td>
        <td>
          <div className="hstack gap-3 flex-wrap">
            <a href='#' className="link-info fs-15" onClick={() => setShowModalEdit(true)}>
              <i className="fa fa-pencil"></i>
            </a>
            <a href={`/product/${produit.id}`} className="link-success fs-15">
              <i className="fa fa-file-text"></i>
            </a>
            <a href='#' className="link-danger fs-15" onClick={() => setShowModalDelete(true)}>
              <i className="fa fa-trash"></i>
            </a>
          </div>
        </td>
      </tr>

      {/* Modal de confirmation de suppression */}
      <Modal
        show={showModalDelete}
        onHide={() => setShowModalDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer le produit {produit.nom} ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalDelete(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de modification */}
      <Modal
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier le produit {produit.nom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={editData.nom}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editData.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrix">
              <Form.Label>Prix</Form.Label>
              <Form.Control
                type="number"
                name="prix"
                value={editData.prix}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formMinCommande">
              <Form.Label>Quantité Minimum</Form.Label>
              <Form.Control
                type="number"
                name="minCommande"
                value={editData.minCommande}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDelaisLivraison">
              <Form.Label>Délai de Livraison</Form.Label>
              <Form.Control
                type="number"
                name="delaisLivraison"
                value={editData.delaisLivraison}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formUnite">
              <Form.Label>Unité</Form.Label>
              <Form.Control
                as="select"
                name="id_unite"
                value={editData.unite.id}  // Modification ici
                onChange={handleChange}
              >
                <option value="">Sélectionnez une unité</option>
                {unites.map((unite) => (
                  <option key={unite.id} value={unite.id}>{unite.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formCategorie">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                as="select"
                name="id_categorie"
                value={editData.categorie.id}  // Modification ici
                onChange={handleChange}
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formLocalisation">
              <Form.Label>Localisation</Form.Label>
              <Form.Control
                type="text"
                name="localisation"
                value={editData.localisation}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formCategorie">
              <Form.Label>Région</Form.Label>
              <Form.Control
                as="select"
                name="id_region"
                value={editData.region.id}  // Modification ici
                onChange={handleChange}
              >
                <option value="">Sélectionnez une région</option>
                {regions.map((reg) => (
                  <option key={reg.id} value={reg.id}>{reg.nom}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalEdit(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleEdit}>
            Sauvegarder les modifications
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Produit;
