import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import Order from "../../components/Order";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderUser from "../../components/HeaderUser";
import Loading from "../../components/Loading";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [tva, setTva] = useState(0);
  const [ttc, setTtc] = useState(0);
  const [personne, setPersonne] = useState();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("token front : ", token);
    console.log("email front : ", sessionStorage.getItem("email"));

    if (!token) {
      navigate("/login");
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/panier/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        console.log("data 0 : ", response.data.data[0]);
        const rawTempOrders = response.data.data[0];
        const produitPhotos = response.data.data[1];
        setPersonne(response.data.data[3]);
        setTotal(response.data.data[4]);
        setTva(response.data.data[5]);
        setTtc(response.data.data[6]);

        const transformedOrders = rawTempOrders.map((order) => {
          const photo = produitPhotos[order.id] || {};

          return {
            id_produit: order.id,
            nom_produit: order.nom,
            prix_produit: order.prix,
            quantite: order.quantite,
            total: order.total,
            id_vendeur: order.id_vendeur,
            nom_vendeur: order.nom_vendeur,
            prenom_vendeur: order.prenom_vendeur,
            pseudo_vendeur: order.pseudo_vendeur,
            email_vendeur: order.email_vendeur,
            contact_vendeur: order.contact_vendeur,
            photoBase64: photo.base64 || "",
            photoMimeType: photo.mimeType || "",
          };
        });

        console.log("transformed Orders : ", transformedOrders);

        setOrders(transformedOrders);

        console.log("response data ", response.data);
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

    fetchOrders();
  }, [navigate, refresh]);

  const handleUpdate = (productId, newQuantity) => {
    const updatedOrders = orders.map((order) =>
      order.id_produit === productId
        ? { ...order, quantite: newQuantity }
        : order
    );
    setOrders(updatedOrders);

    setRefresh(!refresh);
  };

  const handleDelete = (productId) => {
    const updatedOrders = orders.filter(
      (order) => order.id_produit !== productId
    );
    setOrders(updatedOrders);

    setRefresh(!refresh);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8080/panier/update/${productId}`,
        { quantite: newQuantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        handleUpdate(productId, newQuantity);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      if (error.response && error.response.data) {
        setError(error.response.data.message);

        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  // Fonction pour supprimer un produit du panier
  const handleRemoveProduct = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:8080/panier/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        handleDelete(productId);
      }
    } catch (error) {
      console.error("Error removing product:", error);
      setError(error.message);
    }
  };

  if (!orders) {
    return <Loading />;
  }

  console.log("error : ", error);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderUser refresh={refresh} />
      </div>
      <div className="mt-5 mb-5">
        <div className="mt-5">
          <div className="min-vh-100">
            <Order
              orders={orders}
              onQuantityChange={handleQuantityChange}
              onRemoveProduct={handleRemoveProduct}
              error={error}
              totalGlobal={total}
              tvaGlobal={tva}
              ttc={ttc}
              personne={personne}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default OrderList;
