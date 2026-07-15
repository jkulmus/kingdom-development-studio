/**
 * Firestore service for building records.
 *
 * Keeps all Firestore database operations separate
 * from the application and interface code.
 */

import {
    addDoc,
    collection,
    doc,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebaseConfig.js";

const BUILDINGS_COLLECTION = "buildings";

/**
 * Retrieve every building record from Firestore.
 */
export async function getBuildings() {
    const snapshot = await getDocs(
        collection(db, BUILDINGS_COLLECTION)
    );

    return snapshot.docs.map((document) => {
        return {
            id: document.id,
            ...document.data()
        };
    });
}

/**
 * Create a new building document.
 *
 * @returns {Promise<string>} The new Firestore document ID.
 */
export async function addBuilding(buildingData) {
    const documentReference = await addDoc(
        collection(db, BUILDINGS_COLLECTION),
        buildingData
    );

    return documentReference.id;
}

/**
 * Update an existing building document.
 *
 * @param {string} buildingId Firestore document ID.
 * @param {object} buildingData Updated building information.
 */
export async function updateBuilding(
    buildingId,
    buildingData
) {
    const documentReference = doc(
        db,
        BUILDINGS_COLLECTION,
        buildingId
    );

    await updateDoc(
        documentReference,
        buildingData
    );

    return buildingId;
}