/**
 * Kingdom Development Studio
 * Main JavaScript file
 *
 * Stores sample building data, renders building cards,
 * displays detailed planning records, filters buildings,
 * and updates dashboard statistics.
 */

const buildings = [
    {
        name: "Grand Tavern",
        kingdom: "Castle Kingdom",
        category: "food",
        phase: "Phase 1",
        status: "Planning",
        size: "8,000 sq ft",
        estimatedCost: 2800000,
        priority: "High",
        targetCompletion: "June 2028",
        progress: 30,
        notes: "Confirm kitchen layout, loading access, seating capacity, and utility requirements.",
        description: "A large medieval-style tavern designed for dining, gathering, and guest entertainment."
    },
    {
        name: "Blacksmith Forge",
        kingdom: "Castle Kingdom",
        category: "activity",
        phase: "Phase 1",
        status: "Planning",
        size: "2,500 sq ft",
        estimatedCost: 950000,
        priority: "High",
        targetCompletion: "September 2028",
        progress: 25,
        notes: "Review ventilation, fire suppression, safety barriers, and class capacity.",
        description: "A hands-on forge area for demonstrations, classes, and immersive artisan experiences."
    },
    {
        name: "Marketplace",
        kingdom: "Castle Kingdom",
        category: "shop",
        phase: "Phase 1",
        status: "Planning",
        size: "6,000 sq ft",
        estimatedCost: 1900000,
        priority: "High",
        targetCompletion: "August 2028",
        progress: 35,
        notes: "Determine vendor stall sizes, storage needs, pathways, and utility connections.",
        description: "A collection of themed shops where guests can browse handmade goods and souvenirs."
    },
    {
        name: "Arena",
        kingdom: "Castle Kingdom",
        category: "entertainment",
        phase: "Phase 1",
        status: "Planning",
        size: "Outdoor",
        estimatedCost: 1250000,
        priority: "Medium",
        targetCompletion: "October 2028",
        progress: 20,
        notes: "Confirm seating, emergency access, performance space, lighting, and sound requirements.",
        description: "A roped-off performance and event space for shows, contests, and demonstrations."
    },
    {
        name: "Traveler Inn",
        kingdom: "Castle Kingdom",
        category: "lodging",
        phase: "Phase 2",
        status: "Concept",
        size: "12,000 sq ft",
        estimatedCost: 5400000,
        priority: "Medium",
        targetCompletion: "May 2030",
        progress: 10,
        notes: "Develop preliminary room count, guest amenities, housekeeping areas, and occupancy assumptions.",
        description: "Overnight lodging designed for guests who want a longer immersive stay."
    },
    {
        name: "Main Gatehouse",
        kingdom: "Castle Kingdom",
        category: "infrastructure",
        phase: "Phase 1",
        status: "Planning",
        size: "3,500 sq ft",
        estimatedCost: 1600000,
        priority: "High",
        targetCompletion: "April 2028",
        progress: 40,
        notes: "Coordinate ticketing, security, guest services, vehicle access, and emergency procedures.",
        description: "Primary entry point with ticketing, security, and guest welcome functions."
    },
    {
        name: "Longhouse Hall",
        kingdom: "Northern Kingdom",
        category: "food",
        phase: "Phase 2",
        status: "Concept",
        size: "7,500 sq ft",
        estimatedCost: 2600000,
        priority: "Medium",
        targetCompletion: "August 2030",
        progress: 10,
        notes: "Develop feast-hall capacity, performance areas, kitchen access, and themed interior concepts.",
        description: "A large northern-style feast hall for themed dining, gathering, and entertainment."
    },
    {
        name: "Warrior Training Yard",
        kingdom: "Northern Kingdom",
        category: "activity",
        phase: "Phase 2",
        status: "Concept",
        size: "Outdoor",
        estimatedCost: 775000,
        priority: "Low",
        targetCompletion: "October 2030",
        progress: 5,
        notes: "Identify activity zones, safety clearances, spectator areas, and equipment storage.",
        description: "An outdoor activity area for demonstrations, training challenges, and guest participation."
    },
    {
        name: "Tea Garden Pavilion",
        kingdom: "Eastern Kingdom",
        category: "food",
        phase: "Phase 3",
        status: "Concept",
        size: "4,000 sq ft",
        estimatedCost: 1400000,
        priority: "Low",
        targetCompletion: "June 2032",
        progress: 5,
        notes: "Plan garden circulation, water features, kitchen support, seating, and quiet gathering spaces.",
        description: "A peaceful garden pavilion designed for themed dining, tea service, and quiet gathering."
    },
    {
        name: "Artisan Courtyard",
        kingdom: "Eastern Kingdom",
        category: "shop",
        phase: "Phase 3",
        status: "Concept",
        size: "5,000 sq ft",
        estimatedCost: 1750000,
        priority: "Low",
        targetCompletion: "September 2032",
        progress: 5,
        notes: "Determine workshop sizes, retail areas, utility needs, storage, and visitor circulation.",
        description: "A marketplace-style courtyard for artisan displays, workshops, and guest shopping."
    }
];

