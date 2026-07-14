/**
 * Convert category values into readable display names.
 */
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

/**
 * Convert a number into United States currency.
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Sort buildings according to the selected option.
 */
export function sortBuildings(buildings, sortValue) {
    const sortedBuildings = [...buildings];

    const priorityValues = {
        High: 3,
        Medium: 2,
        Low: 1
    };

    switch (sortValue) {
        case "cost":
            sortedBuildings.sort((a, b) => {
                return b.estimatedCost - a.estimatedCost;
            });
            break;

        case "priority":
            sortedBuildings.sort((a, b) => {
                return priorityValues[b.priority] - priorityValues[a.priority];
            });
            break;

        case "progress":
            sortedBuildings.sort((a, b) => {
                return b.progress - a.progress;
            });
            break;

        case "phase":
            sortedBuildings.sort((a, b) => {
                return a.phase.localeCompare(b.phase);
            });
            break;

        case "name":
        default:
            sortedBuildings.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }

    return sortedBuildings;
}