import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Footer from "../../components/Footer";
import DetailProductUser from "../../components/DetailProductUser";
import { useState } from "react";
import HeaderUser from "../../components/HeaderUser";

function DetailProduitUser() {
  const [refresh, setRefresh] = useState(false);
  const handleAddToCart = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="mb-5">
        <HeaderUser refresh={refresh} />
      </div>
      <div className="mt-5 mb-5">
        <div
          className="mt-5"
        >
          <div className="min-vh-100">
            <DetailProductUser onAddToCart={handleAddToCart} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DetailProduitUser;
