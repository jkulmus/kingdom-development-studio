/**
 * Firestore service for building records.
 *
 * Keeps all Firestore database operations separate
 * from the application and interface code.
 */

import {
    addDoc,
    collection,
    deleteDoc,
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

/**
 * Delete an existing building document.
 */
export async function deleteBuilding(buildingId) {
    const documentReference = doc(
        db,
        BUILDINGS_COLLECTION,
        buildingId
    );

    await deleteDoc(documentReference);
}
