/**
 * Kingdom Development Studio
 * Main application controller
 *
 * Loads Firestore records, manages authentication,
 * controls searching and filtering, creates, edits,
 * and deletes buildings, and updates the dashboard.
 */

import {
    buildings as localBuildings
} from "./data.js";

import {
    addBuilding,
    deleteBuilding,
    getBuildings,
    updateBuilding
} from "./buildingService.js";

import {
    initializeAuthentication
} from "./controllers/authController.js";

import {
    formatCurrency,
    sortBuildings
} from "./utils.js";

import { renderBuildings } from "./ui/buildingList.js";
import { showBuildingDetails } from "./ui/buildingDetails.js";

// Main interface elements
const buildingGrid = document.getElementById("buildingGrid");
const detailsPanel = document.getElementById("detailsPanel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Dashboard statistics
const kingdomCount = document.getElementById("kingdomCount");
const buildingCount = document.getElementById("buildingCount");
const phaseOneCount = document.getElementById("phaseOneCount");
const planningCount = document.getElementById("planningCount");
const investmentTotal = document.getElementById("investmentTotal");

// Kingdom filters
const kingdomButtons = document.querySelectorAll(".kingdom-btn");

// Authentication elements
const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const userPanel = document.getElementById("userPanel");
const userEmail = document.getElementById("userEmail");
const logoutButton = document.getElementById("logoutButton");

// Add/Edit Building toolbar and modal
const addBuildingButton =
    document.getElementById("addBuildingButton");

const buildingModal =
    document.getElementById("buildingModal");

const buildingModalTitle =
    document.getElementById("buildingModalTitle");

const closeModalButton =
    document.getElementById("closeModalButton");

const cancelModalButton =
    document.getElementById("cancelModalButton");

const buildingForm =
    document.getElementById("buildingForm");

const saveBuildingButton =
    document.getElementById("saveBuildingButton");

// Building form fields
const buildingName =
    document.getElementById("buildingName");

const buildingKingdom =
    document.getElementById("buildingKingdom");

const buildingCategory =
    document.getElementById("buildingCategory");

const buildingPhase =
    document.getElementById("buildingPhase");

const buildingStatus =
    document.getElementById("buildingStatus");

const buildingPriority =
    document.getElementById("buildingPriority");

const buildingCost =
    document.getElementById("buildingCost");

const buildingProgress =
    document.getElementById("buildingProgress");

const buildingSize =
    document.getElementById("buildingSize");

const buildingCompletion =
    document.getElementById("buildingCompletion");

const buildingDescription =
    document.getElementById("buildingDescription");

const buildingNotes =
    document.getElementById("buildingNotes");

// Application state
let buildings = [];
let selectedKingdom = "all";
let currentUser = null;
let currentEditingBuildingId = null;
let currentSelectedBuildingId = null;

/**
 * Restore the default details-panel message.
 */
function resetDetailsPanel() {
    detailsPanel.innerHTML = `
        <h2>Building Details</h2>

        <p>
            Select a building to view its planning details,
            estimated cost, progress, priority, and notes.
        </p>
    `;
}

/**
 * Show a loading message while Firestore is queried.
 */
function showLoadingState() {
    buildingGrid.innerHTML = `
        <div class="empty-state">
            <h3>Loading buildings</h3>
            <p>Retrieving project records from Firestore...</p>
        </div>
    `;
}

/**
 * Update the dashboard statistic cards.
 */
function updateDashboardStats() {
    const uniqueKingdoms = new Set(
        buildings.map((building) => building.kingdom)
    );

    const totalInvestment = buildings.reduce(
        (total, building) => {
            return total + Number(building.estimatedCost || 0);
        },
        0
    );

    kingdomCount.textContent = uniqueKingdoms.size;
    buildingCount.textContent = buildings.length;

    phaseOneCount.textContent = buildings.filter((building) => {
        return building.phase === "Phase 1";
    }).length;

    planningCount.textContent = buildings.filter((building) => {
        return building.status === "Planning";
    }).length;

    investmentTotal.textContent =
        formatCurrency(totalInvestment);
}

/**
 * Display one building and administrator actions.
 */
function displayBuildingDetails(building) {
    currentSelectedBuildingId = building.id;

    showBuildingDetails(
        building,
        detailsPanel,
        {
            canManage: Boolean(currentUser),
            onEdit: openEditBuildingModal,
            onDelete: confirmAndDeleteBuilding
        }
    );
}

/**
 * Refresh the currently selected building details.
 */
function refreshSelectedBuildingDetails() {
    if (!currentSelectedBuildingId) {
        return;
    }

    const selectedBuilding = buildings.find((building) => {
        return building.id === currentSelectedBuildingId;
    });

    if (selectedBuilding) {
        displayBuildingDetails(selectedBuilding);
    } else {
        currentSelectedBuildingId = null;
        resetDetailsPanel();
    }
}

/**
 * Search, filter, and sort building records.
 */
function filterBuildings() {
    const searchTerm = searchInput.value
        .trim()
        .toLowerCase();

    const selectedCategory = categoryFilter.value;

    const filteredBuildings = buildings.filter((building) => {
        const searchableText = `
            ${building.name || ""}
            ${building.description || ""}
            ${building.kingdom || ""}
            ${building.category || ""}
            ${building.phase || ""}
            ${building.status || ""}
            ${building.priority || ""}
            ${building.notes || ""}
        `.toLowerCase();

        const matchesSearch =
            searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            building.category === selectedCategory;

        const matchesKingdom =
            selectedKingdom === "all" ||
            building.kingdom === selectedKingdom;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesKingdom
        );
    });

    const sortedBuildings = sortBuildings(
        filteredBuildings,
        sortFilter.value
    );

    renderBuildings(
        sortedBuildings,
        buildingGrid,
        displayBuildingDetails
    );
}

