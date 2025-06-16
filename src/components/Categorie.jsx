/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Loading from './Loading';

function Categorie({ categories, typeProduits, onUpdate }) {
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editData, setEditData] = useState({
    nom: '',
    id_type_produit: ''
  });

  useEffect(() => {
    if (showModalEdit) {
      setEditData({
        nom: categories.nom,
        id_type_produit: categories.id_type_produit
      });
    }
  }, [showModalEdit, categories]);

  const handleEdit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(`http://localhost:8080/categorie/update/${categories.id}`, {}, {
        params: {
          nom: editData.nom,
          id_type_produit: editData.id_type_produit
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Réponse de l\'API lors de la mise à jour:', response.data);

      if (response.status === 200) {
        onUpdate(categories.id);
        setShowModalEdit(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du categorie:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'id_type_produit') {
      setEditData({ ...editData, id_type_produit: value });
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };


  if (!categories) {
    return <Loading />
  }

  return (
    <>
      <tr>
        <td></td>
        <td>{categories.nom}</td>
        <td>{categories.nom_type_produit}</td>
        <td>
          <div className="hstack gap-3 flex-wrap">
            <a href='#' className="link-info fs-15" onClick={() => setShowModalEdit(true)}>
              <i className="fa fa-pencil"></i>
            </a>
          </div>
        </td>
      </tr>

      {/* Modal de modification */}
      <Modal
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Modifier la catégorie {categories.nom}</Modal.Title>
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
            <Form.Group controlId="formTypeProduit">
              <Form.Label>Type de Produit</Form.Label>
              <Form.Control
                as="select"
                name="id_type_produit"
                value={editData.id_type_produit}
                onChange={handleChange}
              >
                <option value="">Sélectionnez un type de produit</option>
                {typeProduits.map((tp) => (
                  <option key={tp.id} value={tp.id}>{tp.nom}</option>
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

export default Categorie;
