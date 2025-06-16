/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
import Loading from './Loading';

function Categorie({ unites, onUpdate }) {
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editData, setEditData] = useState({
    nom: '',
  });

  useEffect(() => {
    if (showModalEdit) {
      setEditData({
        nom: unites.nom,
      });
    }
  }, [showModalEdit, unites]);

  const handleEdit = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await axios.put(`http://localhost:8080/unite/update/${unites.id}`, {}, {
        params: {
          nom: editData.nom
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Réponse de l\'API lors de la mise à jour:', response.data);

      if (response.status === 200) {
        onUpdate(unites.id);
        setShowModalEdit(false);
      }
    } catch (error) {
      console.error('Erreur lors de la modification du unite:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };


  if (!unites) {
    return <Loading />
  }

  return (
    <>
      <tr>
        <td></td>
        <td>{unites.nom}</td>
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
          <Modal.Title>Modifier l&apos;unité {unites.nom}</Modal.Title>
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
