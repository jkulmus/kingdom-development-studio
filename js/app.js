import { buildings } from "./data.js";

import {
    formatCurrency,
    sortBuildings
} from "./utils.js";

import {
    renderBuildings,
    showBuildingDetails
} from "./ui.js";

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

let selectedKingdom = "all";

/**
 * Update the dashboard statistic cards.
 */
function updateDashboardStats() {
    const uniqueKingdoms = new Set(
        buildings.map((building) => building.kingdom)
    );

    const totalInvestment = buildings.reduce((total, building) => {
        return total + building.estimatedCost;
    }, 0);

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
 * Search, filter, and sort the building records.
 */
function filterBuildings() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBuildings = buildings.filter((building) => {
        const searchableText = `
            ${building.name}
            ${building.description}
            ${building.kingdom}
            ${building.category}
            ${building.phase}
            ${building.status}
            ${building.priority}
            ${building.notes}
        `.toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            building.category === selectedCategory;

        const matchesKingdom =
            selectedKingdom === "all" ||
            building.kingdom === selectedKingdom;

        return matchesSearch && matchesCategory && matchesKingdom;
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
 * Handle kingdom selector buttons.
 */
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

// Search, category, and sorting events
searchInput.addEventListener("input", filterBuildings);
categoryFilter.addEventListener("change", filterBuildings);
sortFilter.addEventListener("change", filterBuildings);

// Initialize the application
updateDashboardStats();
filterBuildings();