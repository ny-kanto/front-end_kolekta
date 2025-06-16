import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './pages/auth/LoginForm';
import LoginAdminForm from './pages/auth/LoginAdminForm';
import SignupForm from './pages/auth/SignupForm';
import ListProduit from './pages/produit/ListProduit';
import DetailProduit from './pages/produit/DetailProduit';
import Error from './components/Error';
import Entree from './pages/produit/Entree';
import EtatStock from './pages/produit/EtatStock';
import ListProduitUser from './pages/produit/ListProduitUser';
import DetailProduitUser from './pages/produit/DetailProduitUser';
import OrderList from './pages/produit/OrderList';
import Statistique from './pages/dashboard/Statistique';
import StatistiqueAdmin from './pages/dashboard/StatistiqueAdmin';
import ListCommandeProduit from './pages/commande/ListCommandeProduit';
import ListCommande from './pages/commande/ListCommande';
import Chat from './pages/utilisateur/Chat';
import VendeurProfile from './pages/utilisateur/VendeurProfile';
import VendeurProfileUser from './pages/utilisateur/VendeurProfileUser';
import AcheteurProfile from './pages/utilisateur/AcheteurProfile';
import Homepage from './pages/Homepage';
import PaymentSuccess from './pages/produit/PaymentSuccess';
import PaymentFailure from './pages/produit/PayementFailure';
import ListUser from './pages/utilisateur/ListUser';
import ListUnite from './pages/unite/ListUnite';
import ListCategorie from './pages/categorie/ListCategorie';
import MainComponent from './pages/MainComponent';
import ListCommandeAdmin from './pages/commande/ListCommandeAdmin';

// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker.register('/front-end_marche/firebase-messaging-sw.js')
//       .then((registration) => {
//           console.log('Service Worker registered successfully:', registration);
//       })
//       .catch((err) => {
//           console.error('Service Worker registration failed:', err);
//       });
// }

function App() {
  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<Homepage />} />
          <Route path="/admin-login" element={<LoginAdminForm />} />
          <Route path="/product-stock/entree" element={<Entree />} />
          <Route path="/product-stock/etat" element={<EtatStock />} />
          <Route path="/dashboard-product" element={<Statistique />} />
          <Route path="/admin-dashboard" element={<StatistiqueAdmin />} />
          <Route path="/list-user" element={<ListUser />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/product/list" element={<ListProduit />} />
          <Route path="/unite/list" element={<ListUnite />} />
          <Route path="/categorie/list" element={<ListCategorie />} />
          <Route path="/product-user/list" element={<ListProduitUser />} />
          <Route path="/product-user/:id" element={<DetailProduitUser />} />
          <Route path="/order/detail" element={<OrderList />} />
          <Route path="/commande/list-admin" element={<ListCommandeAdmin />} />
          <Route path="/commande/list" element={<ListCommande />} />
          <Route path="/commande-produit/list/:idCommande" element={<ListCommandeProduit />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/product/:id" element={<DetailProduit />} />
          <Route path="/user/profile-vendeur/:id" element={<VendeurProfile />} />
          <Route path="/user/profile-vendeur-acheteur/:id" element={<VendeurProfileUser />} />
          <Route path="/user/profile-acheteur/:id" element={<AcheteurProfile />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route path="/main-component" element={<MainComponent />} />
          <Route path="/error/403" element={<Error errorCode="403" title="Forbidden" message="Access is denied" redirectLink="/login" />} />
          {/* <Route path="*" element={<Error errorCode="404" title="Page Not Found" message="We couldn't find the page you are looking for" redirectLink="/login" />} /> */}
        </Routes>
      </Router>
    </>
  )
}

export default App;
