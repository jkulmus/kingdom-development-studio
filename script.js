const buildings = [
    {
        name: "Grand Tavern",
        kingdom: "Castle Kingdom",
        category: "food",
        phase: "Phase 1",
        status: "Planning",
        size: "8,000 sq ft",
        description: "A large medieval-style tavern designed for dining, gathering, and guest entertainment"
    },
    {
        name: "Blacksmith Forge",
        kingdom: "Castle Kingdom",
        category: "activity",
        phase: "Phase 1",
        status: "Planning",
        size: "2,500 sq ft",
        description: "A hands-on forge area for demonstrations, classes, and immersive artisan experiences"
    },
    {
        name: "Marketplace",
        kingdom: "Castle Kingdom",
        category: "shop",
        phase: "Phase 1",
        status: "Planning",
        size: "6,000 sq ft",
        description: "A collection of themed shops where guests can browse handmade goods and souvenirs"
    },
    {
        name: "Arena",
        kingdom: "Castle Kingdom",
        category: "entertainment",
        phase: "Phase 1",
        status: "Planning",
        size: "Outdoor",
        description: "A roped-off performance and event space for shows, contests, and demonstrations"
    },
    {
        name: "Traveler Inn",
        kingdom: "Castle Kingdom",
        category: "lodging",
        phase: "Phase 2",
        status: "Concept",
        size: "12,000 sq ft",
        description: "Overnight lodging designed for guests who want a longer immersive stay"
    },
    {
        name: "Main Gatehouse",
        kingdom: "Castle Kingdom",
        category: "infrastructure",
        phase: "Phase 1",
        status: "Planning",
        size: "3,500 sq ft",
        description: "Primary entry point with ticketing, security, and guest welcome functions"
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

function renderBuildings(list) {
    buildingGrid.innerHTML = "";

    list.forEach((building) => {
        const card = document.createElement("article");
        card.className = "building-card";

        card.innerHTML = `
            <h3>${building.name}</h3>
            <p>${building.description}</p>
            <span class="badge">${building.kingdom}</span>
            <span class="badge">${building.phase}</span>
        `;

        card.addEventListener("click", () => {
            showBuildingDetails(building);
        });

        buildingGrid.appendChild(card);
    });
}

function showBuildingDetails(building) {
    detailsPanel.innerHTML = `
        <h2>${building.name}</h2>
        <p><strong>Kingdom:</strong> ${building.kingdom}</p>
        <p><strong>Category:</strong> ${formatCategory(building.category)}</p>
        <p><strong>Phase:</strong> ${building.phase}</p>
        <p><strong>Status:</strong> ${building.status}</p>
        <p><strong>Estimated Size:</strong> ${building.size}</p>
        <p>${building.description}</p>
    `;
}

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

function filterBuildings() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredBuildings = buildings.filter((building) => {
        const matchesSearch = building.name.toLowerCase().includes(searchTerm);
        const matchesCategory =
            selectedCategory === "all" || building.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderBuildings(filteredBuildings);
}

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

searchInput.addEventListener("input", filterBuildings);
categoryFilter.addEventListener("change", filterBuildings);

updateDashboardStats();
renderBuildings(buildings);