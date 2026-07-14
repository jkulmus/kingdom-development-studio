import {
    formatCategory,
    formatCurrency
} from "./utils.js";

/**
 * Render building cards to the project dashboard.
 */
export function renderBuildings(
    buildings,
    buildingGrid,
    onBuildingSelected
) {
    buildingGrid.innerHTML = "";

    if (buildings.length === 0) {
        buildingGrid.innerHTML = `
            <div class="empty-state">
                <h3>No buildings found</h3>

                <p>
                    Try changing the search term, category,
                    or selected kingdom.
                </p>
            </div>
        `;

        return;
    }

    buildings.forEach((building) => {
        const card = document.createElement("article");

        card.className = "building-card";
        card.tabIndex = 0;

        card.setAttribute(
            "aria-label",
            `View details for ${building.name}`
        );

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
            onBuildingSelected(building);
        });

        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onBuildingSelected(building);
            }
        });

        buildingGrid.appendChild(card);
    });
}

/**
 * Display a detailed planning record for a selected building.
 */
export function showBuildingDetails(building, detailsPanel) {
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

            <div
                class="progress-track"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${building.progress}"
                aria-label="${building.name} planning progress"
            >
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

    detailsPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}