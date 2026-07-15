/**
 * Convert category values into readable labels.
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
 * Convert a numeric value into United States currency.
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Sort building records according to the selected option.
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
            return sortedBuildings.sort((a, b) => {
                return b.estimatedCost - a.estimatedCost;
            });

        case "priority":
            return sortedBuildings.sort((a, b) => {
                return (
                    priorityValues[b.priority] -
                    priorityValues[a.priority]
                );
            });

        case "progress":
            return sortedBuildings.sort((a, b) => {
                return b.progress - a.progress;
            });

        case "phase":
            return sortedBuildings.sort((a, b) => {
                return a.phase.localeCompare(b.phase);
            });

        case "name":
        default:
            return sortedBuildings.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }
}