import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { throwIfClientSide } from "@insite/client-framework/ServerSideRendering";
import { TranslationDictionaryModel } from "@insite/client-framework/Types/ApiModels";

export const processTranslationDictionaries = (
    translationDictionaries: TranslationDictionaryModel[] | null,
    languageCode: string | undefined,
) => {
    throwIfClientSide();

    const translationsByKeywordByLanguage: SafeDictionary<SafeDictionary<string>> = {};

    if (!translationDictionaries) {
        return {};
    }

    for (const { languageCode, keyword, translation } of translationDictionaries) {
        let messagesByKeyword = translationsByKeywordByLanguage[languageCode ?? ""];
        if (!messagesByKeyword) {
            translationsByKeywordByLanguage[languageCode ?? ""] = messagesByKeyword = {};
        }

        if (translation) {
            messagesByKeyword[keyword] = translation;
        }
    }

    const languageKeys = Object.keys(translationsByKeywordByLanguage);

    if (!languageKeys.length) {
        return {};
    }

    return translationsByKeywordByLanguage[languageCode ?? languageKeys.find(value => value)!] || {};
};

let resolver: (keyword: string) => string | undefined = () => undefined;

export const setTranslationResolver = (newResolver: typeof resolver) => {
    resolver = newResolver;
};

const translate = (text: string, ...replacementValues: readonly string[]): string => {
    if (!text) {
        return "";
    }

    const translation = resolver(text) ?? text;
    return replacer(translation.split("_")[0], replacementValues);
};

const replacer = (text: string, replacementValues: readonly string[]) => {
    return replacementValues.reduce((accumulator, replacementValue, replacementIndex) => {
        return accumulator.replace(`{${replacementIndex}}`, replacementValue);
    }, text);
};

export default translate;
