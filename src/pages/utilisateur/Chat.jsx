import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ListConversation from "./ListConversation";
import MessageUser from "./MessageUser";
import Footer from "../../components/Footer";
import HeaderUser from "../../components/HeaderUser";
import 'bootstrap-icons/font/bootstrap-icons.css';

const Chat = () => {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const navigate = useNavigate();

    const handleConversationClick = (conversation) => {
        setSelectedConversation(conversation);
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <div className="mb-5">
                <HeaderUser />
            </div>
            <div className="row mt-5 mb-5 min-vh-100">
                <div className="d-flex justify-content-between">
                    {/* Flèche de retour */}
                    <div className="position-absolute" style={{ top: '70px', left: '20px' }}>
                        <i
                            className="bi bi-arrow-left fs-3"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(-1)}
                        ></i>
                    </div>

                    {/* Liste des conversations */}
                    <div style={{ width: "30%", borderRight: "1px solid #ccc" }}>
                        <ListConversation onConversationClick={handleConversationClick} />
                    </div>

                    {/* Section des messages */}
                    <div style={{ width: "70%", paddingLeft: "20px" }}>
                        {selectedConversation ? (
                            <MessageUser conversation={selectedConversation} />
                        ) : (
                            <p>Sélectionnez une conversation pour regarder les messages</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Chat;
