import {
    formatCategory,
    formatCurrency
} from "../utils.js";

export function showBuildingDetails(
    building,
    detailsPanel,
    options = {}
) {
    const {
        canManage = false,
        onEdit = null,
        onDelete = null
    } = options;

    const statusClass = building.status.toLowerCase();
    const priorityClass = building.priority.toLowerCase();
    const administratorControls = canManage
        ? `
            <div class="details-actions">
                <button type="button" id="editBuildingButton" class="primary-btn">
                    Edit Building
                </button>

                <button type="button" id="deleteBuildingButton" class="danger-btn">
                    Delete Building
                </button>
            </div>
        `
        : "";

    detailsPanel.innerHTML = `
        <div class="details-header">
            <div>
                <p class="details-eyebrow">${building.kingdom}</p>
                <h2>${building.name}</h2>
            </div>

            <span class="status ${statusClass}">${building.status}</span>
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
                <strong>${building.size || "Not entered"}</strong>
            </div>
            <div class="detail-item">
                <span class="detail-label">Estimated Cost</span>
                <strong>${formatCurrency(building.estimatedCost)}</strong>
            </div>
            <div class="detail-item">
                <span class="detail-label">Priority</span>
                <span class="priority ${priorityClass}">${building.priority}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Target Completion</span>
                <strong>${building.targetCompletion || "Not entered"}</strong>
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
                <div class="progress-fill" style="width: ${building.progress}%"></div>
            </div>
        </div>

        <div class="details-description">
            <h3>Project Description</h3>
            <p>${building.description}</p>
        </div>

        <div class="details-notes">
            <h3>Planning Notes</h3>
            <p>${building.notes || "No planning notes entered."}</p>
        </div>

        ${administratorControls}
    `;

    if (canManage) {
        const editButton = document.getElementById("editBuildingButton");
        const deleteButton = document.getElementById("deleteBuildingButton");

        if (typeof onEdit === "function") {
            editButton.addEventListener("click", () => onEdit(building));
        }

        if (typeof onDelete === "function") {
            deleteButton.addEventListener("click", () => onDelete(building));
        }
    }

    detailsPanel.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}
