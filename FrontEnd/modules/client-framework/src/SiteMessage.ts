import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { throwIfClientSide } from "@insite/client-framework/ServerSideRendering";
import { SiteMessageModel } from "@insite/client-framework/Types/ApiModels";
import parse, { HTMLReactParserOptions } from "html-react-parser";

/** Produces a site message dictionary from a site message list. */
export const processSiteMessages = (messages: SiteMessageModel[] | null, languageCode: string | undefined) => {
    throwIfClientSide();

    if (!messages) {
        return {};
    }

    const messagesByNameByLanguage: SafeDictionary<SafeDictionary<string>> = {};

    for (const { languageCode, name, message } of messages) {
        let messagesByName = messagesByNameByLanguage[languageCode ?? ""];
        if (!messagesByName) {
            messagesByNameByLanguage[languageCode ?? ""] = messagesByName = {};
        }

        messagesByName[name] = message;
    }

    const languageKeys = Object.keys(messagesByNameByLanguage);

    switch (languageKeys.length) {
        case 0:
            return {};
        case 1:
            return messagesByNameByLanguage[languageKeys[0]]!;
    }

    const defaultLanguage = messagesByNameByLanguage[""];
    const currentLanguage = messagesByNameByLanguage[languageCode ?? languageKeys.find(value => value !== "")!];

    if (!defaultLanguage) {
        throw new Error("Missing default language messages.");
    }

    if (currentLanguage) {
        for (const message of Object.keys(currentLanguage)) {
            defaultLanguage[message] = currentLanguage[message] || defaultLanguage[message];
        }
    }

    return defaultLanguage;
};

let resolver: (messageName: string) => string | undefined = () => undefined;

export const setResolver = (newResolver: typeof resolver) => {
    resolver = newResolver;
};

/**
 * Provides the natural language message associated with a message name.
 * @param messageName The message code to look up.
 * @param replacementValues Optional; the replacement values for replacement in the message.
 * @returns The resolved message.
 */
const siteMessage = (messageName: string, ...replacementValues: string[]) => {
    const message = resolver(messageName) ?? messageName;
    return parse(replacer(message, replacementValues), parserOptions);
};

export const siteMessageWithCustomParserOptions = (
    messageName: string,
    customParserOptions: HTMLReactParserOptions,
    ...replacementValues: string[]
) => {
    const message = resolver(messageName) ?? messageName;
    return parse(replacer(message, replacementValues), customParserOptions);
};

const replacer = (message: string, replacementValues: string[]) => {
    return replacementValues.reduce((accumulator, replacementValue, replacementIndex) => {
        return accumulator.replace(`{${replacementIndex}}`, replacementValue);
    }, message);
};

export default siteMessage;
