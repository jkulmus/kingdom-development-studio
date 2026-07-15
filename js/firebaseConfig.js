/**
 * Firebase configuration and service initialization.
 *
 * This browser application uses Firebase's Web SDK.
 * It does not use a service-account credential file.
 */

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCyUdVZZNs4wIsYnwH97JYH1ObPu2sDVq8",
    authDomain: "kingdom-development-studio.firebaseapp.com",
    projectId: "kingdom-development-studio",
    storageBucket: "kingdom-development-studio.firebasestorage.app",
    messagingSenderId: "1077761322514",
    appId: "1:1077761322514:web:da272b791e5f7bd8d772cb"
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);