import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCeSm9uB-ZospUYo2oZ7eZKe56xOwNKBeQ",
    authDomain: "marhce-3bf53.firebaseapp.com",
    projectId: "marhce-3bf53",
    storageBucket: "marhce-3bf53.appspot.com",
    messagingSenderId: "882674592214",
    appId: "1:882674592214:web:2641365abd5eda57bc1c77",
    measurementId: "G-RX3RF9LZNX"
};

const vapidKey = "BGnLOqX2fpneAneGsunlG6o6ESVcnjwsobMo2tQFuiyH72xLwWxlPt7gzm5OPcjvfjNnnUI48TS2g_gHLInrDq4";

export default function requestFCMToken() {
    return Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);

            // Register service worker
            // if ('serviceWorker' in navigator) {
            //     navigator.serviceWorker.register('/front-end_marche/firebase-messaging-sw.js')
            //         .then((registration) => {
            //             console.log('Service Worker registered successfully:', registration);
            //         })
            //         .catch((err) => {
            //             console.error('Service Worker registration failed:', err);
            //         });
            // }

            return getToken(messaging, { vapidKey }).then((currentToken) => {
                if (currentToken) {
                    console.log("FCM Token:", currentToken);
                    return currentToken;
                } else {
                    console.log("No registration token available.");
                    return null;
                }
            }).catch((error) => {
                console.error("Error getting token:", error);
                return null;
            });
        } else {
            console.log("Notification permission denied.");
            return null;
        }
    });
}
