/* eslint-disable react/prop-types */
// window.global = window;
import '../../components/init';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { Form, Button, InputGroup } from 'react-bootstrap';
import '../../assets/messageUser.css';
import { useNavigate } from "react-router-dom";

function MessageUser({ conversation }) {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [stompClient, setStompClient] = useState(null);
    const messagesEndRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/conversation/list-message/${conversation.vendeur.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setMessages(response.data.data[0]);
                console.log("data 0 : ", response.data.data[0]);
                scrollToBottom();
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        // Initialise WebSocket
        const socket = new SockJS('http://localhost:8080/ws');
        const stompClient = over(socket);
        stompClient.connect({}, () => {
            setIsConnected(true);
            stompClient.subscribe(`/user/${conversation.vendeur.id}/queue/messages`, (messageOutput) => {
                const message = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => {
                    // Ajoute seulement si le message n'existe pas déjà
                    if (!prevMessages.find(msg => msg.id === message.id)) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
            });

            stompClient.subscribe(`/user/${conversation.acheteur.id}/queue/messages`, (messageOutput) => {
                const message = JSON.parse(messageOutput.body);
                setMessages((prevMessages) => {
                    // Ajoute seulement si le message n'existe pas déjà
                    if (!prevMessages.find(msg => msg.id === message.id)) {
                        return [...prevMessages, message];
                    }
                    return prevMessages;
                });
            });
        });
        setStompClient(stompClient);
        fetchMessages();
        return () => {
            if (isConnected) {
                stompClient.disconnect();
            }
        };
    }, [navigate, conversation]);

    // useEffect(() => {
    //     fetchMessages();
    // }, [conversation]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("contenu_message", newMessage);
            await axios.post(`http://localhost:8080/conversation/save-message/${conversation.vendeur.id}`, formDataToSend, {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });
            if (isConnected) {
                stompClient.send(`/app/chat/${conversation.vendeur.id}`, {}, JSON.stringify({ contenu_message: newMessage }));
                setNewMessage('');
            } else {
                console.warn("La connexion WebSocket n'est pas encore établie.");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="message-app">
            <div className="chat-window-user">
                <div className="chat-header-user d-flex align-items-center justify-content-between p-2 bg-info text-white">
                    <span>{conversation.vendeur.prenom} {conversation.vendeur.nom}</span>
                </div>
                <div className="chat-body-user p-2 overflow-auto">
                    {messages.map(message => (
                        <div key={message.id} className={`mb-2 d-flex ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'justify-content-end' : 'justify-content-start'}`}>
                            <div>
                                <small className={`text-muted d-block ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'text-end' : 'text-start'}`}>
                                    {new Date(message.dateMessage).toLocaleString()}
                                </small>
                                <div className={`chat-text-user p-2 rounded ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'bg-info text-white' : 'bg-light'}`}>
                                    {message.contenuMessage}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-footer-user p-2 border-top">
                    <InputGroup>
                        <Form.Control
                            placeholder="Ecrivez un message ..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button variant="info" style={{ color: "white" }} onClick={handleSendMessage}>
                            Envoyer
                        </Button>
                    </InputGroup>
                </div>
            </div>
        </div>
    );
}

export default MessageUser;
