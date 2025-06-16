import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/homepage.css';
import Footer from '../components/Footer';
import HeaderHome from '../components/HeaderHome';

const Homepage = () => {
    return (
        <div className="homepage">
            {/* Section de contact en haut */}
            {/* <div className="contact-section text-center p-2">
                <span>Contactez-nous au 06 62 07 79 36 ou au 06 88 54 59 53</span>
            </div> */}
            <HeaderHome />
            {/* Section principale avec image de fond */}
            <div className="hero-section d-flex align-items-center justify-content-center text-center text-dark" id='home'>
                <div className="hero-content">
                    <h1>Bienvenue sur Kolekta</h1>
                    <h3>La plateforme qui connecte les agriculteurs et les acheteurs en toute simplicité !</h3>
                </div>
            </div>

            {/* Section Faciliter vos échanges agricoles */}
            <div className="change-section container text-center py-5 w-50">
                <h2>Faciliter vos échanges agricoles</h2>
                <p>Nous révolutionnons la manière dont les agriculteurs et éleveurs commercialisent
                    leurs produits à Madagascar. Avec Kolekta, vous pouvez désormais
                    vendre et acheter facilement, où que vous soyez.</p>
            </div>

            {/* Section Pourquoi choisir Kolekta */}
            <div className="features-section container text-center py-5" id='pourquoi'>
                <h2>Pourquoi choisir Kolekta ?</h2>
                <div className="row">
                    <div className="col-md-3">
                        <i className="fas fa-seedling fa-3x"></i>
                        <h4 className='mt-2'>Vendez vos produits</h4>
                        <p>Agriculteurs, gagnez du temps ! Inscrivez-vous sur notre plateforme,
                            créez votre profil, et commencez à proposer vos produits à une communauté grandissante d&apos;acheteurs
                            intéressés par la qualité et la traçabilité de vos récoltes.</p>
                    </div>
                    <div className="col-md-3">
                        <i className="fas fa-shopping-basket fa-3x"></i>
                        <h4 className='mt-2'>Achetez local</h4>
                        <p>Vous cherchez des produits frais, directement auprès des producteurs ?
                            Kolekta vous permet d&apos;accéder à une large gamme de produits agricoles locaux,
                            tout en soutenant l&apos;économie rurale.
                        </p>
                    </div>
                    <div className="col-md-3">
                        <i className="fas fa-handshake fa-3x"></i>
                        <h4 className='mt-2'>Des prix justes</h4>
                        <p>Finies les pressions des intermédiaires ! Nous garantissons
                            une meilleure visibilité sur les prix et favorisons des échanges équitables
                            entre les producteurs et les acheteurs.
                        </p>
                    </div>
                    <div className="col-md-3">
                        <i className="fas fa-truck fa-3x"></i>
                        <h4 className='mt-2'>Facilitez la logistique</h4>
                        <p>Nous mettons à votre disposition des options de livraison
                            flexibles pour vous permettre de recevoir vos produits dans les meilleures conditions.</p>
                    </div>
                </div>
            </div>

            {/* Section des catégories de produits */}
            <div className="categories-section text-center py-5" id='categories'>
                <h2>Nos catégories de produits</h2>
                <div className="row justify-content-center">
                    {/* Première ligne avec 5 catégories */}
                    <div className="col-md-2">
                        <i className="fas fa-apple-alt fa-3x"></i>
                        <p>Fruits et Légumes</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-wheat-alt fa-3x"></i>
                        <p>Céréales et Légumineuses</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-seedling fa-3x"></i>
                        <p>Plantes et Herbes Aromatiques</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-leaf fa-3x"></i>
                        <p>Noix et Graines</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-drumstick-bite fa-3x"></i>
                        <p>Viande</p>
                    </div>
                </div>

                {/* Deuxième ligne avec 4 catégories */}
                <div className="row justify-content-center">
                    <div className="col-md-2">
                        <i className="fas fa-cheese fa-3x"></i>
                        <p>Produits Laitiers</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-egg fa-3x"></i>
                        <p>Œufs</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-fish fa-3x"></i>
                        <p>Poissons et Fruits de Mer</p>
                    </div>
                    <div className="col-md-2">
                        <i className="fas fa-lemon fa-3x"></i>
                        <p>Miel et Produits de la Ruche</p>
                    </div>
                </div>
            </div>

            {/* Section Comment ça marche */}
            <div className="how-it-works-section container py-5" id='comment'>
                <h2 className="text-center mb-5">Comment ça marche ?</h2>

                {/* Point commun : Inscription */}
                <div className="text-center mb-5">
                    <div className="card text-center shadow-sm p-3 mb-3">
                        <div className="card-body">
                            <i className="fas fa-user-plus fa-3x mb-3"></i>
                            <h4 className="card-title">Inscription facile</h4>
                            <p className="card-text">Créez votre compte en quelques minutes.</p>
                        </div>
                    </div>
                    <i className="fas fa-arrow-down fa-3x mb-4"></i>
                </div>

                {/* Chemins Vendeur et Acheteur */}
                <div className="row">
                    {/* Chemin Vendeur */}
                    <div className="col-md-6">
                        <h4 className="text-center mb-4">Vendeur</h4>
                        <div className="d-flex flex-column align-items-center">
                            {/* Ajout des produits */}
                            <div className="card text-center shadow-sm p-3 mb-4">
                                <div className="card-body">
                                    <i className="fas fa-box-open fa-3x mb-3"></i>
                                    <h4 className="card-title">Ajoutez vos produits</h4>
                                    <p className="card-text">Publiez vos offres avec des détails et des photos.</p>
                                </div>
                            </div>
                            <i className="fas fa-arrow-down fa-3x mb-4"></i>

                            {/* Trouver des clients */}
                            <div className="card text-center shadow-sm p-3 mb-4">
                                <div className="card-body">
                                    <i className="fas fa-handshake fa-3x mb-3"></i>
                                    <h4 className="card-title">Trouvez vos clients</h4>
                                    <p className="card-text">Connectez-vous avec des acheteurs partout dans le pays.</p>
                                </div>
                            </div>
                            <i className="fas fa-arrow-down fa-3x mb-4"></i>

                            {/* Livraison et paiements */}
                            <div className="card text-center shadow-sm p-3">
                                <div className="card-body">
                                    <i className="fas fa-truck fa-3x mb-3"></i>
                                    <h4 className="card-title">Livraison & paiements</h4>
                                    <p className="card-text">Gérez vos transactions directement sur la plateforme.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chemin Acheteur */}
                    <div className="col-md-6">
                        <h4 className="text-center mb-4">Acheteur</h4>
                        <div className="d-flex flex-column align-items-center">
                            {/* Parcourez les produits */}
                            <div className="card text-center shadow-sm p-3 mb-4">
                                <div className="card-body">
                                    <i className="fas fa-search fa-3x mb-3"></i>
                                    <h4 className="card-title">Parcourez les produits</h4>
                                    <p className="card-text">Explorez une vaste gamme de produits locaux.</p>
                                </div>
                            </div>
                            <i className="fas fa-arrow-down fa-3x mb-4"></i>

                            {/* Commandez en ligne */}
                            <div className="card text-center shadow-sm p-3 mb-4">
                                <div className="card-body">
                                    <i className="fas fa-shopping-cart fa-3x mb-3"></i>
                                    <h4 className="card-title">Commandez en ligne</h4>
                                    <p className="card-text">Passez vos commandes en quelques clics.</p>
                                </div>
                            </div>
                            <i className="fas fa-arrow-down fa-3x mb-4"></i>

                            {/* Livraison rapide */}
                            <div className="card text-center shadow-sm p-3">
                                <div className="card-body">
                                    <i className="fas fa-shipping-fast fa-3x mb-3"></i>
                                    <h4 className="card-title">Livraison rapide</h4>
                                    <p className="card-text">Recevez vos produits chez vous rapidement.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section Call to Action */}
            <div className="cta-section text-center py-5">
                <h2>Rejoignez-nous maintenant !</h2>
                <p className="mx-auto" style={{ width: "50%" }}>
                    Que vous soyez agriculteur, éleveur, ou simplement à la recherche de
                    produits frais, Kolekta est la solution idéale pour répondre à vos besoins.
                    Ensemble, construisons un avenir plus durable pour l&apos;agriculture à Madagascar.
                </p>
                <a className="btn btn-outline-success btn-lg m-2" href='/signup'>Inscrivez-vous dès aujourd&apos;hui !</a>
                <a className="btn btn-outline-primary btn-lg m-2" href='/login'>Connectez-vous !</a>
            </div>

            <Footer />
        </div>
    );
};

export default Homepage;
