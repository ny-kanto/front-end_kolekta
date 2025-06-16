import { useEffect } from 'react';
import requestFCMToken from '../utils/firebaseUtils';

const MainComponent = () => {
    useEffect(() => {
        const storeToken = async () => {
            try {
                console.log("Requesting FCM token...");
                const token = await requestFCMToken();
                console.log("Received FCM token:", token);
                if (token) {
                    console.log("Sending token to backend...");
                    await fetch("http://localhost:8080/user/update-fcm-token", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        },
                        body: JSON.stringify({ fcmToken: token }),
                    });
                    console.log("Token stored successfully.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération du FCM token:", error);
            }
        };
        
        storeToken();
    }, []);

    return <div>Votre application</div>;
};

export default MainComponent;
