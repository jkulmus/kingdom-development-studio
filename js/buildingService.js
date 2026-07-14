import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { db } from "./firebaseConfig.js";

const BUILDINGS_COLLECTION = "buildings";

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