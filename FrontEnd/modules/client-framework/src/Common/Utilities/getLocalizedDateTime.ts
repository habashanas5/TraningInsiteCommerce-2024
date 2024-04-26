import { LanguageModel } from "@insite/client-framework/Types/ApiModels";

interface Props {
    dateTime: Date;
    options?: Intl.DateTimeFormatOptions;
    language?: LanguageModel | null;
}

/**
 * This component will return a dateTime localized to the language of the session.
 * This component should only be used in cases where the dateTime cannot be generated server side.
 */
const getLocalizedDateTime = ({ dateTime, language, options }: Props) => {
    const locale = language?.cultureCode || language?.languageCode;

    try {
        return dateTime.toLocaleDateString(locale, options);
    } catch {
        return dateTime.toLocaleDateString(undefined, options);
    }
};

export default getLocalizedDateTime;
