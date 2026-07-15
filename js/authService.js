/**
 * Firebase Authentication service.
 *
 * Keeps login and logout operations separate from
 * the main application controller.
 */

import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { auth } from "./firebaseConfig.js";

/**
 * Sign in using an email address and password.
 */
export async function login(email, password) {
    return signInWithEmailAndPassword(
        auth,
        email,
        password
    );
}

/**
 * Sign out the currently authenticated user.
 */
export async function logout() {
    return signOut(auth);
}

/**
 * Observe changes to the current authentication state.
 */
export function observeAuthState(callback) {
    return onAuthStateChanged(auth, callback);
}