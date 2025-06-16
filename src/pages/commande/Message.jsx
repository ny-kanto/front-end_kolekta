/* eslint-disable react/prop-types */
// window.global = window;
import '../../components/init';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import { useNavigate } from "react-router-dom";
import { FaTimes } from 'react-icons/fa';
import { Form, Button, InputGroup } from 'react-bootstrap';
import '../../assets/message.css';

function Message({ acheteurId, vendeurId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [conversations, setConversations] = useState({
    id: "", vendeur: { id: "", nom: "", prenom: "" }, acheteur: { id: "", nom: "", prenom: "" }
  });
  const navigate = useNavigate();
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
      return;
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/message/list/${acheteurId}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setMessages(response.data.data[0]);
        setConversations(response.data.data[1]);
        scrollToBottom();

        console.log("data 0 : ", response.data.data[0]);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          navigate("/error/403");
        } else {
          console.error("Error fetching messages:", error);
        }
      }
    };

    // Initialisation de WebSocket
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = over(socket);

    stompClient.connect({}, () => {
      // Abonnement aux messages destinés à cet acheteur
      setIsConnected(true);
      stompClient.subscribe(`/user/${acheteurId}/queue/messages`, (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => {
          // Ajoute seulement si le message n'existe pas déjà
          if (!prevMessages.find(msg => msg.id === message.id)) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      });

      stompClient.subscribe(`/user/${vendeurId}/queue/messages`, (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => {
          // Ajoute seulement si le message n'existe pas déjà
          if (!prevMessages.find(msg => msg.id === message.id)) {
            return [...prevMessages, message];
          }
          return prevMessages;
        });
      });
    }, (error) => {
      console.error("Erreur de connexion WebSocket :", error);
    });

    setStompClient(stompClient);

    fetchMessages();

    return () => {
      if (isConnected) {
        stompClient.disconnect();
      }
    };
  }, [navigate, acheteurId, vendeurId]);

  // useEffect(() => {
  //   fetchMessages();
  // }, [acheteurId, navigate]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("contenu_message", newMessage);

    try {
      await axios.post(`http://localhost:8080/message/save-message/${acheteurId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (isConnected) {
        stompClient.send(`/app/chat/${acheteurId}`, {}, JSON.stringify({ contenu_message: newMessage }));
        setNewMessage('');
      } else {
        console.warn("La connexion WebSocket n'est pas encore établie.");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
    }
  };

  const toggleChat = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div className="floating-message-container">
      <div className={`chat-window ${isOpen ? 'open' : 'closed'}`}>
        <div className="chat-header d-flex align-items-center justify-content-between p-2 bg-info text-white">
          {conversations ? (
            <span>{conversations.acheteur.prenom} {conversations.acheteur.nom}</span>
          ) : (
            <span>Conversation</span>
          )}
          <div className="chat-controls">
            <FaTimes onClick={toggleChat} className="cursor-pointer" />
          </div>
        </div>
        {isOpen && (
          <>
            <div className="chat-body p-2 overflow-auto">
              {messages && messages.length > 0 ? (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className={`mb-2 d-flex ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'justify-content-end' : 'justify-content-start'}`}>
                      <div>
                        <small className={`text-muted d-block ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'text-end' : 'text-start'}`}>
                          {new Date(message.dateMessage).toLocaleString('fr-FR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </small>
                        <div
                          className={`chat-text d-inline-block p-2 rounded ${message.expediteur.utilisateur.email === sessionStorage.getItem("email") ? 'bg-info text-white' : 'bg-light'}`}
                        >
                          {message.contenuMessage}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              ) : (
                <p>Aucun message pour cette conversation.</p>
              )}
            </div>
            <div className="chat-footer p-2 border-top">
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
          </>
        )}
      </div>
    </div>
  );
}

export default Message;

