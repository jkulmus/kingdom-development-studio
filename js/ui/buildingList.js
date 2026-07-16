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
