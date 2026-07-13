/**
 * Kingdom Development Studio
 * Main JavaScript file
 *
 * This file stores sample building data, renders building cards,
 * displays building details, filters/searches buildings, and updates
 * the dashboard statistics.
 */

const buildings = [
    {
        name: "Grand Tavern",
        kingdom: "Castle Kingdom",
        category: "food",
        phase: "Phase 1",
        status: "Planning",
        size: "8,000 sq ft",
        description: "A large medieval-style tavern designed for dining, gathering, and guest entertainment."
    },
    {
        name: "Blacksmith Forge",
        kingdom: "Castle Kingdom",
        category: "activity",
        phase: "Phase 1",
        status: "Planning",
        size: "2,500 sq ft",
        description: "A hands-on forge area for demonstrations, classes, and immersive artisan experiences."
    },
    {
        name: "Marketplace",
        kingdom: "Castle Kingdom",
        category: "shop",
        phase: "Phase 1",
        status: "Planning",
        size: "6,000 sq ft",
        description: "A collection of themed shops where guests can browse handmade goods and souvenirs."
    },
    {
        name: "Arena",
        kingdom: "Castle Kingdom",
        category: "entertainment",
        phase: "Phase 1",
        status: "Planning",
        size: "Outdoor",
        description: "A roped-off performance and event space for shows, contests, and demonstrations."
    },
    {
        name: "Traveler Inn",
        kingdom: "Castle Kingdom",
        category: "lodging",
        phase: "Phase 2",
        status: "Concept",
        size: "12,000 sq ft",
        description: "Overnight lodging designed for guests who want a longer immersive stay."
    },
    {
        name: "Main Gatehouse",
        kingdom: "Castle Kingdom",
        category: "infrastructure",
        phase: "Phase 1",
        status: "Planning",
        size: "3,500 sq ft",
        description: "Primary entry point with ticketing, security, and guest welcome functions."
    },
    {
        name: "Longhouse Hall",
        kingdom: "Northern Kingdom",
        category: "food",
        phase: "Phase 2",
        status: "Concept",
        size: "7,500 sq ft",
        description: "A large northern-style feast hall for themed dining, gathering, and entertainment."
    },
    {
        name: "Warrior Training Yard",
        kingdom: "Northern Kingdom",
        category: "activity",
        phase: "Phase 2",
        status: "Concept",
        size: "Outdoor",
        description: "An outdoor activity area for demonstrations, training challenges, and guest participation."
    },
    {
        name: "Tea Garden Pavilion",
        kingdom: "Eastern Kingdom",
        category: "food",
        phase: "Phase 3",
        status: "Concept",
        size: "4,000 sq ft",
        description: "A peaceful garden pavilion designed for themed dining, tea service, and quiet gathering."
    },
    {
        name: "Artisan Courtyard",
        kingdom: "Eastern Kingdom",
        category: "shop",
        phase: "Phase 3",
        status: "Concept",
        size: "5,000 sq ft",
        description: "A marketplace-style courtyard for artisan displays, workshops, and guest shopping."
    }
];

const buildingGrid = document.getElementById("buildingGrid");
const detailsPanel = document.getElementById("detailsPanel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const kingdomCount = document.getElementById("kingdomCount");
const buildingCount = document.getElementById("buildingCount");
const phaseOneCount = document.getElementById("phaseOneCount");
const planningCount = document.getElementById("planningCount");

const kingdomButtons = document.querySelectorAll(".kingdom-btn");

let selectedKingdom = "all";

/**
 * Update the top dashboard statistic cards.
 */
function updateDashboardStats() {
    const uniqueKingdoms = new Set(buildings.map((building) => building.kingdom));

    kingdomCount.textContent = uniqueKingdoms.size;
    buildingCount.textContent = buildings.length;

    phaseOneCount.textContent = buildings.filter((building) => {
        return building.phase === "Phase 1";
    }).length;

    planningCount.textContent = buildings.filter((building) => {
        return building.status === "Planning";
    }).length;
}

/**
 * Render building cards to the dashboard.
 */
function renderBuildings(list) {
    buildingGrid.innerHTML = "";

    list.forEach((building) => {
        const card = document.createElement("article");
        card.className = "building-card";

        card.innerHTML = `
            <h3>${building.name}</h3>

            <p>${building.description}</p>

            <div class="card-badges">
                <span class="badge">${building.kingdom}</span>
                <span class="badge">${building.phase}</span>
                <span class="status ${building.status.toLowerCase()}">
                    ${building.status}
                </span>
            </div>
        `;

        card.addEventListener("click", () => {
            showBuildingDetails(building);
        });

        buildingGrid.appendChild(card);
    });
}

/**
 * Show details for the selected building.
 */
function showBuildingDetails(building) {
    const statusClass = building.status.toLowerCase();

    detailsPanel.innerHTML = `
        <div class="details-header">

            <div>
                <p class="details-eyebrow">${building.kingdom}</p>
                <h2>${building.name}</h2>
            </div>

            <span class="status ${statusClass}">
                ${building.status}
            </span>

        </div>

        <div class="details-grid">

            <div class="detail-item">
                <span class="detail-label">Category</span>
                <strong>${formatCategory(building.category)}</strong>
            </div>

            <div class="detail-item">
                <span class="detail-label">Development Phase</span>
                <strong>${building.phase}</strong>
            </div>

            <div class="detail-item">
                <span class="detail-label">Estimated Size</span>
                <strong>${building.size}</strong>
            </div>

            <div class="detail-item">
                <span class="detail-label">Current Status</span>
                <strong>${building.status}</strong>
            </div>

        </div>

        <div class="details-description">

            <h3>Project Description</h3>

            <p>${building.description}</p>

        </div>
    `;
}

/**
 * Convert category values into readable display names.
 */
function formatCategory(category) {
    const categoryNames = {
        lodging: "Lodging",
        food: "Food & Drink",
        shop: "Shop",
        activity: "Activity",
        entertainment: "Entertainment",
        infrastructure: "Infrastructure"
    };

    return categoryNames[category] || category;
}

/**
 * Search and filter the building list.
 */
function filterBuildings() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBuildings = buildings.filter((building) => {
        const matchesSearch = building.name.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" || building.category === selectedCategory;

        const matchesKingdom =
            selectedKingdom === "all" || building.kingdom === selectedKingdom;

        return matchesSearch && matchesCategory && matchesKingdom;
    });

    renderBuildings(filteredBuildings);
}

/**
 * Handle kingdom filter buttons.
 */
kingdomButtons.forEach((button) => {
    button.addEventListener("click", () => {
        kingdomButtons.forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");

        selectedKingdom = button.dataset.kingdom;

        filterBuildings();
    });
});

searchInput.addEventListener("input", filterBuildings);
categoryFilter.addEventListener("change", filterBuildings);

updateDashboardStats();
renderBuildings(buildings);