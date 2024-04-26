export const convertPaymetricCardType = (cardType: string) => {
    switch (cardType.toLowerCase()) {
        case "vi":
            return "Visa";
        case "mc":
            return "MasterCard";
        case "ax":
            return "American Express";
        case "dc":
            return "Diner's";
        case "di":
            return "Discover";
        case "jc":
            return "JCB";
        case "sw":
            return "Maestro";
        default:
            return "unknown";
    }
};

export const convertTokenExCardType = (cardType: string) => {
    if (cardType.indexOf("american") > -1) {
        return "AMERICAN EXPRESS";
    }

    return cardType.toUpperCase();
};
