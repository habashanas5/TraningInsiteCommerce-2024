// Based on https://en.wikipedia.org/wiki/Luhn_algorithm
export default function validateCreditCard(potentialCreditCardNumber?: string) {
    if (!potentialCreditCardNumber) {
        return false;
    }
    if (!/^\d{14,19}$/.test(potentialCreditCardNumber)) {
        return false;
    }
    const sum = potentialCreditCardNumber
        .split("")
        .reverse()
        .map(char => Number.parseInt(char, 10))
        .reduce((sum, current, index) => {
            if (index % 2 === 0) {
                return sum + current;
            }

            const doubled = current * 2;
            return sum + (doubled > 9 ? doubled - 9 : doubled);
        }, 0);
    return sum % 10 === 0;
}