// Main interface elements
const buildingGrid = document.getElementById("buildingGrid");
const detailsPanel = document.getElementById("detailsPanel");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Dashboard statistic elements
const kingdomCount = document.getElementById("kingdomCount");
const buildingCount = document.getElementById("buildingCount");
const phaseOneCount = document.getElementById("phaseOneCount");
const planningCount = document.getElementById("planningCount");

// Kingdom selector buttons
const kingdomButtons = document.querySelectorAll(".kingdom-btn");

let selectedKingdom = "all";

/**
 * Update the top dashboard statistic cards.
 */
function updateDashboardStats() {
    const uniqueKingdoms = new Set(
        buildings.map((building) => building.kingdom)
    );

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

    if (list.length === 0) {
        buildingGrid.innerHTML = `
            <div class="empty-state">
                <h3>No buildings found</h3>
                <p>Try changing the search term or selected filters.</p>
            </div>
        `;
        return;
    }

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
 * Show a detailed planning record for the selected building.
 */
function showBuildingDetails(building) {
    const statusClass = building.status.toLowerCase();
    const priorityClass = building.priority.toLowerCase();

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
                <span class="detail-label">Estimated Cost</span>
                <strong>${formatCurrency(building.estimatedCost)}</strong>
            </div>

            <div class="detail-item">
                <span class="detail-label">Priority</span>
                <span class="priority ${priorityClass}">
                    ${building.priority}
                </span>
            </div>

            <div class="detail-item">
                <span class="detail-label">Target Completion</span>
                <strong>${building.targetCompletion}</strong>
            </div>
        </div>

        <div class="progress-section">
            <div class="progress-heading">
                <span>Planning Progress</span>
                <strong>${building.progress}%</strong>
            </div>

            <div class="progress-track">
                <div
                    class="progress-fill"
                    style="width: ${building.progress}%"
                ></div>
            </div>
        </div>

        <div class="details-description">
            <h3>Project Description</h3>
            <p>${building.description}</p>
        </div>

        <div class="details-notes">
            <h3>Planning Notes</h3>
            <p>${building.notes}</p>
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
 * Convert a number into United States currency.
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Search and filter the building list.
 */
function filterBuildings() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBuildings = buildings.filter((building) => {
        const searchableText = `
            ${building.name}
            ${building.description}
            ${building.kingdom}
            ${building.phase}
            ${building.status}
            ${building.priority}
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

    renderBuildings(filteredBuildings);
}

/**
 * Handle kingdom filter buttons.
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

// Search and category filter events
searchInput.addEventListener("input", filterBuildings);
categoryFilter.addEventListener("change", filterBuildings);

// Initialize the dashboard
updateDashboardStats();
renderBuildings(buildings);