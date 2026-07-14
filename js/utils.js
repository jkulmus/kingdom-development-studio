export function formatCategory(category) {
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

export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(amount);
}

export function sortBuildings(buildings, sortValue) {
    const sortedBuildings = [...buildings];

    const priorityValues = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    switch (sortValue) {
        case "cost":
            return sortedBuildings.sort(
                (a, b) => b.estimatedCost - a.estimatedCost
            );

        case "priority":
            return sortedBuildings.sort(
                (a, b) =>
                    priorityValues[b.priority] -
                    priorityValues[a.priority]
            );

        case "progress":
            return sortedBuildings.sort(
                (a, b) => b.progress - a.progress
            );

        case "phase":
            return sortedBuildings.sort(
                (a, b) => a.phase.localeCompare(b.phase)
            );

        default:
            return sortedBuildings.sort(
                (a, b) => a.name.localeCompare(b.name)
            );
    }
}