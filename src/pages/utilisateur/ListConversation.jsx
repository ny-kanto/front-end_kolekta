/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup } from 'react-bootstrap';
import '../../assets/conversation.css';
import { useNavigate } from "react-router-dom";

function ListConversation({ onConversationClick }) {
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [recherche, setRecherche] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
        }

        const params = new URLSearchParams({
            recherche: recherche
        });

        const fetchConversations = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/conversation/list?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                });

                // const url = `http://localhost:8080/conversation/list?${params.toString()}`;

                // console.log("url", url);

                // console.log("conversation : ", response.data.data[0]);
                setConversations(response.data.data[0]);
            } catch (error) {
                console.error("Error fetching conversations:", error);
            }
        };

        fetchConversations();
    }, [navigate, onConversationClick, recherche]);

    const handleSearch = async (e) => {
        const { name, value } = e.target;

        if (name === "recherche") {
            const updatedsearch = name === "recherche" ? value : recherche;

            setRecherche(updatedsearch);
        }
    };

    return (
        <div className="message-app">
            <div className="contacts-list bg-light">
                <div className="search-bar d-flex align-items-center p-3">
                    <InputGroup>
                        <Form.Control placeholder="Rechercher..." value={recherche} name="recherche" onChange={handleSearch} />
                    </InputGroup>
                </div>

                <h6 className="section-title px-3">Chats</h6>

                <ul className="list-unstyled p-3 overflow-y-auto">
                    {conversations.map(conversation => (
                        <li
                            key={conversation.id}
                            className="conversation-item d-flex align-items-center mb-3"
                            onClick={() => onConversationClick(conversation)}
                        >
                            <div className="ml-3">
                                <h6 className="mb-1 text-dark">{conversation.vendeur.prenom} {conversation.vendeur.nom}</h6>
                                <p className="text-muted mb-0">
                                    {conversation.dernierExpediteur === conversation.acheteur.id
                                        ? "Vous : " + conversation.dernierMessage
                                        : conversation.dernierMessage}
                                </p>

                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default ListConversation;