/**
 * Configure kingdom filter buttons.
 */
function initializeKingdomButtons() {
    kingdomButtons.forEach((button) => {
        button.addEventListener("click", () => {
            kingdomButtons.forEach((currentButton) => {
                currentButton.classList.remove("active");
            });

            button.classList.add("active");
            selectedKingdom = button.dataset.kingdom;

            filterBuildings();
        });
    });
}

/**
 * Reset the modal form.
 */
function resetBuildingForm() {
    buildingForm.reset();

    buildingModalTitle.textContent = "Add Building";
    saveBuildingButton.textContent = "Save Building";

    buildingKingdom.value = "Castle Kingdom";
    buildingCategory.value = "food";
    buildingPhase.value = "Phase 1";
    buildingStatus.value = "Planning";
    buildingPriority.value = "Medium";
    buildingCost.value = "0";
    buildingProgress.value = "0";

    currentEditingBuildingId = null;
}

/**
 * Display the building modal.
 */
function showBuildingModal() {
    buildingModal.classList.remove("hidden");
    buildingModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
        buildingName.focus();
    }, 0);
}

/**
 * Open a blank Add Building form.
 */
function openAddBuildingModal() {
    if (!currentUser) {
        return;
    }

    resetBuildingForm();
    showBuildingModal();
}

/**
 * Open the form with an existing building's values.
 */
function openEditBuildingModal(building) {
    if (!currentUser || !building.id) {
        return;
    }

    resetBuildingForm();

    currentEditingBuildingId = building.id;

    buildingModalTitle.textContent = "Edit Building";
    saveBuildingButton.textContent = "Save Changes";

    buildingName.value = building.name || "";
    buildingKingdom.value =
        building.kingdom || "Castle Kingdom";

    buildingCategory.value =
        building.category || "food";

    buildingPhase.value =
        building.phase || "Phase 1";

    buildingStatus.value =
        building.status || "Planning";

    buildingPriority.value =
        building.priority || "Medium";

    buildingCost.value =
        Number(building.estimatedCost || 0);

    buildingProgress.value =
        Number(building.progress || 0);

    buildingSize.value = building.size || "";

    buildingCompletion.value =
        building.targetCompletion || "";

    buildingDescription.value =
        building.description || "";

    buildingNotes.value =
        building.notes || "";

    showBuildingModal();
}

/**
 * Close and reset the modal.
 */
function closeBuildingModal() {
    buildingModal.classList.add("hidden");
    buildingModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    resetBuildingForm();
}

/**
 * Convert form values into a Firestore record.
 */
function createBuildingRecord() {
    return {
        name: buildingName.value.trim(),
        kingdom: buildingKingdom.value,
        category: buildingCategory.value,
        phase: buildingPhase.value.trim(),
        status: buildingStatus.value,
        size: buildingSize.value.trim(),
        estimatedCost: Number(buildingCost.value),
        priority: buildingPriority.value,
        targetCompletion:
            buildingCompletion.value.trim(),
        progress: Number(buildingProgress.value),
        description:
            buildingDescription.value.trim(),
        notes: buildingNotes.value.trim()
    };
}

/**
 * Validate important building values.
 */
function validateBuildingRecord(building) {
    if (!building.name) {
        window.alert("Enter a building name.");
        buildingName.focus();
        return false;
    }

    if (!building.phase) {
        window.alert("Enter a development phase.");
        buildingPhase.focus();
        return false;
    }

    if (
        !Number.isFinite(building.estimatedCost) ||
        building.estimatedCost < 0
    ) {
        window.alert(
            "Estimated cost must be zero or a positive number."
        );

        buildingCost.focus();
        return false;
    }

    if (
        !Number.isFinite(building.progress) ||
        building.progress < 0 ||
        building.progress > 100
    ) {
        window.alert(
            "Progress must be a number from 0 through 100."
        );

        buildingProgress.focus();
        return false;
    }

    if (!building.description) {
        window.alert("Enter a project description.");
        buildingDescription.focus();
        return false;
    }

    return true;
}

