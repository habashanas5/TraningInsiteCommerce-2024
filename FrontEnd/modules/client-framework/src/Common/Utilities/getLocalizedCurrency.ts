import { LanguageModel } from "@insite/client-framework/Types/ApiModels";

interface Props {
    amount: number;
    currencySymbol: string;
    language: LanguageModel;
}

/**
 * This function will return a currency amount formatted with the passed in currency and locale.
 * This function should only be used in cases where the formatted currency amount cannot be generated server side.
 */
export const getLocalizedCurrency = ({ amount, language, currencySymbol }: Props) => {
    const locale = language.cultureCode || language.languageCode;
    const options = {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    };
    let currencyFormatter;
    try {
        currencyFormatter = new Intl.NumberFormat(locale, options);
    } catch {
        currencyFormatter = new Intl.NumberFormat(undefined, options);
    }

    // format the same way as CurrencyFormatProvider in the .NET code
    const negativeSymbol = amount < 0 ? "-" : "";

    return `${negativeSymbol}${currencySymbol}${currencyFormatter.format(Math.abs(amount))}`;
};

export default getLocalizedCurrency;
