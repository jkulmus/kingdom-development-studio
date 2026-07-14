/**
 * Kingdom Development Studio
 * Main application controller
 *
 * Loads building records from Firestore, falls back to local
 * sample data when needed, controls filters and sorting,
 * and updates dashboard statistics.
 */

import { buildings as localBuildings } from "./data.js";
import { getBuildings } from "./buildingService.js";
import { formatCurrency, sortBuildings } from "./utils.js";
import { renderBuildings, showBuildingDetails } from "./ui.js";

// Main interface elements
const buildingGrid = document.getElementById("buildingGrid");
const detailsPanel = document.getElementById("detailsPanel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

// Dashboard statistic elements
const kingdomCount = document.getElementById("kingdomCount");
const buildingCount = document.getElementById("buildingCount");
const phaseOneCount = document.getElementById("phaseOneCount");
const planningCount = document.getElementById("planningCount");
const investmentTotal = document.getElementById("investmentTotal");

// Kingdom selector buttons
const kingdomButtons = document.querySelectorAll(".kingdom-btn");

// Application state
let buildings = [];
let selectedKingdom = "all";

/**
 * Display a temporary loading message while Firestore is queried.
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
 * Update all dashboard statistic cards using the loaded data.
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

    investmentTotal.textContent = formatCurrency(totalInvestment);
}

/**
 * Search, filter, and sort the currently loaded records.
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
        (building) => {
            showBuildingDetails(building, detailsPanel);
        }
    );
}

/**
 * Configure the kingdom selector buttons.
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
 * Load building records from Firestore.
 *
 * Local data is retained as a development fallback so the
 * application can still run if Firestore is unavailable or
 * if the collection has not been populated yet.
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
                "The Firestore buildings collection is empty. " +
                "Using local sample data."
            );
        }
    } catch (error) {
        console.error(
            "Unable to retrieve buildings from Firestore:",
            error
        );

        buildings = localBuildings;

        console.warn(
            "Using local sample data because Firestore " +
            "could not be reached."
        );
    }

    updateDashboardStats();
    filterBuildings();
}

/**
 * Initialize application controls and retrieve project data.
 */
function initializeApplication() {
    initializeKingdomButtons();

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