/**
 * Ask for confirmation and delete one Firestore building.
 */
async function confirmAndDeleteBuilding(building) {
    if (!currentUser || !building.id) {
        return;
    }

    const confirmed = window.confirm(
        `Delete "${building.name}"?\n\n` +
        "This action cannot be undone."
    );

    if (!confirmed) {
        return;
    }

    try {
        await deleteBuilding(building.id);

        console.log(
            `Deleted Firestore building: ${building.id}`
        );

        currentSelectedBuildingId = null;
        resetDetailsPanel();

        await loadBuildingData();

        window.alert(
            `${building.name} was deleted successfully.`
        );
    } catch (error) {
        console.error(
            "Unable to delete the building:",
            error
        );

        window.alert(
            "The building could not be deleted. " +
            "Please check the console and try again."
        );
    }
}

/**
 * Configure modal opening, closing, and saving.
 */
function initializeBuildingModal() {
    addBuildingButton.classList.add("hidden");

    addBuildingButton.addEventListener(
        "click",
        openAddBuildingModal
    );

    closeModalButton.addEventListener(
        "click",
        closeBuildingModal
    );

    cancelModalButton.addEventListener(
        "click",
        closeBuildingModal
    );

    buildingModal.addEventListener("click", (event) => {
        if (event.target === buildingModal) {
            closeBuildingModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            !buildingModal.classList.contains("hidden")
        ) {
            closeBuildingModal();
        }
    });

    buildingForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!currentUser) {
            window.alert(
                "You must be signed in to save a building."
            );

            return;
        }

        const buildingRecord = createBuildingRecord();

        if (!validateBuildingRecord(buildingRecord)) {
            return;
        }

        const editingBuildingId =
            currentEditingBuildingId;

        saveBuildingButton.disabled = true;

        saveBuildingButton.textContent =
            editingBuildingId
                ? "Saving Changes..."
                : "Saving...";

        try {
            let savedDocumentId;
            let successMessage;

            if (editingBuildingId) {
                savedDocumentId = await updateBuilding(
                    editingBuildingId,
                    buildingRecord
                );

                successMessage =
                    `${buildingRecord.name} was updated successfully.`;
            } else {
                savedDocumentId = await addBuilding(
                    buildingRecord
                );

                successMessage =
                    `${buildingRecord.name} was added successfully.`;
            }

            closeBuildingModal();

            await loadBuildingData();

            const savedBuilding = buildings.find((building) => {
                return building.id === savedDocumentId;
            });

            if (savedBuilding) {
                displayBuildingDetails(savedBuilding);
            }

            window.alert(successMessage);
        } catch (error) {
            console.error(
                "Unable to save the building:",
                error
            );

            window.alert(
                "The building could not be saved. " +
                "Please check the console and try again."
            );
        } finally {
            saveBuildingButton.disabled = false;

            if (buildingModal.classList.contains("hidden")) {
                saveBuildingButton.textContent =
                    "Save Building";
            }
        }
    });
}

/**
 * Load buildings from Firestore.
 */
async function loadBuildingData() {
    showLoadingState();

    try {
        const cloudBuildings = await getBuildings();

        if (cloudBuildings.length > 0) {
            buildings = cloudBuildings;

            console.log(
                `Loaded ${buildings.length} buildings from Firestore.`
            );
        } else {
            buildings = localBuildings;

            console.warn(
                "Firestore is empty. Using local backup data."
            );
        }
    } catch (error) {
        console.error(
            "Unable to retrieve Firestore buildings:",
            error
        );

        buildings = localBuildings;

        console.warn(
            "Using local backup data because Firestore " +
            "could not be reached."
        );
    }

    updateDashboardStats();
    filterBuildings();
}

/**
 * Initialize the complete application.
 */
function initializeApplication() {
    initializeAuthentication({
        loginPanel,
        loginForm,
        loginEmail,
        loginPassword,
        loginButton,
        loginMessage,
        userPanel,
        userEmail,
        logoutButton,
        addBuildingButton,
        onAuthStateChanged(user) {
            currentUser = user;

            if (!user) {
                closeBuildingModal();
            }

            refreshSelectedBuildingDetails();
        }
    });
    initializeKingdomButtons();
    initializeBuildingModal();

    searchInput.addEventListener(
        "input",
        filterBuildings
    );

    categoryFilter.addEventListener(
        "change",
        filterBuildings
    );

    sortFilter.addEventListener(
        "change",
        filterBuildings
    );

    loadBuildingData();
}

initializeApplication();
